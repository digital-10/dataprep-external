package kr.co.digitalship.dprep.custom.schedule.util;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.locks.ReentrantLock;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.fs.FileSystem;
import org.apache.http.client.utils.URIBuilder;
import org.asynchttpclient.Response;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.talend.dataprep.api.dataset.ColumnMetadata;
import org.talend.dataprep.api.dataset.RowMetadata;
import org.talend.dataprep.api.dataset.statistics.SemanticDomain;
import org.talend.dataprep.command.preparation.GetStepRowMetadata;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jcifs.smb1.smb1.NtlmPasswordAuthentication;
import jcifs.smb1.smb1.SmbException;
import jcifs.smb1.smb1.SmbFile;
import kr.co.digitalship.dprep.custom.CommonUtil;
import kr.co.digitalship.dprep.custom.DprepHttpUtil;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.schedule.vo.MetadataVO;
import kr.co.digitalship.dprep.custom.schedule.vo.CopyTargetPreparationInfoVO;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

@Component
public class DprepUtil {	
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
    
    @Value("${dataprep.node.dataset.hosts:}")
    private String[] datasetHosts;
    
    @Value("${dataprep.node.preparation.hosts:}")
    private String[] preparationHosts;        
    
    @Value("${dataprep.node.export.hosts:}")
    private String[] exportHosts;
    
	@Value("${hadoop.read.base.path:}")
    private String hadoopReadBasePath;
    
	@Value("${hadoop.write.base.path:}")
    private String hadoopWriteBasePath;
	
	@Value("${hadoop.copy.write.base.path:}")
    private String hadoopCopyWriteBasePath;	
	
    @Autowired
    private ApplicationContext context;	

