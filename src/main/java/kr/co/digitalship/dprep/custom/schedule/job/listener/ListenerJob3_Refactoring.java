package kr.co.digitalship.dprep.custom.schedule.job.listener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.job.Job1Read_Refactoring;
import kr.co.digitalship.dprep.custom.schedule.job.Job4ExportMulti_Refactoring;
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;

@Component
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class ListenerJob3_Refactoring implements JobListener {
	private static final Logger LOGGER = LoggerFactory.getLogger(ListenerJob3_Refactoring.class);
	
	@Value("${dataprep.node.count:0}")
	private int nodeCount;	
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private Job4ExportMulti_Refactoring job4ExportMulti;
	
	@Autowired
	private ListenerJob4_Refactoring listenerJob4;
	
	@Autowired
	private Job1Read_Refactoring job1Read;
	
	@Autowired
	private ListenerJob1_Refactoring listenerJob1;	
	
	private final int jobStepIdx = 2;
	
	public ListenerJob3_Refactoring() {
		init();
	}
	
	@PostConstruct
	public void init() {
		if(0 == dependenceWait) {
			Properties properties = new PropertiesUtil().getProperties();
			
			nodeCount = Integer.parseInt(properties.getProperty("dataprep.node.count"));
			nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
			dependenceWait = Integer.parseInt(properties.getProperty("schedule.job.dependence.wait"));	        			
		}
	}	
	
    @Override
    public String getName() {
        return getClass().getName();
    }

    /**
     * JobDetail이 실행될 떄 스케줄러에의해서 호출되는 메서드
     * 
     * @param context
     */      
    @Override
    public void jobToBeExecuted(JobExecutionContext context) {
    	// Job 실행 여부에 대한 최종 판단값
    	boolean job3IsRunningPossible = true;
        
    	@SuppressWarnings("unchecked")
		List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
 		
		if(!"NEW".equals(jobStatusNode.get(jobStepIdx))) {
			job3IsRunningPossible = false;
 		}

        context.getJobDetail().getJobDataMap().put("job3IsRunningPossible", job3IsRunningPossible);
        context.getJobDetail().getJobDataMap().put("job3IsDonePossible", false);   
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
		if(context.getJobDetail().getJobDataMap().getBoolean("job3IsDonePossible")) {
			// 해당 단계에서 개별 노드가 작업이 중단 될 수 있기 때문에...제일 먼저 작업이 끝나는 노드에 0번 노드의 역활을 부여하기 위해. 
			// 거의 비슷하게 들어오면...아...답이...아...어떻게하지...
			String strNode0 = (String)springRedisTemplateUtil.valueGet("NODE_0");
			if(StringUtils.isEmpty(strNode0)) {
				springRedisTemplateUtil.valueSet("NODE_0", String.valueOf(nodeNo));
			}			
			
			List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
			jobStatusNode.set(jobStepIdx, "DONE");
			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
			
			QuartzConfigUtil.scheduleJob(context, job4ExportMulti, listenerJob4);
			QuartzConfigUtil.deleteJob(context);
			
			LOGGER.info(String.format("QuartzJobListner - Job3 DONE(%d)", nodeNo));
		}
		else {
			try {  
				if(context.getJobDetail().getJobDataMap().getBoolean("job3IsDoNotProceedAfter")) {
					List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
					jobStatusNode.set(jobStepIdx, "END");
					springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);					
					
					// 
					QuartzConfigUtil.scheduleJob(context, job1Read, listenerJob1);
					QuartzConfigUtil.deleteJob(context);
					
					LOGGER.info(String.format("QuartzJobListner - Job3 Do not proceed after(%d)", nodeNo));		
					
					// 전체 노드에 복제 대상 레시피가 없는 경우에 대한 고려
					boolean flag = true;
					for(int i = 0, len = nodeCount; i < len; i++) {
						List<String> jobStatus = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + i);
						if(!jobStatus.contains("END")) {
							flag = false;
							break;
						}
					}
					
					if(flag) {
						for(int i = 0, len = nodeCount; i < len; i++) {
							jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"NEW", "NEW", "NEW", "NEW"}));
							springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + i, jobStatusNode);							
						}
						LOGGER.info(String.format("QuartzJobListner - Job3 All Reset(%d)", nodeNo));
					}
				}
			} 
			catch (Exception e) {}			
		}
    }  
}
