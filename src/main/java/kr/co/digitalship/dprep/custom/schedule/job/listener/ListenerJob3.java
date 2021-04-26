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
import kr.co.digitalship.dprep.custom.schedule.job.Job4ExportMulti;
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;

@Component
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class ListenerJob3 implements JobListener {
	private static final Logger LOGGER = LoggerFactory.getLogger(ListenerJob3.class);
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private Job4ExportMulti job4ExportMulti;
	
	@Autowired
	private ListenerJob4 listenerJob4;			
	
	public ListenerJob3() {
		init();
	}
	
	@PostConstruct
	public void init() {
		if(0 == dependenceWait) {
			Properties properties = new PropertiesUtil().getProperties();
			
			nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
			dependenceWait = Integer.parseInt(properties.getProperty("schedule.job.dependence.wait"));
/*			
	        @SuppressWarnings({ "resource", "unchecked" })
			RedisTemplate<String, Object> redisTemplate = new AnnotationConfigApplicationContext(SpringRedisTemplate.class).getBean(RedisTemplate.class);
	        springRedisTemplateUtil = new SpringRedisTemplateUtil().setRedisTemplate(redisTemplate);
*/	        			
		}
	}	
	
    @Override
    public String getName() {
        // TODO Auto-generated method stub
        return getClass().getName();
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {
        // TODO Auto-generated method stub
        //JobDetail이 실행될 떄 스케줄러에의해서 호출되는 메서드
    	//JobKey jobKey = context.getJobDetail().getKey();
    	//System.out.println("QuartzJobListner - jobToBeExecuted :: " + jobKey);
    	
     	job3ToBeExecuted(context);
    }

    @Override
    public void jobExecutionVetoed(JobExecutionContext context) {
        // TODO Auto-generated method stub
        // JobDetail이 실행횔 때 TriggerListener가 실행
    	//JobKey jobKey = context.getJobDetail().getKey();
    	//System.out.println("QuartzJobListner - jobExecutionVetoed :: " + jobKey);
    }

    @Override
    public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {
        // TODO Auto-generated method stub
        // Job 실행이 완료된 후 호출되는 메서드, JOB 실행후 처리할 로직을 여기에 구현
    	//JobKey jobKey = context.getJobDetail().getKey();
    	//System.out.println("QuartzJobListner - jobWasExecuted :: " + jobKey);
    	
    	job3WasExecuted(context, jobException);    	
    }
    
    /**
     * HadoopFileListReadJob 용
     * 각 JOB의 상태값을 처음으로 초기화 셋팅하거나, JOB 1이 실행가능한 상태인지 확인한다. 
     * @param context
     */
    @SuppressWarnings("unchecked")
	private void job3ToBeExecuted(JobExecutionContext context) {
    	boolean job3IsRunningPossible = true;
        
    	List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
 		
 		// job1Status 이 없으면 아직 작업이 시작되지 않은 것이므로 기다린다...
 		if(null == jobStatusNode) {
    		do {
    			try {
					Thread.sleep(dependenceWait);
				} 
    			catch (InterruptedException e) {
					e.printStackTrace();
				}
    			jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
    		}
    		while(null == jobStatusNode);
 		}
        
 		// job1, job2 가 끝났을때 시작
 		if("DONE".equals(jobStatusNode.get(0)) && "DONE".equals(jobStatusNode.get(1))) {
 	 		if("NEW".equals(jobStatusNode.get(2))) {
 	 			if(0 != nodeNo) {
 	 				List<String> jobStatusNode0 = null;
 	 	    		do {
 	 	    			try {
 	 						Thread.sleep(dependenceWait);
 	 					} 
 	 	    			catch (InterruptedException e) {
 	 						e.printStackTrace();
 	 					}
 	 	    			jobStatusNode0 = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_0");
 	 	    		}
 	 	    		while(!"RUNNING".equals(jobStatusNode0.get(2)));
 	 			}
 	 			
 	 			jobStatusNode.set(2, "RUNNING");
 	 			
 	 			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
 	 		}
 	 		else if("RUNNING".equals(jobStatusNode.get(2))) {
 	 			job3IsRunningPossible = false;
 	 		} 	 		
 	 		else if("DONE".equals(jobStatusNode.get(2))) {
 	 			job3IsRunningPossible = false;
 	 		} 	 		
 		}
 		else {
 			job3IsRunningPossible = false;
 		}

        context.getJobDetail().getJobDataMap().put("job3IsRunningPossible", job3IsRunningPossible);
        context.getJobDetail().getJobDataMap().put("job3IsDonePossible", false);    		
    }

    /**
     * HadoopFileListReadJob 용
     * JOB 1 을 완료 상태로 변경하고, JOB 1 을 해제한다.
     * @param context
     * @param jobException
     */
    @SuppressWarnings("unchecked")
	private void job3WasExecuted(JobExecutionContext context, JobExecutionException jobException) {
		if(context.getJobDetail().getJobDataMap().getBoolean("job3IsDonePossible")) {
			List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
			jobStatusNode.set(2, "DONE");
			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
			
			LOGGER.info("QuartzJobListner - Job3 DONE");
			
			QuartzConfigUtil.scheduleJob(context, job4ExportMulti, listenerJob4);
			QuartzConfigUtil.deleteJob(context);			
		}
    }    
}
