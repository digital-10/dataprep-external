package kr.co.digitalship.dprep.custom.schedule.job;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.locks.ReentrantLock;

import javax.annotation.PostConstruct;

import org.apache.hadoop.fs.FileSystem;
import org.apache.http.client.utils.URIBuilder;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.PersistJobDataAfterExecution;
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

import kr.co.digitalship.dprep.custom.DprepHttpUtil;
import kr.co.digitalship.dprep.custom.FileTypeDetector;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.SplitUtil;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.CustomQuartzJobBean;
import kr.co.digitalship.dprep.custom.schedule.util.BackgroundAnalysisCustom;
import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;
import kr.co.digitalship.dprep.custom.schedule.vo.MetadataVO;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

@Component
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class Job2CreateDataset extends CustomQuartzJobBean {
	private static final Logger LOGGER = LoggerFactory.getLogger(Job2CreateDataset.class);

	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job2.cronExp:}")
	private String cronExp;
	
	@Value("${dataprep.httpUtil.counter:}")
	private int counter; // 일정 수 이상의 Http Connection 을 맺을 경우 오류가 나서...	

	@Value("${dataset.metadata.store.file.location:}")
	private String metadataLocation;	
	
	@Value("${hadoop.result.reg.base.path:}")
	private String hadoopResultRegBasePath;	
	
	@Autowired
	private SplitUtil splitUtil;
	
	@Autowired
	private DprepUtil dprepUtil;
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private FileTypeDetector fileTypeDetector;
	
	@Autowired
	private BackgroundAnalysisCustom backgroundAnalysisCustom;
	
	@Autowired
	private HadoopUtil hadoopUtil;
	
    @Autowired
    private ObjectMapper mapper;	
	
	private ReentrantLock reentrantLock;
	
	public Job2CreateDataset() {
		super();
		
		setJobName(this.getClass().getSimpleName());
		setTriggerName(this.getClass().getSimpleName().replace("Job", "Trigger"));
		setGroup("ProfilingBatch");
		setCronExp(cronExp);
		setUseJobListener(true);
		setUseTriggerListener(true);
	}
	
	@PostConstruct
	public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
		nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
		cronExp = properties.getProperty("schedule.job2.cronExp");
		counter = Integer.parseInt(properties.getProperty("dataprep.httpUtil.counter"));
		metadataLocation = properties.getProperty("dataset.metadata.store.file.location");
		hadoopResultRegBasePath = properties.getProperty("hadoop.result.reg.base.path");

		setCronExp(cronExp);
	}	

	@Override
	public void executeInternal(JobExecutionContext context) throws JobExecutionException {
		LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " executeInternal (%d)", nodeNo));
		
		List<String> jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"DONE", "RUNNING", "NEW", "NEW"}));
		springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
		
		@SuppressWarnings("unchecked")
		List<String> fileList = (List<String>)springRedisTemplateUtil.valueGet("LIST_OF_FILES_TO_BE_PROCESSED_" + nodeNo);

		Gson gson = new Gson();
		JsonArray gsonArrayFinal = new JsonArray();

        // 모든 Cycle 이 끝나기 전까지 동일 yyyyMMdd 사용
        String yyyyMMdd = (String)springRedisTemplateUtil.valueGet("DATE_OF_PROCESSING");
		int[] lastMetadataNamingInfo = splitUtil.getLastMetadataNamingInfo(yyyyMMdd, "sJob");
		
		reentrantLock = new ReentrantLock();
        for(int i = 0, len = fileList.size(); i < len; i ++) {
        	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
        	if(!isPossibleLock) {
        		reentrantLock.lock();
        		
        		FileSystem fs = hadoopUtil.getFs();
        		InputStream inputStream = null;
        		
        		try {
                	String filePath = fileList.get(i);
                	
                	inputStream = hadoopUtil.getInputStream(fs, filePath);                        	
                	inputStream = fileTypeDetector.detect(inputStream);
                	
                	String fileType = fileTypeDetector.getFileType();
                	String fileEncoding = fileTypeDetector.getFileEncoding();
                	
                	Deque<InputStream> contents = splitUtil.doSplit(inputStream, fileType, fileEncoding);
                	Deque<String> datasetIds = splitUtil.getDatasetId(yyyyMMdd, "sJob", lastMetadataNamingInfo[0], lastMetadataNamingInfo[1] + i, contents.size());                    	
                	List<String> tempDatasetIds = new ArrayList<>(datasetIds);
          	
                	String name = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.lastIndexOf(".")); // 중복된 파일명이 있을때...이걸...바꿔야 될까?
                	Deque<String> fileNames = new ConcurrentLinkedDeque<>();
                	long millis = System.currentTimeMillis();
                	
                	for(int j = 0, jLen = datasetIds.size(); j < jLen; j++) {
                		if(0 < j) {
                			fileNames.add(String.format("%s_%d_%d", name, millis, j));
                		}
                		else {
                			fileNames.add(String.format("%s_%d", name, millis));
                		}
                	}
                	List<String> tempFileNames = new ArrayList<>(fileNames);
                	
                	Deque<Map<String, String>> params = splitUtil.makeParams("/api/datasets", fileNames, "", 0, datasetIds);
                	// 3번째 파라미터 true : Schedule Job, 사용자가 직접 업로드 하는 경우가 아닌...datasetId가 이미 정의 되어 있는...경우...
                	// 분할후에 개별 call을 날릴 경우...datasetAPI 에서 직접 분할을 하지 않는 경우
                	Deque<URIBuilder> uriBuilders = splitUtil.makeReceveHost(contents, params, true);                			
        			
					// dataset 생성
					//dprepUtil.createDataset(uriBuilders, "text/plain", contents, context);
                	dprepUtil.createDataset(uriBuilders, "text/plain", contents);

					// 작업정보 Json 작성 
					JsonObject gsonObject = new JsonObject();
					gsonObject.addProperty("filePath", filePath);
					gsonObject.addProperty("fileEncoding", fileEncoding);
					gsonObject.addProperty("lineCnt", splitUtil.getLineCnt());
					
					JsonArray gsonArray = new JsonArray();
					for(String fileName : tempFileNames) {
						gsonArray.add(fileName);
					}
					gsonObject.add("fileNames", gsonArray);        				
					
					gsonArray = new JsonArray();
					for(String datasetId : tempDatasetIds) {
						gsonArray.add(datasetId);
					}
					gsonObject.add("datasetIds", gsonArray);
					
					gsonArrayFinal.add(gsonObject);
					
					Thread.sleep(1000);
				} 
        		catch (InterruptedException e) {
					e.printStackTrace();
				}
        		finally {
        			if(null != inputStream) {
        				try { inputStream.close(); } catch (IOException e) {}
        			}                			
        			if(null != fs) {
            			try { fs.close(); } catch (IOException e) {}                				
        			}
        			reentrantLock.unlock();
        		}
        	}
        }
        
        while(counter > DprepHttpUtil.counter.get()) {
        	try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}                	
        }
        
        springRedisTemplateUtil.valueSet("LIST_OF_DATASET_INFO_" + nodeNo, gson.toJson(gsonArrayFinal));
        
        // dataset, metadata 누락 체크 및 재생성 시도.
        this.datasetCreatedChk(gsonArrayFinal);
        
        this.makeMetadata(gsonArrayFinal);
        
        List<String> targetPreparationIdCandidate = dprepUtil.getPersistentPreparationId();
        springRedisTemplateUtil.valueSet("TARGET_PREPARATION_CANDIDATE_" + nodeNo, targetPreparationIdCandidate);
        
		context.getJobDetail().getJobDataMap().put("job2IsDonePossible", true);
	}

    // dataset, metadata 누락 체크 및 재생성 시도.
	private void datasetCreatedChk(JsonArray gsonArrayFinal) {
        for(int i = 0, len = gsonArrayFinal.size(); i < len; i++) {
        	JsonObject gsonDatasetInfo = gsonArrayFinal.get(i).getAsJsonObject();
        	
        	String filePath = gsonDatasetInfo.get("filePath").getAsString();
        	JsonArray gsonFileNames = gsonDatasetInfo.get("fileNames").getAsJsonArray();
        	JsonArray gsonDatasetIds = gsonDatasetInfo.get("datasetIds").getAsJsonArray();
        	
        	for(int j = 0, jLen = gsonDatasetIds.size(); j < jLen; j++) {
        		String datasetId = gsonDatasetIds.get(j).getAsString();
        		File file = new File(String.format("%s/%s", metadataLocation, datasetId));
        		if(!file.exists()) {
        			boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
        			if(!isPossibleLock) {
        				reentrantLock.lock();
        				
                        FileSystem fs = hadoopUtil.getFs();
                        InputStream inputStream = null;    
                        
                        try {
                            inputStream = hadoopUtil.getInputStream(fs, filePath);                          
                            inputStream = fileTypeDetector.detect(inputStream);
                            
                            String fileType = fileTypeDetector.getFileType();
                            String fileEncoding = fileTypeDetector.getFileEncoding();
                            
                            Deque<InputStream> contents = splitUtil.doSplit(inputStream, fileType, fileEncoding);
                            Deque<String> datasetIds = new ConcurrentLinkedDeque<>();
                            Deque<String> fileNames = new ConcurrentLinkedDeque<>();
                            
                            ArrayList<InputStream> contentsList = new ArrayList<>();
                            for(int k = 0, kLen = contents.size(); k < kLen; k++) {
                            	contentsList.add(contents.poll());
                            }
                            
                            int idx = Integer.parseInt(datasetId.split("-")[4].substring(8));
                            for(int k = 0, kLen = contentsList.size(); k < kLen; k++) {
                            	if(k == idx) {
                            		contents.add(contentsList.get(k));
                            		datasetIds.add(gsonDatasetIds.get(k).getAsString());
                            		fileNames.add(gsonFileNames.get(k).getAsString());
                            		
                            		LOGGER.debug(String.format("Retry Dataset Creation - %s / %s", gsonFileNames.get(k).getAsString(), gsonDatasetIds.get(k).getAsString()));
                            	}
                            	else {
                            		try { if(null != contentsList.get(k)) contentsList.get(k).close(); } catch (IOException e) {}
                            	}
                            }
                            
                            Deque<Map<String, String>> params = splitUtil.makeParams("/api/datasets", fileNames, "", 0, datasetIds);
                            Deque<URIBuilder> uriBuilders = splitUtil.makeReceveHost(contents, params, true); // true : Schedule Job                            
                            
                            // dataset 생성
                            dprepUtil.createDataset(uriBuilders, "text/plain", contents);                            
            	    		
            				if(null != fs) {
            					try { fs.close(); } catch (IOException e) {}
            				}                            
                        	
                        	Thread.sleep(1000);
	                    } 
	                    catch (InterruptedException e) {
	                        e.printStackTrace();
	                    }
	                    finally {
	                        if(null != inputStream) {
	                            try { inputStream.close(); } catch (IOException e) {}
	                        }                           
	                        if(null != fs) {
	                            try { fs.close(); } catch (IOException e) {}                                
	                        }
	                        reentrantLock.unlock();
	                    }                        
        			}
        		}
        	}
        }		
	}

    // 파일단위로 최초 metadata 생성 출력
	private void makeMetadata(JsonArray gsonArrayFinal) {
		String preparationId = null;
		String datasetId = null;
		RowMetadata rowMetadata = null;
		
		for(int i = 0, len = gsonArrayFinal.size(); i < len; i++) {
			JsonObject gsonDatasetInfo = gsonArrayFinal.get(i).getAsJsonObject();			
        	String filePath = gsonDatasetInfo.get("filePath").getAsString();
        	String name = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.lastIndexOf("."));
        	
        	if(i == 0) {
        		datasetId = gsonDatasetInfo.get("datasetIds").getAsJsonArray().get(0).getAsString();
        		// 도메인 변경만 수행한 레시피 생성
        		preparationId = dprepUtil.initRecipe(datasetId);
        		rowMetadata = dprepUtil.getStepRowMetadata(preparationId);
        	}        	
        	
            String wsId = (String)springRedisTemplateUtil.valueGet("WS_ID");
            
    		DataSetMetadata dataSetMetadata = backgroundAnalysisCustom.analyze(datasetId, filePath, rowMetadata);
    		dataSetMetadata.setId(datasetId);
    		dataSetMetadata.setName(name);

    		FileSystem fs = hadoopUtil.getFs();
    		try {
    			hadoopUtil.write(fs, mapper.writeValueAsString(dataSetMetadata), hadoopResultRegBasePath, wsId, String.format("%s_before_metadata.json", name));
    		} 
    		catch (JsonProcessingException e) {
    			e.printStackTrace();
    		}
            finally {
                if(null != fs) {
                    try { fs.close(); } catch (IOException e) {}                                
                }
                
                if(i == len - 1) {
                	dprepUtil.deleteDprepData(preparationId);
                }
            }            		
		}
	}	
}

