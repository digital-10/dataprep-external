package kr.co.digitalship.dprep.custom.schedule.job.listener;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
//import java.util.concurrent.locks.ReentrantLock;
import java.util.zip.GZIPInputStream;

import javax.annotation.PostConstruct;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.fs.FileSystem;
import org.apache.http.client.utils.URIBuilder;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;
import org.talend.dataprep.api.dataset.DataSetMetadata;
import org.talend.dataprep.api.dataset.RowMetadata;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import kr.co.digitalship.dprep.custom.DprepHttpUtil;
import kr.co.digitalship.dprep.custom.PcnApiUtil;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.util.BackgroundAnalysisCustom;
import kr.co.digitalship.dprep.custom.schedule.util.DprepMetaUtil;
import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
//import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;
//import kr.co.digitalship.dprep.custom.schedule.util.ShellCmdUtil;
//import kr.co.digitalship.dprep.custom.schedule.vo.CopyTargetPreparationInfoVO;
import kr.co.digitalship.dprep.custom.schedule.vo.ExportResultVO;
import kr.co.digitalship.dprep.custom.schedule.vo.MetadataVO;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

@Component
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class ListenerJob4 implements JobListener {
	private static final Logger LOGGER = LoggerFactory.getLogger(ListenerJob4.class);
	
	@Value("${dataprep.node.count:0}")
	private int nodeCount;
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;
	
	@Value("${hadoop.read.base.path:}")
    private String hadoopReadBasePath;
	
	@Value("${hadoop.copy.origin.base.path:}")
    private String hadoopCopyOriginBasePath;	
	
	@Value("${hadoop.result.reg.base.path:}")
	private String hadoopResultRegBasePath;
	
//	@Value("${hadoop.copy.recipe.base.path:}")
//	private String hadoopCopyRecipeBasePath;	
	
	@Value("${preparation.store.file.location:}")
	private String preparationsLocation;
	
	@Value("${dataprep.httpUtil.counter:}")
	private int counter; // 일정 수 이상의 Http Connection 을 맺을 경우 오류가 나서...
	
//	@Value("${schedule.job1.reschedule:}")
//	private boolean job1Reschedule;		
	
//	@Value("${schedule.job1_2.cronExp:}")
//	private String job1cronExp_2;		

	@Value("${pipeline.run.enabled:}")
	private boolean pipelineRunEnabled;	
	
	@Value("${pipeline.run.api.host:}")
	private String pipelineRunApiHost;
	
	@Value("${pipeline.run.api.port:}")
	private String pipelineRunApiPort;
	
	@Value("${pipeline.run.api.path:}")
	private String pipelineRunApiPath;
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private HadoopUtil hadoopUtil;
	
	//@Autowired
	//private DprepHttpUtil dprepHttpUtil;
	
	//@Autowired
	//private DprepUtil dprepUtil;
	
	@Autowired
	private DprepMetaUtil dprepMetaUtil;
	
	@Autowired
	private BackgroundAnalysisCustom backgroundAnalysisCustom;
	
    @Autowired
    private ObjectMapper mapper;
    
	@Autowired
	private PcnApiUtil pcnApiUtil;
	
	@Autowired
	private DprepUtil dprepUtil;	
/*	
	@Autowired
	private ShellCmdUtil shellCmdUtil;
*/	
	private Gson gson;
	
	//private ReentrantLock reentrantLock;
	
	@PostConstruct
	public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();

		nodeCount = Integer.parseInt(properties.getProperty("dataprep.node.count"));
		nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
		dependenceWait = Integer.parseInt(properties.getProperty("schedule.job.dependence.wait"));
		
		hadoopReadBasePath = properties.getProperty("hadoop.read.base.path");
		hadoopCopyOriginBasePath = properties.getProperty("hadoop.copy.origin.base.path");
		hadoopResultRegBasePath = properties.getProperty("hadoop.result.reg.base.path");
		//hadoopCopyRecipeBasePath = properties.getProperty("hadoop.copy.recipe.base.path");
		
		preparationsLocation = properties.getProperty("preparation.store.file.location");
		
		counter = Integer.parseInt(properties.getProperty("dataprep.httpUtil.counter"));
		
//		job1Reschedule = Boolean.parseBoolean(properties.getProperty("schedule.job1.reschedule"));
//		job1cronExp_2 = properties.getProperty("schedule.job1_2.cronExp");
		
		pipelineRunEnabled = Boolean.parseBoolean(properties.getProperty("pipeline.run.enabled"));
		pipelineRunApiHost = properties.getProperty("pipeline.run.api.host");
		pipelineRunApiPort = properties.getProperty("pipeline.run.api.port");
		pipelineRunApiPath = properties.getProperty("pipeline.run.api.path");
        
        gson = new Gson();		
	}
	
    @Override
    public String getName() {
        return getClass().getSimpleName();
    }

    /**
     * JobDetail이 실행될 떄 스케줄러에의해서 호출되는 메서드
     * 
     * @param context
     */     
    @Override
    public void jobToBeExecuted(JobExecutionContext context) {
    	LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " jobToBeExecuted (%d)", nodeNo));
    	
        context.getJobDetail().getJobDataMap().put("job4IsDonePossible", false);
    }

    @Override
    public void jobExecutionVetoed(JobExecutionContext context) {
    	LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " jobExecutionVetoed (%d)", nodeNo));
    	
		List<String> jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"DONE", "DONE", "DONE", "END"}));
		springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);					
		
		QuartzConfigUtil.deleteJob(context);
    }

	@Override
    @SuppressWarnings("unchecked")	
    public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {
    	LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " jobWasExecuted (%d)", nodeNo));
    	
		if(context.getJobDetail().getJobDataMap().getBoolean("job4IsDonePossible")) {
			List<String> jobStatusNode;
			int nodeNo0 = (Integer)springRedisTemplateUtil.valueGet("NODE_0");
			if(nodeNo0 != nodeNo) {
				jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"DONE", "DONE", "DONE", "DONE"}));
				springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
			}
			
			FileSystem fs = hadoopUtil.getFs();
			String wsId = (String)springRedisTemplateUtil.valueGet("WS_ID");
			// 하둡내 레시피 업로드
			//this.uploadToHadoopPreparationRecipe(fs, wsId);			
			
			/**
			 * 여기서 각 노드의 메타 생성...                                               
			 * 각 노드의 메타 생성이 끝나면 redis에 통합정보를 적재...                              
			 * 0번 노드는 기다렸다가 통합 정보를 통합해서 또 생성.                                   
			 * preparationIds 로 PersistentPreparation- 파일을 읽어서 정보 확인 (headId)   
			 * headId 로 PersistentStep- 파일을 읽어서 정보 확인 (content, rowMetadata)  
			 * content 로 PreparationActions- 파일을 읽어서 정보 확인                    
			 * - 시간이 필요하려나??? 없겠지???                                                               
			 * rowMetadata 로 StepRowMetadata- 파일을 읽어서 정보 확인
			 * - 분할은 1차 통합이 필요하고 2차로 전체 파일에 대해 통합 필요함.
			 * - 전재조건 : 형태가 동일한 파일이여야 한다.                     
			 */	
			//this.eachSaveActionsMetadata();
			
			// node 0 번이 기다리다가 처리
			boolean flag = false;
			if(nodeNo0 == nodeNo) {
				do {
					flag = true;
					
					// 0 번 노드를 제외한 나머지 노드의 종료 여부 확인
					for(int i = 0, len = nodeCount; i < len; i++) {
						if(nodeNo0 == i) continue;
						
						jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + i);
						if(jobStatusNode.contains("END")) continue; 
						
						if(!"DONE".equals(jobStatusNode.get(jobStatusNode.size() - 1))) {
							flag = false;
							break;
						}
					}
					
					if(!flag) {
						try {
							Thread.sleep(1000);
						} catch (InterruptedException e) {
							e.printStackTrace();
						}
					}
				}
				while(!flag);
			}
			
			if(flag) {
				this.eachSaveActionsMetadata();
				
				// 전처리 완료 Update
	    		String token = pcnApiUtil.getAuth();
	    		pcnApiUtil.updateWorkStatus(token, Integer.parseInt(wsId), 1, ""); // 경로를 넣어줘야 할지도.	    		
	    		pcnApiUtil.updateWorkspaceWorkStatus(token, Integer.parseInt(wsId), 1);
				
				// 메타를 합쳐야...
				String datasetIdForIntegratedStatistics = null;
				String preparationIdForIntegratedStatistics = null;
				
				Map<String, ExportResultVO> exportInfo = new HashMap<>(); // 파일명, line 수, 실행시간 (여기수정하면 1번도 수정해야...)	
				for(int i = 0, len = nodeCount; i < len; i++) {
					jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + i);
					if(jobStatusNode.contains("END")) continue;
					
					// 목록 취합...
					List<ProcessingInfomationVO> export = null;
					
					String jsonStrExport = (String)springRedisTemplateUtil.valueGet("LIST_OF_EXPORT_" + i);
					if(StringUtils.isNotBlank(jsonStrExport)) {
						JsonArray gsonArrayExportMulti = new JsonParser().parse(jsonStrExport).getAsJsonArray();
						
						export = gson.fromJson(gsonArrayExportMulti, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
						//gsonArrayExportMulti = null; // 빠른 반환을 위해 null 처리함 
					}
					//jsonStrExport = null; // 빠른 반환을 위해 null 처리함 
					
					if(null != export) {
						for(int j = 0, jLen = export.size(); j < jLen; j++) {
							//export.add(exportMulti.get(j).getFilePath());
							ProcessingInfomationVO processingInfomationVO = export.get(j);
							String filePath = processingInfomationVO.getFilePath();
							MetadataVO metadataVO = processingInfomationVO.getMetadataVO();
							ExportResultVO exportResultVO = new ExportResultVO();
							
							exportResultVO.setFilePath(filePath);
							if("0".equals(metadataVO.getHeaderNbLines())) {
								exportResultVO.setLineCnt(processingInfomationVO.getLineCnt());										
							}
							else {
								exportResultVO.setLineCnt(processingInfomationVO.getLineCnt() - 1); // 헤더가 있는 경우 -1
							}
							
							exportInfo.put(filePath, exportResultVO);
						}
						
						if(StringUtils.isEmpty(datasetIdForIntegratedStatistics)) {
							datasetIdForIntegratedStatistics = export.get(0).getDatasetIds().get(0);
							preparationIdForIntegratedStatistics = export.get(0).getPreparationIds().get(0);
						}
						//export = null; // 빠른 반환을 위해 null 처리함
					}					
				}
		    	
				// 처리가 끝난 원본의 이동
				List<ExportResultVO> exportResultVOs = new ArrayList<>(Arrays.asList(exportInfo.values().toArray(new ExportResultVO[exportInfo.keySet().size()])));
				
				for(int i = 0, len = exportResultVOs.size(); i < len; i++) {
					String srcPath = exportResultVOs.get(i).getFilePath();					
					String dstPath = hadoopCopyOriginBasePath;					
					
					dstPath = srcPath.replace(hadoopReadBasePath, dstPath);
							
					hadoopUtil.copy(srcPath, dstPath);
					//hadoopUtil.copy(srcPath, dstPath.replace("Origin", "Pipeline"));
					hadoopUtil.delete(fs, srcPath);
				}
				
				// 목록 파일을 적재...적재할때는 기존 파일의 목록을 읽어서...추가로 붙임...
				String prevSavedJson = hadoopUtil.getStr(String.format(hadoopResultRegBasePath + "/%s/list.json", wsId), "UTF-8");
				
				List<ExportResultVO> prevExportResultVOs = null;
				if(StringUtils.isNotBlank(prevSavedJson)) {
					prevExportResultVOs = gson.fromJson(prevSavedJson, new TypeToken<List<ExportResultVO>>() {}.getType());
				}
				if(null == prevExportResultVOs) {
					prevExportResultVOs = exportResultVOs;
				}
				else {
					prevExportResultVOs.addAll(exportResultVOs);					
				}
				
				// 하둡에 적재
				hadoopUtil.write(fs, gson.toJson(prevExportResultVOs), hadoopResultRegBasePath, wsId, "list.json");							

				this.mergeActions();
				
				// Meta 프로파일링 완료 Update
				RowMetadata rowMetadata = dprepUtil.getStepRowMetadata(preparationIdForIntegratedStatistics);
				
				DataSetMetadata dataSetMetadata = backgroundAnalysisCustom.analyze(datasetIdForIntegratedStatistics, rowMetadata);
				dataSetMetadata.setId(wsId);
				dataSetMetadata.setName(wsId);
				
	    		try {
					hadoopUtil.write(fs, mapper.writeValueAsString(dataSetMetadata), hadoopResultRegBasePath, wsId, "metadata.json");
				} 
	    		catch (JsonProcessingException e) {
					e.printStackTrace();
				}
	    		
				if(null != fs) {
					try { fs.close(); } catch (IOException e) {}
				}

				// 메타 프로파일링 완료 Update
	    		token = pcnApiUtil.getAuth();
	    		pcnApiUtil.updateWorkStatus(token, Integer.parseInt(wsId), 2, ""); // 경로를 넣어줘야 할지도.	    		
	    		pcnApiUtil.updateWorkspaceWorkStatus(token, Integer.parseInt(wsId), 2);				

				// 파일의 제거...는 여기쯤?				
				//deletePartsRelatedToSplitFiles();
	    		//dprepUtil.deleteDprepData(0);
/*				
				// Redis 정보 제거
				List<String> keys = new ArrayList<>();
				keys.add("NODE_0");
				keys.add("WS_ID");
				
				for(int i = 0, len = nodeCount; i < len; i++) {
					keys.add("INCLUDE_PREPARATION_TARGET_INFO_" + i);			
					keys.add("INCLUDE_META_INFO_" + i);
					keys.add("LIST_OF_DATASET_INFO_" + i);
					keys.add("LIST_OF_FILES_TO_BE_PROCESSED_" + i);
					keys.add("LIST_OF_EXPORT_" + i);
					keys.add("ACTIONS_" + i);
					//keys.add("JOB_RUNNING_START_TIME_" + i);
					//keys.add("JOB_RUNNING_END_TIME_" + i);
					keys.add("TARGET_PREPARATION_CANDIDATE_" + i);
					//keys.add("METADATA_" + i);
				}
				
				springRedisTemplateUtil.delete(keys);
*/				
				DprepHttpUtil.counter = new AtomicInteger(counter);
/*								
				// 파이프라인 쉘 스크립트 호출
				try {
					LOGGER.info("QuartzJobListner - sh Execute");
					shellCmdUtil.execute(wsId);
				} 
				catch (IOException | InterruptedException e) {
					e.printStackTrace();
				}
*/				
				QuartzConfigUtil.deleteJob(context);

				jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"DONE", "DONE", "DONE", "DONE"}));
				springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
				
				// 파이프라인 호출 ( http://192.168.10.211:7911/pipeLine/api/start/{ws_id} )
		    	if(pipelineRunEnabled) {
					try {
						DprepHttpUtil dprepHttpUtil = new DprepHttpUtil().init();

						String host = String.format("http://%s:%s", pipelineRunApiHost, pipelineRunApiPort);
						String path = String.format("%s/%s", pipelineRunApiPath, wsId);
						
						URIBuilder uriBuilder = new URIBuilder(host);
						uriBuilder.setPath(path);
						
						dprepHttpUtil.callAsyncCommon(uriBuilder, "GET", "text/plain", null);
						
						LOGGER.info(String.format("Call Pipeline [ %s/%s ]", host, path));
					}
					catch (URISyntaxException e) {
						e.printStackTrace();
					}   		    		
		    	}
				
				LOGGER.info(String.format("QuartzJobListner - Job4 All Job DONE(%d)", nodeNo));
			}
			else {
				//dprepUtil.deleteDprepData(0);
				
				QuartzConfigUtil.deleteJob(context);
				
				LOGGER.info(String.format("QuartzJobListner - Job4 DONE(%d)", nodeNo));
			}
		}
    }
    
    private void eachSaveActionsMetadata() {
    	List<JsonArray> contentList = new ArrayList<>();

		List<ProcessingInfomationVO> export = null;				
		String jsonStrExport = (String)springRedisTemplateUtil.valueGet("LIST_OF_EXPORT_" + nodeNo);
		if(StringUtils.isNotBlank(jsonStrExport)) {
			JsonArray gsonArrayExport = new JsonParser().parse(jsonStrExport).getAsJsonArray();
			
			export = gson.fromJson(gsonArrayExport, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
			
			for(int i = 0, len = export.size(); i < len; i++) {
				ProcessingInfomationVO processingInfomationVO = export.get(i);
				String preparationId = processingInfomationVO.getPreparationIds().get(0);
				
				String headId = dprepMetaUtil.getHeadId(preparationId);
				JsonObject stepInfo = dprepMetaUtil.getStepInfo(headId);
				String contentId = stepInfo.get("content").getAsString();
				
				JsonArray content = dprepMetaUtil.getActionsInfo(contentId);
				JsonArray rowMetadata = null;				
				
				if(null != stepInfo.get("rowMetadata")) {
					rowMetadata = dprepMetaUtil.getMetadata(stepInfo.get("rowMetadata").getAsString());
				}
				
				for(int j = 0, jLen = content.size(); j < jLen; j++) {
					JsonObject contentUnit = content.get(j).getAsJsonObject();
					String columnId = contentUnit.get("parameters").getAsJsonObject().get("column_id").getAsString();
					
					if(null != rowMetadata) {
						for(int k = 0, kLen = rowMetadata.size(); k < kLen; k++) {
							JsonObject rowMetadataUnit = rowMetadata.get(k).getAsJsonObject();
							String compareColumnId = rowMetadataUnit.get("id").getAsString();
							if(columnId.equals(compareColumnId)) {
								String type = rowMetadataUnit.get("type").getAsString();
								String domain = rowMetadataUnit.get("domain").getAsString();
								
								contentUnit.addProperty("type", type);
								contentUnit.addProperty("domain", domain);
								
								break;
							}
						}						
					}
					
					content.set(j, contentUnit);
				}
				contentList.add(content);				
			}
		}

		springRedisTemplateUtil.valueSet("ACTIONS_" + nodeNo, gson.toJson(contentList));
    }

    private void mergeActions() {
    	JsonArray gsonArray = null;
    	
    	for(int i = 0, len = nodeCount; i < len; i++) {
			@SuppressWarnings("unchecked")
			List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + i);
			if(jobStatusNode.contains("END")) {
				continue;
			}
			
			String strActions = (String)springRedisTemplateUtil.valueGet("ACTIONS_" + i);
			if(StringUtils.isNotBlank(strActions)) {
				gsonArray = gson.fromJson(strActions, new TypeToken<JsonArray>() {}.getType());
				break;
			}
    	}
    	
    	// 하둡 저장
    	String wsId = (String)springRedisTemplateUtil.valueGet("WS_ID");
    	
    	FileSystem fs = hadoopUtil.getFs();
    	hadoopUtil.write(fs, gson.toJson(gsonArray), hadoopResultRegBasePath, wsId, "actions.json");
    	
    	if(null != fs) {
    		try { fs.close(); } catch (IOException e) {}
    	}
    }    
 
    /**
     * 분할 파일 첫부분외의 부분은 제거
     */
    // 생성한 레시중 최종형태에 대한 Hadoop 업로드
    private void uploadToHadoopPreparationRecipe(FileSystem fs, String wsId) {
    	List<String> fileNames = new ArrayList<>();
    	List<String> preparationIds = new ArrayList<>();
    	
    	String jsonStrExport = (String)springRedisTemplateUtil.valueGet("LIST_OF_EXPORT_" + nodeNo);
		if(StringUtils.isNotBlank(jsonStrExport)) {
			JsonArray gsonArrayExport = new JsonParser().parse(jsonStrExport).getAsJsonArray();
			
			List<ProcessingInfomationVO> export = gson.fromJson(gsonArrayExport, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
			Random random = new Random();
			for(ProcessingInfomationVO processingInfomationVO : export) {
				// 아래와 같은 이유로 분할의 경우는 무작위로 한부분만 사용
				// 원본 파일명과 동일한 파일명으로 생성.
				String filePath = processingInfomationVO.getFilePath();
				fileNames.add(filePath.substring(filePath.lastIndexOf("/") +1 ).replace(".csv", ""));
				if(1 < processingInfomationVO.getPreparationIds().size()) {
					preparationIds.add(processingInfomationVO.getPreparationIds().get(random.nextInt(processingInfomationVO.getPreparationIds().size())));
				}
				else {
					preparationIds.add(processingInfomationVO.getPreparationIds().get(0));
				}
			}
		}
/*		
		for(int i = 0, len = preparationIds.size(); i < len; i++) {
			String preparationId = preparationIds.get(i);
			String headId = "", contentId = "", rowMetadataId = "";
			
			File filePersistentPreparation = new File(preparationsLocation + "/PersistentPreparation-" + preparationId);
			String strPersistentPreparationContent  = readGzipFileToString(filePersistentPreparation);
			JsonObject gsonObjectPersistentPreparationContent = new JsonParser().parse(strPersistentPreparationContent).getAsJsonObject();			
			if(null != gsonObjectPersistentPreparationContent) {
				headId = gsonObjectPersistentPreparationContent.get("headId").getAsString();
			}
			
			File filePersistentStep = new File(preparationsLocation + "/PersistentStep-" + headId);
			String strPersistentStepContent  = readGzipFileToString(filePersistentStep);
			JsonObject gsonObjectPersistentStepContent = new JsonParser().parse(strPersistentStepContent).getAsJsonObject();
			if(null != gsonObjectPersistentStepContent) {
				contentId = gsonObjectPersistentStepContent.get("contentId").getAsString();
				rowMetadataId = gsonObjectPersistentStepContent.get("rowMetadata").getAsString();
			}
			
			File filePreparationActions = new File(preparationsLocation + "/PreparationActions-" + contentId);
			String strPreparationActionsContent  = readGzipFileToString(filePreparationActions);

			File fileStepRowMetadata = new File(preparationsLocation + "/StepRowMetadata-" + rowMetadataId);
			String strStepRowMetadataContent  = readGzipFileToString(fileStepRowMetadata);
			
//			hadoopUtil.write(fs, strPersistentPreparationContent, hadoopCopyRecipeBasePath, wsId, String.format("PersistentPreparation-%s.json", preparationId));
//			hadoopUtil.write(fs, strPersistentStepContent, hadoopCopyRecipeBasePath, wsId, String.format("PersistentStep-%s.json", headId));
//			hadoopUtil.write(fs, strPreparationActionsContent, hadoopCopyRecipeBasePath, wsId, String.format("PreparationActions-%s.json", contentId));
//			hadoopUtil.write(fs, strStepRowMetadataContent, hadoopCopyRecipeBasePath, wsId, String.format("StepRowMetadata-%s.json", rowMetadataId));
			// 원본 파일명과 동일한 파일명으로 생성. (분할이되지 않는 10000건 대상으로만 사용한다고 하기 때문에...관계 없을듯...)
			//hadoopUtil.write(fs, strPersistentPreparationContent, hadoopCopyRecipeBasePath, wsId, String.format("PersistentPreparation-%s.json", fileNames.get(i)));
			//hadoopUtil.write(fs, strPersistentStepContent, hadoopCopyRecipeBasePath, wsId, String.format("PersistentStep-%s.json", fileNames.get(i)));
			//hadoopUtil.write(fs, strPreparationActionsContent, hadoopCopyRecipeBasePath, wsId, String.format("PreparationActions-%s.json", fileNames.get(i)));
			//hadoopUtil.write(fs, strStepRowMetadataContent, hadoopCopyRecipeBasePath, wsId, String.format("StepRowMetadata-%s.json", fileNames.get(i)));			
		}
*/		
    }
    
	public String readGzipFileToString(File file) {
		if(file.isFile()) {
			//try (FileInputStream fileInputStream = new FileInputStream(file); GZIPInputStream gZIPInputStream = new GZIPInputStream(fileInputStream)) {
    		try (InputStream in = Files.newInputStream(Paths.get(file.getPath()), StandardOpenOption.READ); GZIPInputStream gZIPInputStream = new GZIPInputStream(in)) {
    			String strContent = IOUtils.toString(gZIPInputStream, "UTF-8");
    			
    			return strContent;
	        } 
    		catch (IOException e) {
    			e.printStackTrace();
	        }
		}		
		return null;
	}
}
