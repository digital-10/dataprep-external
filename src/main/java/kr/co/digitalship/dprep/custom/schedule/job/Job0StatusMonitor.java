package kr.co.digitalship.dprep.custom.schedule.job;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import javax.annotation.PostConstruct;

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

import kr.co.digitalship.dprep.custom.DprepHttpUtil;
import kr.co.digitalship.dprep.custom.PcnApiUtil;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.controller.SchedulingController;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.CustomQuartzJobBean;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob1;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob4;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerTrigger1;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerTrigger4;
import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;

@Component
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class Job0StatusMonitor extends CustomQuartzJobBean {
	private static final Logger LOGGER = LoggerFactory.getLogger(Job0StatusMonitor.class);
	
	@Value("${dataprep.node.count:0}")
	private int nodeCount;
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job0_2.cronExp:}")
	private String cronExp;
	
    @Value("${dataset.service.url:}")
    private String[] datasetServiceUrl; 
	
	@Value("${dataprep.httpUtil.counter:}")
	private int counter; // 일정 수 이상의 Http Connection 을 맺을 경우 오류가 나서...    
    
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private Job1Read job1Read;
	
	@Autowired
	private ListenerJob1 listenerJob1;
	
	@Autowired
	private ListenerTrigger1 listenerTrigger1;
	
	@Autowired
	private Job4Export job4Export;
	
	@Autowired
	private ListenerJob4 listenerJob4;

	@Autowired
	private ListenerTrigger4 listenerTrigger4;		
	
	@Autowired
	private PcnApiUtil pcnApiUtil;	
	
	@Autowired
	private SchedulingController schedulingController;
	
	@Autowired
	private DprepUtil dprepUtil;	
	
	public Job0StatusMonitor() {
		super();
		
		setJobName(this.getClass().getSimpleName());
		setTriggerName(this.getClass().getSimpleName().replace("Job", "Trigger"));
		setGroup("ProfilingStatusMonitorBatch");
	}
	
	@PostConstruct
	public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
		nodeCount = Integer.parseInt(properties.getProperty("dataprep.node.count"));
		nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
		cronExp = properties.getProperty("schedule.job0_2.cronExp");
		datasetServiceUrl = properties.getProperty("dataset.service.url").trim().split("\\s*,\\s*");
		counter = Integer.parseInt(properties.getProperty("dataprep.httpUtil.counter"));

		setCronExp(cronExp);
	}	

	@Override
	public void executeInternal(JobExecutionContext context) throws JobExecutionException {
		LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " executeInternal Start (%d)", nodeNo));		
		
		int chkCnt = 0;
		// 모든 Job이 종료이거나 더이상 진행할 수 없는 경우 초기 0번 노드의 1번 Job의 재시작을 위한...
		for(int i = 0; i < nodeCount; i++) {
			@SuppressWarnings("unchecked")
			List<String> jobStatusNode  = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + i);
			if(null != jobStatusNode && (jobStatusNode.contains("END") || "DONE".equals(jobStatusNode.get(jobStatusNode.size() - 1)))) {
				chkCnt += 1;
			}
		}

		if(chkCnt == nodeCount) {
			try {
				String allJobDoneResult = schedulingController.jobStatus();
				
				springRedisTemplateUtil.valueSet("ALL_JOB_DONE_RESULT", allJobDoneResult);
				LOGGER.debug(String.format("All Job End/Done Result - %s", allJobDoneResult));				
			} catch (Exception e) {
			}
			
			for(int i = nodeCount - 1; i >= 0; i--) {
				if(0 == i) {
					dprepUtil.deleteDprepData(0);
				}
				else {
			    	DprepHttpUtil dprepHttpUtil = new DprepHttpUtil().init();
			    	
					try {
						URIBuilder uriBuilder = new URIBuilder(datasetServiceUrl[i]);
						uriBuilder.setPath("/scheduling/delPrevDprepDataFormNode");
						
						dprepHttpUtil.callAsyncCommon(uriBuilder, "GET", "text/plain", null);
					}
					catch (URISyntaxException e) {
						e.printStackTrace();
					}         			
				}					
			}
			
			DprepHttpUtil.counter = new AtomicInteger(counter);
			pcnApiUtil.getNextWsId(pcnApiUtil.getAuth());
			
			List<String> deleteKeys = new ArrayList<>();
			
			deleteKeys.add("NODE_0");
			deleteKeys.add("WS_ID");
			for(int i = 0; i < nodeCount; i++) {
				deleteKeys.add("ACTIONS_" + i);
				deleteKeys.add("JOB_RUNNING_START_TIME_" + i);
				deleteKeys.add("JOB_RUNNING_END_TIME_" + i);
				deleteKeys.add("JOB_STATUS_NODE_" + i);
				deleteKeys.add("INCLUDE_PREPARATION_TARGET_INFO_" + i);			
				deleteKeys.add("INCLUDE_META_INFO_" + i);				
				deleteKeys.add("LIST_OF_DATASET_INFO_" + i);
				deleteKeys.add("LIST_OF_FILES_TO_BE_PROCESSED_" + i);
				deleteKeys.add("LIST_OF_EXPORT_" + i);				
				deleteKeys.add("TARGET_PREPARATION_CANDIDATE_" + i);
			}			
			springRedisTemplateUtil.delete(deleteKeys);			
	
			List<String> jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"NEW", "NEW", "NEW", "NEW"}));
			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_0", jobStatusNode);
			
			QuartzConfigUtil.scheduleJob(context, job1Read, listenerJob1, listenerTrigger1);
			
			LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " executeInternal - Re-Ready-Schedule (%d)", nodeNo));
			return;
		}
		
		// 0 번 노드의 결정 및 Job4의 실행		
		chkCnt = 0;
		for(int i = 0; i < nodeCount; i++) {
			@SuppressWarnings("unchecked")
			List<String> jobStatusNode  = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + i);
			if(null != jobStatusNode && (jobStatusNode.contains("END") || "DONE".equals(jobStatusNode.get(2)))) {
				chkCnt += 1;
			}
		}
		
		if(chkCnt == nodeCount) {
			for(int i = 0; i < nodeCount; i++) {
				int node0 = -1;
				try {
					node0 = (Integer)springRedisTemplateUtil.valueGet("NODE_0");
				} 
				catch (Exception e) {}
				
				if(-1 < node0) {
					break;
				}

				@SuppressWarnings("unchecked")
				List<String> jobStatusNode  = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + i);				
				
				if("DONE".equals(jobStatusNode.get(2))) {
					springRedisTemplateUtil.valueSet("NODE_0", i);
					break;
				}
			}
			
			// 0 번 노드가 결정이 되면...Job4 를 실행 (Job4 가 없는 경우) 
			for(int i = nodeCount - 1; i >= 0; i--) {
				@SuppressWarnings("unchecked")
				List<String> jobStatusNode  = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + i);
				
				if("DONE".equals(jobStatusNode.get(2)) && "NEW".equals(jobStatusNode.get(jobStatusNode.size() - 1))) {
					LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " executeInternal - Job4-Ready (%d)", i));
					
					if(0 == i) {
						QuartzConfigUtil.scheduleJob(context, job4Export, listenerJob4, listenerTrigger4);
					}
					else {
	        			QuartzConfigUtil.addJobToNode(datasetServiceUrl[i], "job4Export");
					}					
				}
			}
			return;
		}
		LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " executeInternal End (%d)", nodeNo));
	}
}

