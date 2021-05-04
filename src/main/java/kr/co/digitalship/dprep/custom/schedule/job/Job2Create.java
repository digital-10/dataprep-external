package kr.co.digitalship.dprep.custom.schedule.job;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.locks.ReentrantLock;

import org.apache.commons.lang.StringUtils;
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

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import kr.co.digitalship.dprep.custom.DprepHttpUtil;
import kr.co.digitalship.dprep.custom.FileTypeDetector;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.SplitUtil;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.CustomQuartzJobBean;
import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;

@Component
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class Job2Create extends CustomQuartzJobBean {
	private static final Logger LOGGER = LoggerFactory.getLogger(Job2Create.class);

	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job2.cronExp:}")
	private String cronExp;
	
	@Value("${dataprep.httpUtil.counter:}")
	private int counter; // 일정 수 이상의 Http Connection 을 맺을 경우 오류가 나서...	
	
	@Autowired
	private SplitUtil splitUtil;
	
	@Autowired
	private DprepUtil dprepUtil;
	
	@Autowired
	HadoopUtil hadoopUtil;	

	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private FileTypeDetector fileTypeDetector;
	
	private ReentrantLock reentrantLock;
	
	private final int jobStepIdx = 1;
	
	public Job2Create() {
		super();
		
		setJobName(this.getClass().getSimpleName());
		setTriggerName(this.getClass().getSimpleName().replace("Job", "Trigger"));
		setGroup("ProfilingBatch");
		setCronExp(cronExp);
		
		// TODO :: 실행주기의 조정 필요함		
		if(StringUtils.isBlank(cronExp)) {
			Properties properties = new PropertiesUtil().getProperties();
			
			nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
			cronExp = properties.getProperty("schedule.job2.cronExp");
			counter = Integer.parseInt(properties.getProperty("dataprep.httpUtil.counter"));

			setCronExp(cronExp);
		}
		
		setUseJobListener(true);
	}

	@Override
	public void executeInternal(JobExecutionContext context) throws JobExecutionException {
    	if(context.getJobDetail().getJobDataMap().getBoolean("job2IsRunningPossible")) {
    		LOGGER.info(String.format("QuartzJobListner - Job2 BEGIN(%d)", nodeNo));
    		
    		@SuppressWarnings("unchecked")
			List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
 			jobStatusNode.set(jobStepIdx, "RUNNING");
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
                    	Deque<String> datasetIds = splitUtil.getDatasetId(contents.size(), yyyyMMdd, "sJob", lastMetadataNamingInfo[0], lastMetadataNamingInfo[1] + i);                    	
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
                    	Deque<URIBuilder> uriBuilders = splitUtil.makeReceveHost(contents, params, true); // true : Schedule Job                			
            			
						// dataset 생성
						dprepUtil.createDataset(uriBuilders, "text/plain", contents, context);

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
            
            while(counter > DprepHttpUtil.counter) {
            	try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}                	
            }
            
            springRedisTemplateUtil.valueSet("LIST_OF_DATASET_INFO_" + nodeNo, gson.toJson(gsonArrayFinal));
            
    		context.getJobDetail().getJobDataMap().put("job2IsDonePossible", true);
    	}    		
	}
}