	//@Autowired
	//private SpringRedisTemplateUtil springRedisTemplateUtil;    
    
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
		// 그럴리 없겠지만 값이 주입되지 않았다면...
		if(StringUtils.isBlank(store)) {
			Properties properties = new PropertiesUtil().getProperties();
			
		    store = properties.getProperty("preparation.store");
		    preparationsLocation = properties.getProperty("preparation.store.file.location");
		    smbHost = properties.getProperty("smb.host");    
		    smbSharedDir = properties.getProperty("smb.sharedDir");
		    smbUser = properties.getProperty("smb.user");
		    smbPassword = properties.getProperty("smb.password");
			nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
			datasetHosts = properties.getProperty("dataprep.node.dataset.hosts").trim().split("\\s*,\\s*");
			preparationHosts = properties.getProperty("dataprep.node.preparation.hosts").trim().split("\\s*,\\s*");
			exportHosts = properties.getProperty("dataprep.node.export.hosts").trim().split("\\s*,\\s*");
			hadoopWriteBasePath = properties.getProperty("hadoop.write.base.path");
		}
		return this;
	}
	
	/**
	 * Dataset Create
	 * @param uriBuilders
	 * @param contentType
	 * @param contents
	 * @param context
	 */
	public void createDataset(Deque<URIBuilder> uriBuilders, String contentType, Deque<InputStream> contents, JobExecutionContext context) {
		dprepHttpUtil.callAsyncPost(uriBuilders, contentType, contents, context);
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
    	
    	Response response = dprepHttpUtil.callSyncGet(datasetHosts[nodeNo], params, waitTime);

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
    	
    	if("file".equals(store)) {
    		File directory = new File(preparationsLocation);
    		File[] files = directory.listFiles();
    		
    		Arrays.sort(files, new Comparator<File> () {
				@Override
				public int compare(File file1, File flie2) {
					// TODO Auto-generated method stub
					String s1 = String.valueOf(file1.lastModified());
					String s2 = String.valueOf(flie2.lastModified());
					return s2.compareTo(s1);
				}
    		});
    		
    		for(int i = files.length - 1; i >= 0; i--) {
    			if(files[i].getName().startsWith("PersistentPreparation-")) {
    				PersistentPreparationIds.add(files[i].getName().replace("PersistentPreparation-", ""));
    			}
    		}
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
						return s2.compareTo(s1);
					}
	    		});				
				
				for(int i = files.length - 1; i >= 0; i--) {
	    			if(files[i].getName().startsWith("PersistentPreparation-")) {
	    				PersistentPreparationIds.add(files[i].getName().replace("PersistentPreparation-", ""));
	    			}
	    		}
			} 
    		catch (MalformedURLException e) {
				e.printStackTrace();
			} 
    		catch (SmbException e) {
				e.printStackTrace();
			}
    	}
    	return PersistentPreparationIds;
    }
    
	public CopyTargetPreparationInfoVO getPreparationBaseInfo(String preparationId, int waitTime) {
    	Map<String, String> params = new HashMap<>();
    	params.put("path", dprepHttpUtil.getPreparationPath(preparationId));
    	
		Response response = dprepHttpUtil.callSyncGet(preparationHosts[nodeNo], params, waitTime);

		CopyTargetPreparationInfoVO copyTargetPreparationInfoVO = new CopyTargetPreparationInfoVO();
		
		if(200 != response.getStatusCode()) {
			return copyTargetPreparationInfoVO;
		}
		
		if(StringUtils.isNotBlank(response.getResponseBody())) {
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
		}
		return copyTargetPreparationInfoVO;
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
    		response = dprepHttpUtil.callSyncGet(preparationHosts[nodeNo], params, waitTime);
    		
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
    public void exportSingle(ProcessingInfomationVO processingInfomationVO, MetadataVO metadataVO, int waitTime) {
    	String datasetId = processingInfomationVO.getDatasetIds().get(0);
		String preparationId = processingInfomationVO.getPreparationIds().get(0);
		String fileName = processingInfomationVO.getFileNames().get(0);
		String filePath = processingInfomationVO.getFilePath();
		
		String hadoopWritePath = hadoopWriteBasePath;

		String fullPath = filePath.replace(hadoopReadBasePath, hadoopWritePath);
		
    	Map<String, String> params = new HashMap<>();
    	params.put("path", dprepHttpUtil.getExportPath());    	
		params.put("exportType", "CSV");
    	params.put("exportParameters.csv_fields_delimiter", metadataVO.getDelimiter());    	
		params.put("exportParameters.csv_enclosure_character", "");
		params.put("exportParameters.csv_escape_character", "");
		params.put("exportParameters.csv_enclosure_mode", "text_only");
		params.put("exportParameters.csv_encoding", metadataVO.getEncoding());    	
    	
    	FileSystem fs = hadoopUtil.getFs();

		reentrantLock = new ReentrantLock();
    	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
    	
    	if(!isPossibleLock) {
    		try {
				reentrantLock.lock();
				
				params.put("datasetId", datasetId);
				params.put("preparationId", preparationId);
				params.put("exportParameters.fileName", fileName);
				
				Response response = dprepHttpUtil.callSyncGet(exportHosts[nodeNo], params, waitTime);
				
				hadoopUtil.write(fs, response.getResponseBody(), fullPath);
				
				String dstPath = fullPath.replace(hadoopWritePath, hadoopCopyWriteBasePath);
				hadoopUtil.copy(fullPath, dstPath); // 복제				
				
				Thread.sleep(1000);
			} 
    		catch (InterruptedException e) {
				e.printStackTrace();
			}
    		finally {
    			reentrantLock.unlock();
    			
    			if(null != fs) {
    				try { fs.close(); } catch (IOException e) {}
    			}    			
    		}
    	}
    }

    public void exportMulti(ProcessingInfomationVO processingInfomationVO, MetadataVO metadataVO, int waitTime) {
    	List<String> datasetIds = processingInfomationVO.getDatasetIds();
		List<String> preparationIds = processingInfomationVO.getPreparationIds();
		String fileName = processingInfomationVO.getFileNames().get(0);
		String filePath = processingInfomationVO.getFilePath();    	
    	
		String hadoopWritePath = hadoopWriteBasePath;
		
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
	    			
					Response response = dprepHttpUtil.callSyncGet(exportHosts[nodeNo], params, waitTime);
					// 원본에 없던 임의로 붙은 헤더인 경우 제거
					if("0".equals(metadataVO.getHeaderNbLines())) {
						stringBuffer = CommonUtil.readAndExcludeHeader(stringBuffer, response.getResponseBody());
					}
					else {
						stringBuffer.append(response.getResponseBody());
					}
					
					if(i == len - 1) {
						hadoopUtil.write(fs, stringBuffer.toString(), filePath);
						
						String dstPath = filePath.replace(hadoopWritePath, hadoopCopyWriteBasePath);
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
				URIBuilder uriBuilder = new URIBuilder(datasetHosts[nodeNo]);
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
				URIBuilder uriBuilder = new URIBuilder(datasetHosts[nodeNo]);
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
				URIBuilder uriBuilder = new URIBuilder(datasetHosts[nodeNo]);
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
					
					dprepHttpUtil.callSyncPost(datasetHosts[nodeNo], params, gsonObject);
					
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
