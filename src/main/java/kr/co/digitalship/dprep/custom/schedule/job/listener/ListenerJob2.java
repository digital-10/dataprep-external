package kr.co.digitalship.dprep.custom.schedule.job.listener;

import java.util.List;
import java.util.Properties;

import javax.annotation.PostConstruct;

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
import kr.co.digitalship.dprep.custom.schedule.job.Job3ExportSingle;
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;

@Component
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class ListenerJob2 implements JobListener {
	private static final Logger LOGGER = LoggerFactory.getLogger(ListenerJob2.class);
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private Job3ExportSingle job3ExportSingle;
	
	@Autowired
	private ListenerJob3 listenerJob3;
	
	private final int jobStepIdx = 1;
	
	public ListenerJob2() {
		init();
	}
	
	@PostConstruct
	public void init() {
		if(0 == dependenceWait) {
			Properties properties = new PropertiesUtil().getProperties();
			
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
    	boolean job2IsRunningPossible = true;
		
 		@SuppressWarnings("unchecked")
		List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
 		
		if(!"NEW".equals(jobStatusNode.get(jobStepIdx))) {
			job2IsRunningPossible = false;
 		}

        context.getJobDetail().getJobDataMap().put("job2IsRunningPossible", job2IsRunningPossible);
        context.getJobDetail().getJobDataMap().put("job2IsDonePossible", false);
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
    public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {
		if(context.getJobDetail().getJobDataMap().getBoolean("job2IsDonePossible")) {
			@SuppressWarnings("unchecked")
			List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
			jobStatusNode.set(jobStepIdx, "DONE");
			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
	
			QuartzConfigUtil.scheduleJob(context, job3ExportSingle, listenerJob3);
			QuartzConfigUtil.deleteJob(context);
			
			LOGGER.info(String.format("QuartzJobListner - Job2 DONE(%d)", nodeNo));			
		}
    }   
}
