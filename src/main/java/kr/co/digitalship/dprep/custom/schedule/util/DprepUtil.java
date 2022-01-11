package kr.co.digitalship.dprep.custom.schedule.util;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.locks.ReentrantLock;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.GZIPInputStream;

import javax.annotation.PostConstruct;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.fs.FileSystem;
import org.apache.http.client.utils.URIBuilder;
import org.asynchttpclient.Response;
//import org.quartz.JobExecutionContext;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.talend.dataprep.api.dataset.ColumnMetadata;
import org.talend.dataprep.api.dataset.RowMetadata;
import org.talend.dataprep.api.dataset.statistics.SemanticDomain;
import org.talend.dataprep.command.preparation.GetStepRowMetadata;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import jcifs.smb1.smb1.NtlmPasswordAuthentication;
import jcifs.smb1.smb1.SmbException;
import jcifs.smb1.smb1.SmbFile;
import kr.co.digitalship.dprep.custom.CommonUtil;
import kr.co.digitalship.dprep.custom.DprepHttpUtil;
import kr.co.digitalship.dprep.custom.PcnApiUtil;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.vo.MetadataVO;
import kr.co.digitalship.dprep.custom.schedule.vo.CopyTargetPreparationInfoVO;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

@Component
public class DprepUtil {
	//private static final Logger LOGGER = LoggerFactory.getLogger(DprepUtil.class);
	
    @Value("${preparation.store:}")
    private String store;   
    
    @Value("${preparation.store.file.location:}")
    private String preparationsLocation;
    
    @Value("${smb.host:}")
    private String smbHost;    
    
    @Value("${smb.sharedDir:}")
    private String smbSharedDir;
    
    @Value("${smb.user:}")
    private String smbUser;
    
    @Value("${smb.password:}")
    private String smbPassword;

	@Value("${dataprep.node.no:0}")
	private int nodeNo;    
    
    @Value("${dataset.service.url:}")
    private String[] datasetServiceUrl; 
    
    @Value("${preparation.service.url:}")
    private String[] preparationServiceUrl;       
    
    @Value("${transformation.service.url:}")
    private String[] transformationServiceUrl; 
    
	@Value("${hadoop.read.base.path:}")
    private String hadoopReadBasePath;
    
	@Value("${hadoop.write.base.path:}")
    private String hadoopWriteBasePath;
	
	@Value("${hadoop.copy.write.base.path:}")
    private String hadoopCopyWriteBasePath;	
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;	
	
	@Value("${pcn.api.enabled:false}")
	private boolean pcnApiEnabled; 	
	
    @Autowired
    private ApplicationContext context;	

	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;    
    
    @Autowired
    private ObjectMapper mapper;
    
	@Autowired
	private PcnApiUtil pcnApiUtil;    
	
    private DprepHttpUtil dprepHttpUtil;
    
    private HadoopUtil hadoopUtil;
    
    private NtlmPasswordAuthentication ntlmPasswordAuthentication;
    
    private ReentrantLock reentrantLock;
    
    @Autowired    
    public DprepUtil(DprepHttpUtil dprepHttpUtil, HadoopUtil hadoopUtil) {
    	this.dprepHttpUtil = dprepHttpUtil;
    	this.hadoopUtil = hadoopUtil;
    }
    
	@PostConstruct
	public DprepUtil init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
	    store = properties.getProperty("preparation.store");
	    preparationsLocation = properties.getProperty("preparation.store.file.location");
	    smbHost = properties.getProperty("smb.host");    
	    smbSharedDir = properties.getProperty("smb.sharedDir");
	    smbUser = properties.getProperty("smb.user");
	    smbPassword = properties.getProperty("smb.password");
		nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
		datasetServiceUrl = properties.getProperty("dataset.service.url").trim().split("\\s*,\\s*");
		preparationServiceUrl = properties.getProperty("preparation.service.url").trim().split("\\s*,\\s*");
		transformationServiceUrl = properties.getProperty("transformation.service.url").trim().split("\\s*,\\s*");
		hadoopReadBasePath = properties.getProperty("hadoop.read.base.path");
		hadoopWriteBasePath = properties.getProperty("hadoop.write.base.path");
		hadoopCopyWriteBasePath = properties.getProperty("hadoop.copy.write.base.path");
		dependenceWait = Integer.parseInt(properties.getProperty("schedule.job.dependence.wait"));
		
		pcnApiEnabled = new Boolean(properties.getProperty("pcn.api.enabled")).booleanValue();
			
