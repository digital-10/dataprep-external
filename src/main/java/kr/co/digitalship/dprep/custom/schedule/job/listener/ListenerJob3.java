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
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;

@Component
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class ListenerJob3 implements JobListener {
	private static final Logger LOGGER = LoggerFactory.getLogger(ListenerJob3.class);
	
	//@Value("${dataprep.node.count:0}")
	//private int nodeCount;	
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;

	@PostConstruct
	public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
		//nodeCount = Integer.parseInt(properties.getProperty("dataprep.node.count"));
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
    	
        context.getJobDetail().getJobDataMap().put("job3IsDonePossible", false);
    }

    @Override
    public void jobExecutionVetoed(JobExecutionContext context) {
    	LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " jobExecutionVetoed (%d)", nodeNo));
    	
		List<String> jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"DONE", "DONE", "END", "END"}));
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
		
		if(context.getJobDetail().getJobDataMap().getBoolean("job3IsDonePossible")) {
			List<String> jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"DONE", "DONE", "DONE", "NEW"}));
			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
			
			QuartzConfigUtil.deleteJob(context);
		}
    }  
}
