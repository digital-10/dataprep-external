package kr.co.digitalship.dprep.custom.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import javax.annotation.PostConstruct;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.http.client.utils.URIBuilder;
import org.quartz.JobExecutionContext;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import kr.co.digitalship.dprep.custom.DprepHttpUtil;
import kr.co.digitalship.dprep.custom.PcnApiUtil;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.job.Job2CreateDataset;
import kr.co.digitalship.dprep.custom.schedule.job.Job4Export;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob2;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob4;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerTrigger2;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerTrigger4;
import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

@RestController
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class SchedulingController {
	private static final Logger LOGGER = LoggerFactory.getLogger(SchedulingController.class);
	
	@Value("${dataprep.node.count:0}")
	private int nodeCount;		
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
    @Value("${dataset.service.url:}")
    private String[] datasetServiceUrl; 
	
	@Value("${dataprep.httpUtil.counter:}")
	private int counter; // 일정 수 이상의 Http Connection 을 맺을 경우 오류가 나서...     
    
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;	
	
	@Autowired
	HadoopUtil hadoopUtil;
	
	@Autowired
	SchedulerFactoryBean factory;
	
	@Autowired
	private Job2CreateDataset job2CreateDataset;
	
	@Autowired
	private ListenerJob2 listenerJob2;
	
	@Autowired
	private ListenerTrigger2 listenerTrigger2;
	
	@Autowired
	private Job4Export job4Export;
	
	@Autowired
	private ListenerJob4 listenerJob4;

	@Autowired
	private ListenerTrigger4 listenerTrigger4;
	
	@Autowired
	private DprepUtil dprepUtil;
	
	@Autowired
	private PcnApiUtil pcnApiUtil;

	@Autowired
	private DprepHttpUtil dprepHttpUtil;	
	
    @PostConstruct
    public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();

		nodeCount = Integer.parseInt(properties.getProperty("dataprep.node.count"));
		nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
		datasetServiceUrl = properties.getProperty("dataset.service.url").trim().split("\\s*,\\s*");
		counter = Integer.parseInt(properties.getProperty("dataprep.httpUtil.counter"));
    }  	
	
	/**
	 * 테스트용 WS_ID 추가
	 * @param wsId
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/scheduling/addWsId/{wsId}", method = GET, produces = APPLICATION_JSON_VALUE)
	public String start(@PathVariable String wsId) throws Exception {
		Singleton singleton = Singleton.getInstance();
		if(StringUtils.isNotBlank(wsId)) {
			singleton.addWsId(wsId);
		}

		return "(Added) Current WsIds : " + singleton.getWsIds().toString();
	}

	/**
	 * 0번 노드외 Job 추가용. 현재는 2, 4번 Job에 대해서만 필요
	 * @param jobName
	 * @return
	 */
	@RequestMapping(value = "/scheduling/addJobToNode", method = GET, produces = APPLICATION_JSON_VALUE)
	public String addJobToNode(@RequestParam(defaultValue = "", required = true) String jobName) {
		if(0 == nodeNo) {
			LOGGER.debug(String.format("Nothing add for Node %d", nodeNo));
		}
		else {
			Scheduler scheduler = factory.getScheduler();
			
			@SuppressWarnings("unchecked")
			List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
			if(null != jobStatusNode) {
	        	if("NEW".equals(jobStatusNode.get(1)) && "job2CreateDataset".equals(jobName)) {
	        		DprepHttpUtil.counter = new AtomicInteger(counter);
	            	QuartzConfigUtil.scheduleJob(scheduler, job2CreateDataset, listenerJob2, listenerTrigger2);
	            	LOGGER.debug(String.format("Job %s add for Node (%d)", jobName, nodeNo));
	        	}
	        	else if("NEW".equals(jobStatusNode.get(3)) && "job4Export".equals(jobName)) {
	        		QuartzConfigUtil.scheduleJob(scheduler, job4Export, listenerJob4, listenerTrigger4);
	        		LOGGER.debug(String.format("Job %s add for Node (%d)", jobName, nodeNo));
	        	}
	        	else {
	        		LOGGER.debug(String.format("Unsupported job %s Node (%d)", jobName, nodeNo));
	        	}				
			}
		}

		return "";
	}

	/**
	 * 단순 WS_ID 현재&대기열 / 노드별 Job Status 확인용 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/scheduling/jobStatus", method = GET, produces = APPLICATION_JSON_VALUE)
	public String jobStatus() {
		StringBuilder stringBuilder = new StringBuilder("WS_ID Queue : ");
		
		if(null != Singleton.getInstance().getWsIds()) {
			stringBuilder.append(Singleton.getInstance().getWsIds().toString());			
		}
		stringBuilder.append(" | ");

		for(int i = 0; i < nodeCount; i++) {
			List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + i);
			List<String> jobRunningStartTime = (List<String>)springRedisTemplateUtil.valueGet("JOB_RUNNING_START_TIME_" + i);
			List<String> jobRunningEndTime = (List<String>)springRedisTemplateUtil.valueGet("JOB_RUNNING_END_TIME_" + i);
			List<String> listOfFiles = (List<String>)springRedisTemplateUtil.valueGet("LIST_OF_FILES_TO_BE_PROCESSED_" + i);

			int lineCnt = 0;
			String jsonStrDatasetInfo = (String)springRedisTemplateUtil.valueGet("LIST_OF_DATASET_INFO_" + i);
			if(StringUtils.isNotBlank(jsonStrDatasetInfo)) {
				JsonArray gsonArrayDatasetInfo = new JsonParser().parse(jsonStrDatasetInfo).getAsJsonArray();
				
				Gson gson = new Gson();
				List<ProcessingInfomationVO> datasetInfo = gson.fromJson(gsonArrayDatasetInfo, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
				for(int j = 0, jLen = datasetInfo.size(); j < jLen; j++) {
					lineCnt += datasetInfo.get(j).getLineCnt(); 
				}
			}
			
			stringBuilder.append("Node(").append(i).append(") : ");
			if(null != jobStatusNode) {
				stringBuilder.append(jobStatusNode);
			}
			
			if(null != jobRunningStartTime) {
				stringBuilder.append(", Job Start Time : ").append(jobRunningStartTime);
			}
			
			if(null != jobRunningStartTime) {
				stringBuilder.append(", Job End Time : ").append(jobRunningEndTime);
			}					
			
			if(null != listOfFiles) {
				stringBuilder.append(", Total File Count : ").append(listOfFiles.size());
			}			
			stringBuilder.append(", Total Line Count : ").append(lineCnt);
			
			if(i < nodeCount - 1) {
				stringBuilder.append(" | ");
			}
			LOGGER.debug(stringBuilder.toString());
		}			

		return stringBuilder.toString();
	}
	
	/**
	 * 강제 리셋용
	 * @return
	 */
	@RequestMapping(value = "/scheduling/forceReset", method = GET, produces = APPLICATION_JSON_VALUE)
	public String forceReset() {
		List<String> deleteKeys = new ArrayList<>();
		
		if(0 == nodeNo) {
			deleteKeys.add("NODE_0");
			deleteKeys.add("WS_ID");
			deleteKeys.add("DATE_OF_PROCESSING");
			
			Map<String, String> params = new HashMap<>();        			
			params.put("path", "/scheduling/forceReset");
			
			// Node 0 은 제외
			for(int i = 1, len = datasetServiceUrl.length; i < len; i++) {
				try {
					URIBuilder uriBuilder = new URIBuilder(datasetServiceUrl[i]);
					
					Iterator<String> keys = params.keySet().iterator();
					while(keys.hasNext()) {
						String key = keys.next();
						
						if("path".equals(key)) {
							uriBuilder.setPath(params.get(key));
						}
						else {
							uriBuilder.addParameter(key, params.get(key));
						}
					}
					
					dprepHttpUtil.callAsyncCommon(uriBuilder, "GET", "text/plain", null);
					LOGGER.debug(String.format("Async Call forceReset Node (%d)", i));
				}
				catch (URISyntaxException e) {
					e.printStackTrace();
				} 					
			}
		}
		
		try {
			Scheduler scheduler = factory.getScheduler();
			List<JobExecutionContext> currentJobs = scheduler.getCurrentlyExecutingJobs();
			
			// Job 의 제거
	        for(JobExecutionContext ctx : currentJobs) {
	            String ctxGroupName = ctx.getJobDetail().getKey().getGroup();
	            
	            if("ProfilingBatch".equals(ctxGroupName)) {
	            	LOGGER.debug(String.format("Delete job %s Node (%d)", ctx.getJobDetail().getKey().getName(), nodeNo));
	            	QuartzConfigUtil.deleteJob(ctx);
	            }
	        }
	        
        	// 이전 작업에 대한 초기화를 위해...
	        int lastStep = -1;
            @SuppressWarnings("unchecked")
            List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
            if(null != jobStatusNode) {
                for(int i = jobStatusNode.size() - 1; i >= 0; i--) {
                	if("DONE".equals(jobStatusNode.get(i))) {
                		lastStep = i;
                		LOGGER.debug(String.format("Last Step %d Node (%d)", i, nodeNo));
                		break;
                	}
                }
                
                if(3 > lastStep) {
    	            if(0 <= lastStep) {
    	            	deleteKeys.add("JOB_STATUS_NODE_" + nodeNo);
    	            	deleteKeys.add("JOB_RUNNING_START_TIME_" + nodeNo);
    	            	deleteKeys.add("LIST_OF_FILES_TO_BE_PROCESSED_" + nodeNo);
    	            }
    	            if(1 <= lastStep) {
    	            	deleteKeys.add("LIST_OF_DATASET_INFO_" + nodeNo); // 얘가 있으면 데이터셋이 만들어진 것 - 데이터셋 파일 제거 필요
    	            }
    	            if(2 == lastStep) {
    	            	deleteKeys.add("INCLUDE_PREPARATION_TARGET_INFO_" + nodeNo);
    	            	deleteKeys.add("INCLUDE_META_INFO_" + nodeNo);
    	            	deleteKeys.add("LIST_OF_EXPORT_" + nodeNo); // 얘가 있으면 레시피가 만들어진 것 - 레시피 파일 제거 필요
    	            }
    	            
    	            dprepUtil.deleteDprepData(-1);
    	            
    	            springRedisTemplateUtil.delete(deleteKeys);
                }            	
            }
		} 
		catch (SchedulerException e) {
			e.printStackTrace();
		}
		
		if(0 == nodeNo) {
			pcnApiUtil.getNextWsId(pcnApiUtil.getAuth());
		}

		return "";
	}	
	
	/**
	 * Hadoop Write 테스트
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/test/connect/hadoop", method = GET, produces = APPLICATION_JSON_VALUE)
	public String testConnectHadoop() throws Exception {
		String content = "Hadoop Write Disabled";
		
		FileSystem fs = hadoopUtil.getFs();
		try {
			hadoopUtil.write(fs, "Hadoop Write Enabled", "", "", "HADOOP_WRITE.TEST");
			
			FSDataInputStream FSDataInputStream = fs.open(new Path("/HADOOP_WRITE.TEST"));
			content = IOUtils.toString(FSDataInputStream, "UTF-8");
			
			fs.delete(new Path("/HADOOP_WRITE.TEST"), false);
		} 
		catch (IllegalArgumentException | IOException e) {
			e.printStackTrace();
		}
		finally {
			fs.close();
		}
		
		return content;
	}

	/**
	 * Redis Write 테스트
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/test/connect/redis", method = GET, produces = APPLICATION_JSON_VALUE)
	public String testConnectRedis() throws Exception {
		String result = "Redis Connect Disable";
		springRedisTemplateUtil.valueSet("REDIS_CONNECT_TEST", "Redis Connected");
		
		result = (String)springRedisTemplateUtil.valueGet("REDIS_CONNECT_TEST");
		springRedisTemplateUtil.delete("REDIS_CONNECT_TEST");
		
		return result;
	}
}