		return this;
	}
	
	/**
	 * Dataset Create
	 * @param uriBuilders
	 * @param contentType
	 * @param contents
	 * @param context
	 */
	public void createDataset(Deque<URIBuilder> uriBuilders, String contentType, Deque<InputStream> contents) {
		dprepHttpUtil.callSyncPost(uriBuilders, contentType, contents);
	}	
	
	/**
	 * Get MetaData
	 * @param nodeNo
	 * @param datasetId
	 * @param waitTime
	 * @return
	 */
	public MetadataVO getMetadata(String datasetId, int waitTime) {
		return this.getMetadata(datasetId, waitTime, false);
	}
	
    public MetadataVO getMetadata(String datasetId, int waitTime, boolean flag) {
		Map<String, String> params = new HashMap<>();
		params.put("path", dprepHttpUtil.getMetadataPath(datasetId));
		
    	Response response = dprepHttpUtil.callSyncGet(datasetServiceUrl[nodeNo], params, waitTime);

    	MetadataVO metadataVO = new MetadataVO();
		// 데이터셋 메타데이터를 가져올 수 없음.
    	
    	if(200 != response.getStatusCode()) {
        	//if("TDP_API_UNABLE_TO_RETRIEVE_DATASET_METADATA".equals(jsonObject.getString("code"))) {
        	//	return null;
        	//}
    		return metadataVO;
    	}
    	
    	if(StringUtils.isNotBlank(response.getResponseBody())) {
        	JsonObject gsonObject = new JsonParser().parse(response.getResponseBody()).getAsJsonObject();
        	
        	if(flag) {
        		String headerNbLines = StringUtils.defaultString(gsonObject.get("parameters").getAsJsonObject().get("HEADER_NB_LINES").getAsString());
        		String headers = gsonObject.get("parameters").getAsJsonObject().get("COLUMN_HEADERS").getAsString();
        		String delimiter = gsonObject.get("parameters").getAsJsonObject().get("SEPARATOR").getAsString();
        		String encoding = gsonObject.get("encoding").getAsString();
            	
            	metadataVO.setHeaderNbLines(headerNbLines);
            	metadataVO.setHeaders(headers);
            	metadataVO.setDelimiter(delimiter);
            	metadataVO.setEncoding(encoding);
        	}

        	JsonArray gsonArray = gsonObject.get("columns").getAsJsonArray();
    		List<String> columnsTypes = new ArrayList<>();
    		List<String> columnsDomains = new ArrayList<>();
    		List<List<SemanticDomain>> semanticDomains = new ArrayList<>();
    				
        	for(int i = 0, len = gsonArray.size(); i < len; i++) {
        		columnsTypes.add(gsonArray.get(i).getAsJsonObject().get("type").getAsString());
        		columnsDomains.add(gsonArray.get(i).getAsJsonObject().get("domain").getAsString());
        		
        		if(gsonArray.get(i).getAsJsonObject().get("semanticDomains").isJsonArray()) {
            		JsonArray jsonArraySemanticDomains = gsonArray.get(i).getAsJsonObject().get("semanticDomains").getAsJsonArray();

            		List<SemanticDomain> semanticDomainsSub = new ArrayList<>();
                	for(int j = 0, jLen = jsonArraySemanticDomains.size(); j < jLen; j++) {
                		SemanticDomain semanticDomain = new SemanticDomain(jsonArraySemanticDomains.get(j).getAsJsonObject().get("id").getAsString(), 
                                                                           jsonArraySemanticDomains.get(j).getAsJsonObject().get("label").getAsString(), 
                                                                           jsonArraySemanticDomains.get(j).getAsJsonObject().get("frequency").getAsFloat());
                		
                		semanticDomainsSub.add(semanticDomain);
                	}
                	semanticDomains.add(semanticDomainsSub);
        		}
        		else {
        			semanticDomains.add(null);
        		}
        	}
    		
        	metadataVO.setColumnsTypes(columnsTypes);
        	metadataVO.setColumnsDomains(columnsDomains);
        	metadataVO.setSemanticDomains(semanticDomains);
    	}
    	
    	return metadataVO;
    }	

    /**
     * 생성되어 있는 PersistentPreparation 파일 정보 
     * @return
     */
    public List<String> getPersistentPreparationId() {
    	List<String> PersistentPreparationIds = new ArrayList<>();
    	HashSet<String> hashSet = new HashSet<>();
    	
    	if("file".equals(store)) {
    		File directory = new File(preparationsLocation);
    		File[] files = directory.listFiles();
    		
    		Arrays.sort(files, new Comparator<File> () {
				@Override
				public int compare(File file1, File flie2) {
					// TODO Auto-generated method stub
					String s1 = String.valueOf(file1.lastModified());
					String s2 = String.valueOf(flie2.lastModified());
					return s1.compareTo(s2);
				}
    		});
    		
    		for(int i = files.length - 1; i >= 0; i--) {
    			String fileName = files[i].getName();
    			if(fileName.startsWith("PersistentPreparation-")) {
    				if(fileName.contains("sJob") || fileName.contains("sjpr")) {
        				String key = files[i].getName().substring(0, 40);
        				if(!hashSet.contains(key)) {
        					hashSet.add(key);
        					PersistentPreparationIds.add(files[i].getName().replace("PersistentPreparation-", ""));
        				}    					
    				}
    				else {
    					PersistentPreparationIds.add(files[i].getName().replace("PersistentPreparation-", ""));
    				}
    			}
    		}
    		//files = null; // 빠른 반환을 위해 null 처리함
    	}
    	else {
    		String smbPreparationsLocation = "smb://" + smbHost + "/" + smbSharedDir + preparationsLocation + "/";
    		
    		try {
				SmbFile directory = new SmbFile(smbPreparationsLocation, getNtlmPasswordAuthentication());
				SmbFile[] files = directory.listFiles();
				
	    		Arrays.sort(files, new Comparator<SmbFile> () {
					@Override
					public int compare(SmbFile file1, SmbFile file2) {
						// TODO Auto-generated method stub
						String s1 = String.valueOf(file1.getLastModified());
						String s2 = String.valueOf(file2.getLastModified());
						return s1.compareTo(s2);
					}
	    		});				
	    		
	    		for(int i = files.length - 1; i >= 0; i--) {
	    			String fileName = files[i].getName();
	    			if(fileName.startsWith("PersistentPreparation-")) {
	    				if(fileName.contains("sJob") || fileName.contains("sjpr")) {
	        				String key = files[i].getName().substring(0, 40);
	        				if(!hashSet.contains(key)) {
	        					hashSet.add(key);
	        					PersistentPreparationIds.add(files[i].getName().replace("PersistentPreparation-", ""));
	        				}    					
	    				}
	    				else {
	    					PersistentPreparationIds.add(files[i].getName().replace("PersistentPreparation-", ""));
	    				}
	    			}
	    		}
	    		//files = null; // 빠른 반환을 위해 null 처리함
			} 
    		catch (MalformedURLException e) {
				e.printStackTrace();
			} 
    		catch (SmbException e) {
				e.printStackTrace();
			}
    	}
    	//hashSet = null; // 빠른 반환을 위해 null 처리함
    	
    	return PersistentPreparationIds;
    }
    
	public CopyTargetPreparationInfoVO getPreparationBaseInfo(String preparationId, int waitTime) {
    	Map<String, String> params = new HashMap<>();
    	params.put("path", dprepHttpUtil.getPreparationPath(preparationId));
    	
		Response response = dprepHttpUtil.callSyncGet(preparationServiceUrl[nodeNo], params, waitTime);
		
		if(200 != response.getStatusCode()) {
			return null;
		}
		
		if(StringUtils.isNotBlank(response.getResponseBody())) {
			CopyTargetPreparationInfoVO copyTargetPreparationInfoVO = new CopyTargetPreparationInfoVO();
			
			JsonObject gsonObject = new JsonParser().parse(response.getResponseBody()).getAsJsonObject();
			JsonArray gsonArraySteps = gsonObject.get("steps").getAsJsonArray();
			if(null != gsonArraySteps && 2 <= gsonArraySteps.size()) {
				copyTargetPreparationInfoVO.setPreparationId(gsonObject.get("id").getAsString());
				copyTargetPreparationInfoVO.setHeadId(gsonObject.get("headId").getAsString());
				copyTargetPreparationInfoVO.setDatasetId(gsonObject.get("dataSetId").getAsString());
				
				List<String> steps = new ArrayList<>();
				for(int i = 0, len = gsonArraySteps.size(); i < len; i++) {
					steps.add(gsonArraySteps.get(i).getAsString());
				}
				copyTargetPreparationInfoVO.setSteps(steps);
			}
			return copyTargetPreparationInfoVO;
		}
		return null;
    }    
    
    /**
     * 데이터셋의 컬럼 정보를 바탕으로 매칭되는 PreparationId 를 찾는다.
     * @param preparationIds
     * @param toBePrecessedMetaInfo
     * @param waitTime
     * @return
     */
    public CopyTargetPreparationInfoVO getMappingDP(List<String> preparationIds, MetadataVO toBeProcessedMetadataVO, int waitTime) {
    	CopyTargetPreparationInfoVO copyTargetPreparationInfoVO = null;
		boolean flag = false;
		
		for(int i = 0, iLen = preparationIds.size(); i < iLen; i++) {
			copyTargetPreparationInfoVO = this.getPreparationBaseInfo(preparationIds.get(i), waitTime);
			
			if(null != copyTargetPreparationInfoVO && StringUtils.isNotBlank(copyTargetPreparationInfoVO.getDatasetId())) {
				MetadataVO preGeneratedMetadataVO = this.getMetadata(copyTargetPreparationInfoVO.getDatasetId(), waitTime); // 데이터셋 기준의 생성시 정보
				
				int columnsTypeincludeCnt = 0;
				int columnsDomainsincludeCnt = 0; 
				int totalCnt = 0;
			
				if(null == preGeneratedMetadataVO || 0 == preGeneratedMetadataVO.getColumnsTypes().size()) {
					continue;
				}
				else {
					List<String> toBeProcessedColumnsTypes = toBeProcessedMetadataVO.getColumnsTypes();
					List<String> toBeProcessedColumnsDomains = toBeProcessedMetadataVO.getColumnsDomains();
					
					List<String> columnsType = preGeneratedMetadataVO.getColumnsTypes();
					List<String> columnsDomain = preGeneratedMetadataVO.getColumnsDomains();					
				
					totalCnt = toBeProcessedColumnsTypes.size();
					if(toBeProcessedColumnsTypes.size() == columnsType.size()) {
						for(int j = 0, jLen = toBeProcessedColumnsTypes.size(); j < jLen; j++) {
							if(toBeProcessedColumnsTypes.get(j).equals(columnsType.get(j))) {
								columnsTypeincludeCnt += 1;
							}
							
							if(toBeProcessedColumnsDomains.get(j).equals(columnsDomain.get(j))) {
								columnsDomainsincludeCnt += 1;
							}
						}
					}					
				}
				
				int columnsTypePercentage = new BigDecimal(columnsTypeincludeCnt).divide(new BigDecimal(totalCnt), 2, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal(100)).intValue();
				int columnsDomainPercentage = new BigDecimal(columnsDomainsincludeCnt).divide(new BigDecimal(totalCnt), 2, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal(100)).intValue();
				columnsDomainPercentage = 100; // 도메인 판단 하지 않음. 식별 도메인중에서 변경가능하기 때문에.
				
				if(70 <= columnsTypePercentage && 70 <= columnsDomainPercentage) {
					List<String> steps = copyTargetPreparationInfoVO.getSteps();				
					RowMetadata preRowMetadataFinal = context.getBean(GetStepRowMetadata.class, steps.get(steps.size() - 1)).execute(); // 최종 컬럼 정보를 가져오기 위한.
					List<ColumnMetadata> preRowMetadataFinalColumns = preRowMetadataFinal.getColumns();
					
					List<String> columnsType = new ArrayList<>();
					List<String> columnsDomain = new ArrayList<>();
					List<List<SemanticDomain>> semanticDomains = new ArrayList<>();
					
					for(int j = 0, jLen = preRowMetadataFinalColumns.size(); j < jLen; j++) {
						ColumnMetadata columnMetadata = preRowMetadataFinalColumns.get(j);
						columnsType.add(columnMetadata.getType());
						columnsDomain.add(columnMetadata.getDomain());
						
						List<SemanticDomain> semanticDomainsFinal = preRowMetadataFinalColumns.get(j).getSemanticDomains();
						List<SemanticDomain> semanticDomain = new ArrayList<>();
						for(int k = 0, kLen = semanticDomainsFinal.size(); k < kLen; k++) {
							semanticDomain.add((SemanticDomain)SerializationUtils.clone(semanticDomainsFinal.get(k)));
						}
						semanticDomains.add(semanticDomain);
					}
					copyTargetPreparationInfoVO.setColumnsTypes(columnsType);
					copyTargetPreparationInfoVO.setColumnsDomains(columnsDomain);
					copyTargetPreparationInfoVO.setSemanticDomains(semanticDomains);
					
					flag = true;
					break;
				}
			}
		}
		
		if(flag) {
			return copyTargetPreparationInfoVO;			
		}
		else {
			return null;			
		}
    }
    
    /**
     * PersistentPreparation 을 복제
     * @param preparationId
     * @param datasetId
     * @param fileName
     * @param waitTime
     * @return
     */
    public String copyPersistentPreparation(String preparationId, String datasetId, String fileName, int waitTime) {
    	Map<String, String> params = new HashMap<>();
    	params.put("path", dprepHttpUtil.getPreparationCopyPath(preparationId));
    	params.put("preparationId", preparationId);
    	params.put("datasetId", datasetId);
    	params.put("name", fileName + " Preparation");
    	params.put("destination", "Lw==");
    	
    	Response response = null;
    	while(null == response || StringUtils.isBlank(response.getResponseBody())) {
    		response = dprepHttpUtil.callSyncGet(preparationServiceUrl[nodeNo], params, waitTime);
    		
    		if(0 < waitTime && (null == response || StringUtils.isBlank(response.getResponseBody()))) {
	    		try {
					Thread.sleep(waitTime);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}	    			
    		}    		
    	}
    	
		// 
    	if(200 != response.getStatusCode()) {
    		//JsonObject gsonObject = new JsonParser().parse(response.getResponseBody()).getAsJsonObject();        		
    		//if("TDP_PS_PREPARATION_NAME_ALREADY_USED".equals(gsonObject.get("code").getAsString())) {
    		//	return null;
    		//}
    		return null;
    	}
    	
    	return response.getResponseBody();
    }
    
    /**
     * PersistentPreparation 을 복제 (초기 - 전처리 전/후 비교를 위해 도메인 정보만 일부 변경한 레시피의 복제)
     * @param preparationId
     * @param datasetId
     * @param fileName
     * @param waitTime
     * @return
     */
    public String initCopyPersistentPreparation(String preparationId, String datasetId, String fileName, int waitTime) {
    	Map<String, String> params = new HashMap<>();
    	params.put("path", dprepHttpUtil.getPreparationInitCopyPath(preparationId));
    	params.put("preparationId", preparationId);
    	params.put("datasetId", datasetId);
    	params.put("name", fileName + " Preparation");
    	params.put("destination", "Lw==");
    	
    	Response response = null;
    	while(null == response || StringUtils.isBlank(response.getResponseBody())) {
    		response = dprepHttpUtil.callSyncGet(preparationServiceUrl[nodeNo], params, waitTime);
    		
    		if(0 < waitTime && (null == response || StringUtils.isBlank(response.getResponseBody()))) {
	    		try {
					Thread.sleep(waitTime);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}	    			
    		}    		
    	}
    	
		// 
    	if(200 != response.getStatusCode()) {
    		//JsonObject gsonObject = new JsonParser().parse(response.getResponseBody()).getAsJsonObject();        		
    		//if("TDP_PS_PREPARATION_NAME_ALREADY_USED".equals(gsonObject.get("code").getAsString())) {
    		//	return null;
    		//}
    		return null;
    	}
    	
    	return response.getResponseBody();
    }
    
    public String initRecipe(String datasetId) {
    	String preparationId = null;
    	
		try {
			// PersistentPreparation 생성
		    String preparationName = "init preparation";
		    URIBuilder uriBuilder = new URIBuilder(preparationServiceUrl[nodeNo]);

			String preparationInitPath = "/api/preparations"; // POST - json
			uriBuilder.setPath(preparationInitPath);
			uriBuilder.addParameter("folder", "Lw==");
			
			JsonObject jsonObject = new JsonObject();
			jsonObject.addProperty("name", preparationName);
			jsonObject.addProperty("dataSetId", datasetId);
			
			Response response = dprepHttpUtil.callSyncJson(uriBuilder, "post", jsonObject);			
			preparationId = response.getResponseBody();

			// 4번째 컬럼 정보 확인
			String domainTypePath1 = String.format("/api/datasets/%s/columns/%s/types", datasetId, "0003"); // GET - json
			uriBuilder.setPath(domainTypePath1);
			
			response = dprepHttpUtil.callSyncJson(uriBuilder, "get", null);			
			JsonArray type1 = new Gson().fromJson(response.getResponseBody(), JsonArray.class);			
			
			// 4번째 컬럼 도메인 변경
			String doaminChangeActionPath = String.format("/api/preparations/%s/actions", preparationId); // POST - json
			uriBuilder.setPath(doaminChangeActionPath);
			
			// type1 에서 new 항목에 대해서 뽑아야... (new_domain_frequency)
			JsonObject parameters = new JsonObject();
			parameters.addProperty("scope", "column");
			parameters.addProperty("column_id", "0003");
			parameters.addProperty("column_name", "4열");
			parameters.addProperty("new_domain_id", "초미세먼지");
			parameters.addProperty("new_domain_label", "초미세먼지");			
			
			for(int i = 0, len = type1.size(); i < len; i++) {
				if("초미세먼지".equals(type1.get(i).getAsJsonObject().get("id").getAsString())) {
					parameters.addProperty("new_domain_frequency", type1.get(i).getAsJsonObject().get("frequency").getAsString());
				}
			}
			
			JsonObject action = new JsonObject();
			action.addProperty("action", "domain_change");
			action.add("parameters", parameters);
			
			JsonArray actions = new JsonArray();
			actions.add(action);
			
			jsonObject = new JsonObject();
			jsonObject.add("actions", actions);
			
			response = dprepHttpUtil.callSyncJson(uriBuilder, "post", jsonObject);
			
			// 6번째 컬럼 정보 확인
			String domainTypePath2 = String.format("/api/datasets/%s/columns/%s/types", datasetId, "0005"); // GET - json
			uriBuilder.setPath(domainTypePath2);
			
			response = dprepHttpUtil.callSyncJson(uriBuilder, "get", null);
			JsonArray type2 = new Gson().fromJson(response.getResponseBody(), JsonArray.class);		
			
			// 6번째 컬럼 도메인 변경
			doaminChangeActionPath = String.format("/api/preparations/%s/actions", preparationId); // POST - json
			uriBuilder.setPath(doaminChangeActionPath);
			
			// type2 에서 new 항목에 대해서 뽑아야... (new_domain_frequency)
			parameters = new JsonObject();
			parameters.addProperty("scope", "column");
			parameters.addProperty("column_id", "0005");
			parameters.addProperty("column_name", "6열");
			parameters.addProperty("new_domain_id", "습도");
			parameters.addProperty("new_domain_label", "습도");
			
			for(int i = 0, len = type2.size(); i < len; i++) {
				if("습도".equals(type2.get(i).getAsJsonObject().get("id").getAsString())) {
					parameters.addProperty("new_domain_frequency", type2.get(i).getAsJsonObject().get("frequency").getAsString());
				}
			}			
			
			action = new JsonObject();
			action.addProperty("action", "domain_change");
			action.add("parameters", parameters);
			
			actions = new JsonArray();
			actions.add(action);
			
			jsonObject = new JsonObject();
			jsonObject.add("actions", actions);
			
			response = dprepHttpUtil.callSyncJson(uriBuilder, "post", jsonObject);		
			
			// PersistentPreparation 반영 (정확한 역활을 잘 모르겠지만...)
			String completePath = String.format("/api/preparations/%s", preparationId); // PUT - json
			uriBuilder.setPath(completePath);
			
			jsonObject = new JsonObject();
			jsonObject.addProperty("name", preparationName);		
			
			response = dprepHttpUtil.callSyncJson(uriBuilder, "put", jsonObject);
			
        	// StepRowMetadata 생성을 위해...export
			MetadataVO metadataVO = this.getMetadata(datasetId, dependenceWait, true);
			
	    	Map<String, String> params = new HashMap<>();
	    	params.put("path", dprepHttpUtil.getExportPath());    	
			params.put("exportType", "CSV");
	    	params.put("exportParameters.csv_fields_delimiter", metadataVO.getDelimiter());    	
			params.put("exportParameters.csv_enclosure_character", "");
			params.put("exportParameters.csv_escape_character", "");
			params.put("exportParameters.csv_enclosure_mode", "text_only");
			params.put("exportParameters.csv_encoding", metadataVO.getEncoding());
			
			params.put("datasetId", datasetId);
			params.put("preparationId", preparationId);
			params.put("exportParameters.fileName", preparationName);
			
			response = dprepHttpUtil.callSyncGet(transformationServiceUrl[nodeNo], params, dependenceWait);
		} 
		catch (URISyntaxException e) {
			e.printStackTrace();
		}
		return preparationId;
	}
    
    // StepRowMetadata
    
    public RowMetadata getStepRowMetadata(String preparationId) {
    	URIBuilder uriBuilder = null;
    	
    	try {
			uriBuilder = new URIBuilder(preparationServiceUrl[nodeNo]);
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		String datailsPath = String.format("/api/preparations/%s/details", preparationId); // GET - json	
		uriBuilder.setPath(datailsPath);
		
		Response response = dprepHttpUtil.callSyncJson(uriBuilder, "get", null);
		JsonObject persistant = new Gson().fromJson(response.getResponseBody(), JsonObject.class);
		JsonArray steps = persistant.get("steps").getAsJsonArray();

		RowMetadata rowMetadata = null;
		for(int i = steps.size() - 1; i >= 0; i--) {
			String stepId = steps.get(i).getAsString();
			
			String getStepMetadataPath = String.format("/preparations/steps/%s/metadata", stepId);
			uriBuilder.setPath(getStepMetadataPath);
			
			response = dprepHttpUtil.callSyncJson(uriBuilder, "get", null);
			
			try {
				rowMetadata = mapper.readValue(response.getResponseBody(), RowMetadata.class);
			} 
			catch (IOException e) {
				e.printStackTrace();
			}
			
			if(null != rowMetadata) {
				break;
			}
		}
		return rowMetadata;
    }
    
    public String extractYearFromFileName(String fileName) {
		Pattern pattern = Pattern.compile("(19|20)\\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])");
		Matcher matcher = pattern.matcher(fileName);
				
		if(matcher.find()) {
			String fullYear = new String(matcher.group());
		    
			pattern = Pattern.compile("(19|20)\\d{2}");
			matcher = pattern.matcher(fullYear);
			
			if(matcher.find()) {
				return matcher.group();
			}
		}
		return null;
    }
    
    /**
     * Export Single
     * @param listOfProcessingResultInfomationVO
     * @param preparationBaseInfo
     * @param delimiter
     * @param encoding
     * @param waitTime
     */
    public void export(ProcessingInfomationVO processingInfomationVO, MetadataVO metadataVO, int waitTime) {
    	List<String> datasetIds = processingInfomationVO.getDatasetIds();
		List<String> preparationIds = processingInfomationVO.getPreparationIds();
		String fileName = processingInfomationVO.getFileNames().get(0);
		String filePath = processingInfomationVO.getFilePath();    	
    	
		String hadoopWritePath = hadoopWriteBasePath;
		String hadoopCopyWritePath = hadoopCopyWriteBasePath;
		
        String wsId = (String)springRedisTemplateUtil.valueGet("WS_ID");

        String token = pcnApiUtil.getAuth();            
        if(pcnApiEnabled) {
            JsonObject workspace = pcnApiUtil.getWorkspace(token, Integer.parseInt(wsId));
            hadoopReadBasePath = workspace.get("body").getAsJsonObject().get("filePath").getAsString();
            hadoopReadBasePath = hadoopReadBasePath.substring(0, hadoopReadBasePath.length() - 1);
            hadoopWritePath = hadoopWritePath + "/" + wsId;
            hadoopCopyWritePath = hadoopCopyWritePath + "/" + wsId;
        }        	
		
		filePath = filePath.replace(hadoopReadBasePath, hadoopWritePath);
		
    	Map<String, String> params = new HashMap<>();
    	params.put("path", dprepHttpUtil.getExportPath());    	
		params.put("exportType", "CSV");
    	params.put("exportParameters.csv_fields_delimiter", metadataVO.getDelimiter());    	
		params.put("exportParameters.csv_enclosure_character", "");
		params.put("exportParameters.csv_escape_character", "");
		params.put("exportParameters.csv_enclosure_mode", "text_only");
		params.put("exportParameters.csv_encoding", metadataVO.getEncoding());
    	
		FileSystem fs = hadoopUtil.getFs();		
		try {
			StringBuffer stringBuffer = new StringBuffer();
			
			for (int i = 0, len = preparationIds.size(); i < len; i++) {
		    	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인	    	
		    	if(!isPossibleLock) {
	    			reentrantLock.lock();

					params.put("datasetId", datasetIds.get(i));
					params.put("preparationId", preparationIds.get(i));
					params.put("exportParameters.fileName", fileName);	    			
	    			
					Response response = dprepHttpUtil.callSyncGet(transformationServiceUrl[nodeNo], params, waitTime);
					// 원본에 없던 임의로 붙은 헤더인 경우 제거
					if("0".equals(metadataVO.getHeaderNbLines()) || i > 0) {
						stringBuffer = CommonUtil.readAndExcludeHeader(stringBuffer, response.getResponseBody());
					}
					else {
						stringBuffer.append(response.getResponseBody());
					}
					
					if(i == len - 1) {
						hadoopUtil.write(fs, stringBuffer.toString(), filePath);
						
						String dstPath = filePath.replace(hadoopWritePath, hadoopCopyWritePath);
						hadoopUtil.copy(filePath, dstPath); // 복제 (세종대용 복제)						
					}
					Thread.sleep(1000);
					reentrantLock.unlock();
		    	}
			}			
		}
		catch (InterruptedException e) {
			e.printStackTrace();
		}
		finally {
			if(reentrantLock.isLocked()) {
				reentrantLock.unlock();
			}
			
			if(null != fs) {
				try { fs.close(); } catch (IOException e) {}
			}    			
		}
    }    
    
    public void deletePreparationById(List<String> ids, int waitTime) {
    	Deque<URIBuilder> uriBuilders = new ConcurrentLinkedDeque<URIBuilder>();
    	    
    	for(int i = 0, len = ids.size(); i < len; i++) {
    		try {
				URIBuilder uriBuilder = new URIBuilder(datasetServiceUrl[nodeNo]);
				uriBuilder.setPath(dprepHttpUtil.getPreparationDeletePath(ids.get(i)));
				
				uriBuilders.add(uriBuilder);
			} 
    		catch (URISyntaxException e) {
				e.printStackTrace();
			}
    	}
    	
    	if(0 < uriBuilders.size()) {
    		dprepHttpUtil.callAsyncDelete(uriBuilders);
    	}
    }
    
    public void deleteStepById(String preparationId, List<String> stepIds, int waitTime) {
    	Deque<URIBuilder> uriBuilders = new ConcurrentLinkedDeque<URIBuilder>();
	    
    	for(int i = 0, len = stepIds.size(); i < len; i++) {
    		try {
				URIBuilder uriBuilder = new URIBuilder(datasetServiceUrl[nodeNo]);
				uriBuilder.setPath(dprepHttpUtil.getStepDeletePath(preparationId, stepIds.get(i)));
				
				uriBuilders.add(uriBuilder);
			} 
    		catch (URISyntaxException e) {
				e.printStackTrace();
			}
    	}
    	
    	if(0 < uriBuilders.size()) {
    		dprepHttpUtil.callAsyncDelete(uriBuilders);
    	}  	
    }    
    
    public void deleteDatasetById(List<String> ids, int waitTime) {
    	Deque<URIBuilder> uriBuilders = new ConcurrentLinkedDeque<URIBuilder>();
	    
    	for(int i = 0, len = ids.size(); i < len; i++) {
    		try {
				URIBuilder uriBuilder = new URIBuilder(datasetServiceUrl[nodeNo]);
				uriBuilder.setPath(dprepHttpUtil.getDatasetDeletePath(ids.get(i)));
				
				uriBuilders.add(uriBuilder);
			} 
    		catch (URISyntaxException e) {
				e.printStackTrace();
			}
    	}
    	
    	if(0 < uriBuilders.size()) {
    		dprepHttpUtil.callAsyncDelete(uriBuilders);
    	}	
    }    
    
    private NtlmPasswordAuthentication getNtlmPasswordAuthentication() {
    	if(null == ntlmPasswordAuthentication) {
    		ntlmPasswordAuthentication = new NtlmPasswordAuthentication(null, smbUser, smbPassword);
    	}
    	return ntlmPasswordAuthentication;
    }
    
    /**
     * k-weather 정재 위해 사용
     * @param columnIdx
     * @param token
     * @return
     */
	public JsonObject getReplaceOnValue(int columnIdx, String token, String columnName) {
		JsonObject gsonObject = new JsonObject();
		gsonObject.addProperty("action", "replace_on_value");
		
		JsonObject gsonObjectSub1 = new JsonObject();
		JsonObject gsonObjectSub2 = new JsonObject();
		
		gsonObjectSub2.addProperty("operator", "ends_with");
		gsonObjectSub2.addProperty("token", token);
		
		gsonObjectSub1.add("cell_value", gsonObjectSub2);		
		gsonObjectSub1.addProperty("column_id", StringUtils.leftPad(String.valueOf(columnIdx), 4, '0'));
		gsonObjectSub1.addProperty("column_name", columnName);
		gsonObjectSub1.addProperty("create_new_column", "false");
		gsonObjectSub1.addProperty("replace_entire_cell", "false");
		gsonObjectSub1.addProperty("replace_value", "");
		gsonObjectSub1.addProperty("row_id", "");
		gsonObjectSub1.addProperty("scope", "column");
				
		gsonObject.add("parameters", gsonObjectSub1);
		
		return gsonObject;
	}

	/**
	 * k-weather 정재 위해 사용
	 * @param columnIdx
	 * @param frequency
	 * @param id
	 * @param label
	 * @return
	 */
	public JsonObject getDomainChange(int columnIdx, String columnName, String frequency, String id, String label) {
		JsonObject gsonObject = new JsonObject();
		gsonObject.addProperty("action", "domain_change");
		
		JsonObject gsonObjectSub1 = new JsonObject();
		
		gsonObjectSub1.addProperty("column_id", StringUtils.leftPad(String.valueOf(columnIdx), 4, '0'));
		gsonObjectSub1.addProperty("column_name", columnName);
		gsonObjectSub1.addProperty("new_domain_frequency", frequency);
		gsonObjectSub1.addProperty("new_domain_id", id);
		gsonObjectSub1.addProperty("new_domain_label", label);
		gsonObjectSub1.addProperty("scope", "column");
				
		gsonObject.add("parameters", gsonObjectSub1);
		
		return gsonObject;
	}
	
    public void executeAction(List<String> preparationIds, JsonObject gsonObject) {
		reentrantLock = new ReentrantLock();
		
    	for(int i = 0, len = preparationIds.size(); i < len; i++) {
        	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
        	
        	if(!isPossibleLock) {
        		try {
					reentrantLock.lock();
					
					Map<String, String> params = new HashMap<>();
					params.put("path", dprepHttpUtil.getPreparationActionPath(preparationIds.get(i)));    		
					
					dprepHttpUtil.callSyncPost(datasetServiceUrl[nodeNo], params, gsonObject);
					
					Thread.sleep(1000);
				} 
        		catch (InterruptedException e) {
					e.printStackTrace();
				}
        		finally {
        			reentrantLock.unlock();
        		}
        	}
    	}    	
    }
    
    /**
     * 초기 도메인 변경만 적용한 레시피의 삭제용
     * 
     * PersistentPreparation 를 제거한 후 개별 PersistentStep / StepRowMetadata 를 확인하여 제거
     * Dataset / Metadata 제거
     * @param excludeSplitIdx
     */
    public void deleteDprepData(String preparationId) {
    	reentrantLock = new ReentrantLock();
    	
    	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
    	if(!isPossibleLock) {
    		try {			    		
	    		reentrantLock.lock();
	    		
	    		CopyTargetPreparationInfoVO removeTargetPreparation = this.getPreparationBaseInfo(preparationId, dependenceWait);
	    		List<String> deletePersistentStepTarget = new ArrayList<>();
	    		
	    		if(null != removeTargetPreparation && null != removeTargetPreparation.getSteps()) {
	    			List<String> steps = removeTargetPreparation.getSteps();
	    			steps.remove(0); // PersistentPreparation 에 기본 추가되어 있는 디폴트 정보 ( f6e172c33bdacbc69bca9d32b2bd78174712a171 ) 로 실제 파일은 존재하지 않음.
	    			
	    			if(0 < steps.size()) {
	    				deletePersistentStepTarget.addAll(steps);
	    			}
	    		}  
	    		List<String> preparationIds = new ArrayList<>();
	    		preparationIds.add(preparationId);
	    		
	    		this.deletePreparationById(preparationIds, dependenceWait); // PersistentPreparation 삭제
	    		
				Thread.sleep(1000);
				
				// 잔여 물리 파일 제거 (StepRowMetadata, PersistentStep 삭제, PreparationActions은 일부 공유되고 있으며 확인이 쉽지 않은 관계로 삭제하지 않음.)
				for(int i = 0, len = deletePersistentStepTarget.size(); i < len; i++) {
		    		File persistentStepFile = new File(preparationsLocation + "/PersistentStep-" + deletePersistentStepTarget.get(i));
		    		
		    		if(persistentStepFile.isFile()) {
		        		try (InputStream in = Files.newInputStream(Paths.get(persistentStepFile.getPath()), StandardOpenOption.READ); GZIPInputStream gZIPInputStream = new GZIPInputStream(in)) {
		        			String persistentStep = IOUtils.toString(gZIPInputStream, "UTF-8");
		        			
		        			if(StringUtils.isNotBlank(persistentStep)) {
			        			JsonObject gsonObjectPersistentStep = new JsonParser().parse(persistentStep).getAsJsonObject();
			        			String preparationActionsId = gsonObjectPersistentStep.get("contentId").getAsString();
			        			
			        			File preparationActionsFile = new File(preparationsLocation + "/PreparationActions-" + preparationActionsId); // PreparationActions 삭제
			        			if(preparationActionsFile.isFile()) {
			        				preparationActionsFile.delete();        				
			        			}
			        			
			        			if(null != gsonObjectPersistentStep.get("rowMetadata")) {
				        			String stepRowMetadataId = gsonObjectPersistentStep.get("rowMetadata").getAsString();
				        			
				        			File stepRowMetadataFile = new File(preparationsLocation + "/StepRowMetadata-" + stepRowMetadataId); // StepRowMetadata 삭제
				        			if(stepRowMetadataFile.isFile()) {
				            			stepRowMetadataFile.delete();        				
				        			}			        				
			        			}
		        			}
		    	        } 
		        		catch (IOException | NullPointerException e) {
		        			e.printStackTrace();
		    	        } 
		        		finally {
		        			persistentStepFile.delete();
		    	        }    			
		    		}
				}						
			} 
    		catch (InterruptedException e) {
				e.printStackTrace();
			}
    		finally {
    			reentrantLock.unlock();
    		}
    	}
    }
    
    public void deleteDprepData(int excludeSplitIdx) {
    	Gson gson = new Gson();
    	reentrantLock = new ReentrantLock();
    	
		// 레시피 파일 제거	
		String jsonStr = (String)springRedisTemplateUtil.valueGet("LIST_OF_EXPORT_" + nodeNo);	
		if(StringUtils.isNotBlank(jsonStr)) {
			JsonArray gsonArrayExport = new JsonParser().parse(jsonStr).getAsJsonArray();
			
			List<ProcessingInfomationVO> export = gson.fromJson(gsonArrayExport, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
			
			if(0 < export.size()) {
				List<String> deletePersistentStepTarget = new ArrayList<>();
				
				for(int i = 0, len = export.size(); i < len; i++) {
			    	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
			    	if(!isPossibleLock) {
			    		try {			    		
				    		reentrantLock.lock();
				    		
				    		ProcessingInfomationVO processingInfomationVO = export.get(i);
				    		List<String> preparationIds = processingInfomationVO.getPreparationIds();
				    		List<String> datasetIds = processingInfomationVO.getDatasetIds();
				    		//List<String> fileNames = processingInfomationVO.getFileNames();

							// 분할된 파일중 excludeSplitIdx 이외의 Preparation 제거
				    		for(int j = preparationIds.size() - 1; j >= 0; j--) {
				    			int splitIdx = Integer.parseInt(datasetIds.get(j).split("-")[4].substring(8));
				    			if(excludeSplitIdx == splitIdx) {
				    				preparationIds.remove(j);
				    				datasetIds.remove(j);
				    				
				    				continue;
				    			}
				    			
				    			CopyTargetPreparationInfoVO copyTargetPreparationInfoVO = this.getPreparationBaseInfo(preparationIds.get(j), dependenceWait);
				    			if(null != copyTargetPreparationInfoVO && null != copyTargetPreparationInfoVO.getSteps()) {
				    				List<String> steps = copyTargetPreparationInfoVO.getSteps();
				    				steps.remove(0); // PersistentPreparation 에 기본 추가되어 있는 디폴트 정보 ( f6e172c33bdacbc69bca9d32b2bd78174712a171 ) 로 실제 파일은 존재하지 않음.
				    				
				    				if(0 < steps.size()) {
				    					deletePersistentStepTarget.addAll(steps);
				    				}
				    			}
				    		}
				    		
				    		this.deletePreparationById(preparationIds, dependenceWait); // PersistentPreparation 삭제
				    		
							Thread.sleep(1000);
						} 
			    		catch (InterruptedException e) {
							e.printStackTrace();
						}
			    		finally {
			    			reentrantLock.unlock();
			    		}
			    	}
				}
				
				// 잔여 물리 파일 제거 (StepRowMetadata, PersistentStep 삭제, PreparationActions은 일부 공유되고 있으며 확인이 쉽지 않은 관계로 삭제하지 않음.)
				for(int i = 0, len = deletePersistentStepTarget.size(); i < len; i++) {
		    		File persistentStepFile = new File(preparationsLocation + "/PersistentStep-" + deletePersistentStepTarget.get(i));
		    		
		    		if(persistentStepFile.isFile()) {
		        		try (InputStream in = Files.newInputStream(Paths.get(persistentStepFile.getPath()), StandardOpenOption.READ); GZIPInputStream gZIPInputStream = new GZIPInputStream(in)) {
		        			String persistentStep = IOUtils.toString(gZIPInputStream, "UTF-8");
		        			
		        			if(StringUtils.isNotBlank(persistentStep)) {
			        			JsonObject gsonObjectPersistentStep = new JsonParser().parse(persistentStep).getAsJsonObject();
			        			
			        			if(null != gsonObjectPersistentStep.get("rowMetadata")) {
				        			String stepRowMetadataId = gsonObjectPersistentStep.get("rowMetadata").getAsString();
				        			
				        			File stepRowMetadataFile = new File(preparationsLocation + "/StepRowMetadata-" + stepRowMetadataId); // StepRowMetadata 삭제
				        			if(stepRowMetadataFile.isFile()) {
				            			stepRowMetadataFile.delete();        				
				        			}			        				
			        			}
		        			}
		    	        } 
		        		catch (IOException | NullPointerException e) {
		        			e.printStackTrace();
		    	        } 
		        		finally {
		        			persistentStepFile.delete();
		    	        }    			
		    		}
				}								
			}
		}
		
		// 데이터셋 파일 제거 (Dataset, Metadata)
		jsonStr = (String)springRedisTemplateUtil.valueGet("LIST_OF_DATASET_INFO_" + nodeNo);
		if(StringUtils.isNotBlank(jsonStr)) {
			JsonArray gsonArrayDatasetInfo = new JsonParser().parse(jsonStr).getAsJsonArray();
			
			List<ProcessingInfomationVO> datasetInfo = gson.fromJson(gsonArrayDatasetInfo, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
			if(0 < datasetInfo.size()) {
				for(int i = 0, len = datasetInfo.size(); i < len; i++) {
			    	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
			    	if(!isPossibleLock) {
			    		try {			    		
				    		reentrantLock.lock();
				    		
				    		ProcessingInfomationVO processingInfomationVO = datasetInfo.get(i);
				    		List<String> datasetIds = processingInfomationVO.getDatasetIds();
				    		
							// 분할된 파일중 excludeSplitIdx 이외의 Preparation 제거
				    		for(int j = datasetIds.size() - 1; j >= 0; j--) {
				    			int splitIdx = Integer.parseInt(datasetIds.get(j).split("-")[4].substring(8));
				    			if(excludeSplitIdx == splitIdx) {
				    				datasetIds.remove(j);
				    				break;
				    			}
				    		}
				    		
				    		this.deleteDatasetById(datasetIds, dependenceWait);
				    		
				    		Thread.sleep(1000);
			    		}
			    		catch (InterruptedException e) {
							e.printStackTrace();
						}
			    		finally {
			    			reentrantLock.unlock();
			    		}
			    	}
				}
			}
		}
    }    
}
