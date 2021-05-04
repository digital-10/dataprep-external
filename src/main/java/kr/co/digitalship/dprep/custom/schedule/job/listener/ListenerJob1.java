package kr.co.digitalship.dprep.custom.schedule.job.listener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.apache.http.client.utils.DateUtils;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

import kr.co.digitalship.dprep.custom.PcnApiUtil;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.job.Job2Create_Refactoring;
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;

@Component
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class ListenerJob1_Refactoring implements JobListener {
	private static final Logger LOGGER = LoggerFactory.getLogger(ListenerJob1_Refactoring.class);
	
	@Value("${dataprep.node.count:0}")
	private int nodeCount;
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;

	@Value("${schedule.job1.reschedule:}")
	private boolean job1Reschedule;	
	
	@Value("${schedule.job1_2.cronExp:}")
	private String job1cronExp_2;
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private PcnApiUtil pcnApiUtil;	

	@Autowired
	private Job2Create_Refactoring job2Create;
	
	@Autowired
	private ListenerJob2_Refactoring listenerJob2;
	
	private final int jobStepIdx = 0;	
	
	public ListenerJob1_Refactoring() {
		init();
	}
	
	@PostConstruct
	public void init() {
		if(0 == nodeCount) {
			Properties properties = new PropertiesUtil().getProperties();
			
			nodeCount = Integer.parseInt(properties.getProperty("dataprep.node.count"));
			nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
			dependenceWait = Integer.parseInt(properties.getProperty("schedule.job.dependence.wait"));
			job1Reschedule = Boolean.parseBoolean(properties.getProperty("schedule.job1.reschedule"));
			job1cronExp_2 = properties.getProperty("schedule.job1_2.cronExp");	
		}
	}
	
    @Override
    public String getName() {
        return getClass().getName();
    }

    /**
     * JobDetail이 실행될 떄 스케줄러에의해서 호출되는 메서드
     * Job 상태 정보 초기 셋팅 및 실행 여부 판단
     * 
     * @param context
     */    
    @Override
    public void jobToBeExecuted(JobExecutionContext context) {
    	// Job 실행 여부에 대한 최종 판단값
 		boolean job1IsRunningPossible = true;
 		
 		// 전체 Job 상태 정보에 대한 초기 셋팅 
		@SuppressWarnings("unchecked")
		List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
		if(null == jobStatusNode) {
			jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"NEW", "NEW", "NEW", "NEW"}));
			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
		}

		if(!"NEW".equals(jobStatusNode.get(jobStepIdx))) {
 			job1IsRunningPossible = false;
 		}
        
		// WS_ID 에 대한 결정과 이전값과 다른 경우에 Redis에 저장
		String token = pcnApiUtil.getAuth();
		String wsId1 = (String)springRedisTemplateUtil.valueGet("WS_ID");
		String wsId2 = pcnApiUtil.getWsId(token);
		
		if(StringUtils.isNotEmpty(wsId1)) {
			if(!wsId2.equals(wsId1)) {
				springRedisTemplateUtil.valueSet("WS_ID", wsId2);
			}			
		}
		else {
			if(StringUtils.isNotEmpty(wsId2)) {
				springRedisTemplateUtil.valueSet("WS_ID", wsId2);
			}
		}
		
		wsId1 = (String)springRedisTemplateUtil.valueGet("WS_ID");
		if(StringUtils.isEmpty(wsId1)) {
			job1IsRunningPossible = false;
		}
        
		// DATE_OF_PROCESSING 대한 결정과 이전값과 다른 경우에 Redis에 저장
		String yyyyMMdd1 = (String)springRedisTemplateUtil.valueGet("DATE_OF_PROCESSING");
		String yyyyMMdd2 = DateUtils.formatDate(new Date(), "yyyyMMdd");
		if(StringUtils.isNotEmpty(yyyyMMdd1)) {
    		if(!yyyyMMdd2.equals(yyyyMMdd1)) {
    			springRedisTemplateUtil.valueSet("DATE_OF_PROCESSING", yyyyMMdd2);
    		}
		}
		else {
			springRedisTemplateUtil.valueSet("DATE_OF_PROCESSING", yyyyMMdd2);
		}
		
        context.getJobDetail().getJobDataMap().put("job1IsRunningPossible", job1IsRunningPossible); // Job 실행 여부
        context.getJobDetail().getJobDataMap().put("job1IsDonePossible", false); // Job 종료 가능여부
    }

    @Override
    public void jobExecutionVetoed(JobExecutionContext context) {
        // JobDetail이 실행횔 때 TriggerListener가 실행
    	//JobKey jobKey = context.getJobDetail().getKey();
    	//System.out.println(this.getName() + " - jobExecutionVetoed :: " + jobKey);
    }

    /**
     * Job 실행이 완료된 후 호출되는 메서드
     * Job 의 종료 및 후속 실행 Job 셋팅
     * 
     * @param context
     * @param jobException
     */    
	@Override
    @SuppressWarnings("unchecked")	
    public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {
		// Job 실행 여부
    	if(context.getJobDetail().getJobDataMap().getBoolean("job1IsRunningPossible")) {
    		boolean job1IsDonePossible = false;
    		boolean job1IsDoNotProceedAfter = false;
    		
    		List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);    		
        	// 0번 Node 이외의 경우는 실제 작업이 없기 때문에 0번 노드의 상태를 확인하고 종료한다.        	
        	if(0 != nodeNo && !"DONE".equals(jobStatusNode.get(jobStepIdx))) {
            	List<String> jobStatusNode0 = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + 0);
            	
        		if(!"DONE".equals(jobStatusNode0.get(jobStepIdx))) {
            		do {
            			try {
        					Thread.sleep(dependenceWait);
        				} 
            			catch (InterruptedException e) {
        					e.printStackTrace();
        				}
            			jobStatusNode0 = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + 0);
            		}
            		while(!"DONE".equals(jobStatusNode0.get(jobStepIdx)));
            		
            		// 해당 노드에서 처리할 파일이 있는 경우와 없는 경우에 따라...
            		List<String> fileList = (List<String>)springRedisTemplateUtil.valueGet("LIST_OF_FILES_TO_BE_PROCESSED_" + nodeNo);
            		if(null != fileList && 0 < fileList.size()) {
            			job1IsDonePossible = true;            			
            		}
            		else {
            			job1IsDoNotProceedAfter = true;
            		}
        		}
        	}
       	
    		if(job1IsDonePossible || context.getJobDetail().getJobDataMap().getBoolean("job1IsDonePossible")) {
    			jobStatusNode.set(jobStepIdx, "DONE");
    			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
    			
    			QuartzConfigUtil.scheduleJob(context, job2Create, listenerJob2);
    			QuartzConfigUtil.deleteJob(context);

    			LOGGER.info(String.format("QuartzJobListner - Job1 DONE(%d)", nodeNo));
    		}
    		else {
    			try {
					if(job1IsDoNotProceedAfter) {
						jobStatusNode.set(jobStepIdx, "END");
						springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
						
						LOGGER.info(String.format("QuartzJobListner - Job1 Do not proceed after(%d)", nodeNo));							
					}
				} 
    			catch (Exception e) {}
    		}
    	}
    }
}
