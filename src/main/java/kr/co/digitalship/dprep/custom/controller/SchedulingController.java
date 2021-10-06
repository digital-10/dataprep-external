package kr.co.digitalship.dprep.custom.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.net.URISyntaxException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import javax.annotation.PostConstruct;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import org.apache.commons.lang.StringUtils;
import org.apache.http.client.utils.URIBuilder;
import org.quartz.JobKey;
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
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import kr.co.digitalship.dprep.custom.DprepHttpUtil;
import kr.co.digitalship.dprep.custom.PcnApiUtil;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.job.Job1Read;
import kr.co.digitalship.dprep.custom.schedule.job.Job2CreateDataset;
import kr.co.digitalship.dprep.custom.schedule.job.Job4Export;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob1;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob2;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob4;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerTrigger1;
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
	private Job1Read job1Read;
	
	@Autowired
	private ListenerJob1 listenerJob1;
	
	@Autowired
	private ListenerTrigger1 listenerTrigger1;	
	
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
	public String addWsId(@PathVariable String wsId) throws Exception {
		Singleton singleton = Singleton.getInstance();
		singleton.addWsId(wsId);
		
		JsonObject gsonObject = new JsonObject();
		JsonArray gsonArray = new JsonArray();
		
		gsonObject.addProperty("Added WS_ID", wsId);
		
		JsonArray wsIds = Singleton.getInstance().getWsIds();
		
		for(int i = 0, len = wsIds.size(); i < len; i++) {
			if(0 == i) {
				gsonObject.addProperty("Running WS_ID", wsIds.get(i).getAsJsonObject().get("wsId").getAsString());
			}
			else {
				gsonArray.add(wsIds.get(i).getAsJsonObject().get("wsId").getAsString());					
			}
		}
		gsonObject.add("WS_ID Queue", gsonArray);
		
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(gsonObject);
	}
	
	@RequestMapping(value = "/scheduling/delWsId/{wsId}", method = GET, produces = APPLICATION_JSON_VALUE)
	public String delWsId(@PathVariable String wsId) throws Exception {
		Singleton singleton = Singleton.getInstance();
		JsonArray wsIds = singleton.getWsIds();

		JsonObject gsonObject = new JsonObject();
		JsonArray gsonArray = new JsonArray();		
		
		if(null != wsIds) {
			for(int i = 0, len = wsIds.size(); i < len; i++) {
				String compareWsId = wsIds.get(i).getAsJsonObject().get("wsId").getAsString();
				if(wsId.equals(compareWsId)) {
					if(pcnApiUtil.getWsId().equals(compareWsId)) {
						gsonObject.addProperty("Cannot be Deleted Because This WS_ID is Currently Running", wsId);
					}
					else {
						gsonObject.addProperty("Deleted WS_ID", wsId);					
						wsIds.remove(i);						
					}					
					break;
				}
			}
			
			for(int i = 0, len = wsIds.size(); i < len; i++) {
				if(0 == i) {
					gsonObject.addProperty("Running WS_ID", wsIds.get(i).getAsJsonObject().get("wsId").getAsString());
				}
				else {
					gsonArray.add(wsIds.get(i).getAsJsonObject().get("wsId").getAsString());					
				}
			}
			gsonObject.add("WS_ID Queue", gsonArray);
		}
		
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(gsonObject);		
	}

	/**
	 * 0번 노드외 Job 추가용. 현재는 2, 4번 Job에 대해서만 필요
	 * @param jobName
	 * @return
	 */
	@RequestMapping(value = "/scheduling/addJobToNode", method = GET, produces = APPLICATION_JSON_VALUE)
	public String addJobToNode(@RequestParam(defaultValue = "", required = true) String jobName) {
		if(0 == nodeNo) {
			LOGGER.debug(String.format("Do not add anything on node %d", nodeNo));
		}
		else {
			@SuppressWarnings("unchecked")
			List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
			if(null != jobStatusNode) {
				Scheduler scheduler = factory.getScheduler();
				
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

		return "success";
	}
	
	@RequestMapping(value = "/scheduling/delPrevDprepDataFormNode", method = GET, produces = APPLICATION_JSON_VALUE)
	public String delPrevDprepDataFormNode() throws Exception {
		if(0 == nodeNo) {
			LOGGER.debug(String.format("Do not delete anything on node %d", nodeNo));
		}
		else {
			dprepUtil.deleteDprepData(0);
		}
		
		return "success";
	}	

	/**
	 * 단순 WS_ID 현재&대기열 / 노드별 Job Status 확인용 
	 * @return
	 */
	@RequestMapping(value = "/scheduling/jobStatus", method = GET, produces = APPLICATION_JSON_VALUE)	
	public String jobStatus() throws Exception {
		return this.jobStatus("cur");
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/scheduling/jobStatus/{point}", method = GET, produces = APPLICATION_JSON_VALUE)
	public String jobStatus(@PathVariable String point) throws Exception {
		if(!StringUtils.isBlank(point) && "prev".equals(point)) {
			String allJobDoneResult = (String)springRedisTemplateUtil.valueGet("ALL_JOB_DONE_RESULT");
			
			return allJobDoneResult;
		} 
		else {
			Gson gson = new GsonBuilder().setPrettyPrinting().create();
			JsonObject gsonObject = new JsonObject();
			
			JsonArray wsIds = Singleton.getInstance().getWsIds();
			if(null != wsIds && 0 < wsIds.size()) {
				JsonArray gsonArray = new JsonArray();
				for(int i = 0, len = wsIds.size(); i < len; i++) {
					if(0 == i) {
						gsonObject.addProperty("Running WS_ID", wsIds.get(i).getAsJsonObject().get("wsId").getAsString());
					}
					else {
						gsonArray.add(wsIds.get(i).getAsJsonObject().get("wsId").getAsString());
					}
				}
				gsonObject.add("WS_ID Queue", gsonArray);
				
				int totalFileCnt = 0;
				int totalDataRowCnt = 0;				
				
				gsonArray = new JsonArray();
				for(int i = 0; i < nodeCount; i++) {
					List<String> listOfFiles = (List<String>)springRedisTemplateUtil.valueGet("LIST_OF_FILES_TO_BE_PROCESSED_" + i);
					List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + i);
					List<String> jobRunningStartTime = (List<String>)springRedisTemplateUtil.valueGet("JOB_RUNNING_START_TIME_" + i);
					List<String> jobRunningEndTime = (List<String>)springRedisTemplateUtil.valueGet("JOB_RUNNING_END_TIME_" + i);
					
					JsonObject gsonObjectSub = new JsonObject();
					gsonObjectSub.addProperty("Node No", i);
					
					if(null != listOfFiles) {
						gsonObjectSub.addProperty("File Count", listOfFiles.size());
						
						totalFileCnt += listOfFiles.size();
					}
					
					int dataRowCnt = 0;
					String jsonStrDatasetInfo = (String)springRedisTemplateUtil.valueGet("LIST_OF_DATASET_INFO_" + i);
					if(StringUtils.isNotBlank(jsonStrDatasetInfo)) {
						JsonArray gsonArrayDatasetInfo = new JsonParser().parse(jsonStrDatasetInfo).getAsJsonArray();
						
						List<ProcessingInfomationVO> datasetInfo = gson.fromJson(gsonArrayDatasetInfo, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
						for(int j = 0, jLen = datasetInfo.size(); j < jLen; j++) {
							dataRowCnt += datasetInfo.get(j).getLineCnt(); 
						}
						gsonObjectSub.addProperty("Data Rows", dataRowCnt);
						
						totalDataRowCnt += dataRowCnt;
					}										

					if(null != jobStatusNode) {
						JsonArray gsonArraySub = new JsonArray();
						for(int j = 0, jlen = jobStatusNode.size(); j < jlen; j++) {
							gsonArraySub.add(jobStatusNode.get(j));							
						}
						gsonObjectSub.add("Job Status", gsonArraySub);
					}
					
					if(null != jobRunningStartTime) {
						JsonArray gsonArraySub = new JsonArray();
						for(int j = 0, jlen = jobRunningStartTime.size(); j < jlen; j++) {
							gsonArraySub.add(jobRunningStartTime.get(j));							
						}
						gsonObjectSub.add("Job Start Time", gsonArraySub);
					}
					
					if(null != jobRunningEndTime) {
						JsonArray gsonArraySub = new JsonArray();
						for(int j = 0, jlen = jobRunningEndTime.size(); j < jlen; j++) {
							gsonArraySub.add(jobRunningEndTime.get(j));							
						}
						gsonObjectSub.add("Job End Time", gsonArraySub);
					}					
					
					gsonArray.add(gsonObjectSub);
				}
				gsonObject.add("Info", gsonArray);
				gsonObject.addProperty("Total File Count", totalFileCnt);
				gsonObject.addProperty("Total Data Rows", totalDataRowCnt);
				
				int node0 = -1;
				try {
					node0 = (Integer)springRedisTemplateUtil.valueGet("NODE_0");
				} 
				catch (Exception e) {}
				
				if(-1 < node0) {
					List<String> jobRunningStartTime = (List<String>)springRedisTemplateUtil.valueGet("JOB_RUNNING_START_TIME_" + node0);
					List<String> jobRunningEndTime = (List<String>)springRedisTemplateUtil.valueGet("JOB_RUNNING_END_TIME_" + node0);
					
					String startTime = jobRunningStartTime.get(1);
					String endTime = jobRunningEndTime.get(jobRunningEndTime.size() - 1);
					
					try {
						Date startDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S").parse(startTime);
						Date endDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S").parse(endTime);
						
						long diff = endDate.getTime() - startDate.getTime();
						long d = diff / (1000 * 60 * 60 * 24);
						long h = (diff / (1000 * 60 * 60)) % 24;
						long m = (diff / (1000 * 60)) % 60;
						long s = (diff / 1000) % 60;
						long ss = diff % 1000;
						
						gsonObject.addProperty("Total Running Time", String.format("약 %d일 %d시간 %d분 %d.%d초", d, h, m, s, ss));
					} 
					catch (ParseException e) {
					}
				}				
				
				return gson.toJson(gsonObject);
			}			
			return "No WS_IDs target for operation";
		}
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

			scheduler.deleteJob(JobKey.jobKey("Job1Read", "ProfilingBatch"));
			scheduler.deleteJob(JobKey.jobKey("Job2CreateDataset", "ProfilingBatch"));
			scheduler.deleteJob(JobKey.jobKey("Job3CopyRecipe", "ProfilingBatch"));
			scheduler.deleteJob(JobKey.jobKey("Job4Export", "ProfilingBatch"));
			
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
            
            QuartzConfigUtil.scheduleJob(scheduler, job1Read, listenerJob1, listenerTrigger1);
		} 
		catch (SchedulerException e) {
			e.printStackTrace();
		}
		
		if(0 == nodeNo) {
			pcnApiUtil.getNextWsId(pcnApiUtil.getAuth());
		}

		return "success";
	}
}
