package kr.co.digitalship.dprep.custom.schedule.job.listener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.job.Job3CopyRecipe;
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
	private Job3CopyRecipe job3CopyRecipe;
	
	@Autowired
	private ListenerJob3 listenerJob3;
	
	@Autowired
	private ListenerTrigger3 listenerTrigger3;
	
	@PostConstruct
	public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
		nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
		dependenceWait = Integer.parseInt(properties.getProperty("schedule.job.dependence.wait"));  			
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

		context.getJobDetail().getJobDataMap().put("job2IsDonePossible", false); // Job 종료 가능여부
    }

    @Override
    public void jobExecutionVetoed(JobExecutionContext context) {
    	LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " jobExecutionVetoed (%d)", nodeNo));
    	
		List<String> jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"DONE", "END", "END", "END"}));
		springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);

		QuartzConfigUtil.deleteJob(context);
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
    	LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " jobWasExecuted (%d)", nodeNo));
    	
		if(context.getJobDetail().getJobDataMap().getBoolean("job2IsDonePossible")) {
			List<String> jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"DONE", "DONE", "NEW", "NEW"}));
			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
	
			QuartzConfigUtil.deleteJob(context);
			QuartzConfigUtil.scheduleJob(context, job3CopyRecipe, listenerJob3, listenerTrigger3);
		}
    }   
}
