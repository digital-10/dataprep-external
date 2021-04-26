package kr.co.digitalship.dprep.custom.schedule.job.listener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

import javax.annotation.PostConstruct;

import org.quartz.CronScheduleBuilder;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.job.Job2Create;
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;

@Component
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class ListenerJob1 implements JobListener {
	private static final Logger LOGGER = LoggerFactory.getLogger(ListenerJob1.class);
	
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
	private Job2Create job2Create;
	
	@Autowired
	private ListenerJob2 listenerJob2;		
	
	public ListenerJob1() {
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
/*			
	        @SuppressWarnings({ "resource", "unchecked" })
			RedisTemplate<String, Object> redisTemplate = new AnnotationConfigApplicationContext(SpringRedisTemplate.class).getBean(RedisTemplate.class);
	        springRedisTemplateUtil = new SpringRedisTemplateUtil().setRedisTemplate(redisTemplate);
*/	        			
		}
	}
	
    @Override
    public String getName() {
        return getClass().getName();
    }

    @Override
    public void jobToBeExecuted(JobExecutionContext context) {
        // TODO Auto-generated method stub
        // JobDetail이 실행될 떄 스케줄러에의해서 호출되는 메서드
    	//JobKey jobKey = context.getJobDetail().getKey();
    	//System.out.println("QuartzJobListner - jobToBeExecuted :: " + jobKey);
    	
    	job1ToBeExecuted(context);
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
    	
    	job1WasExecuted(context, jobException);
    }
    
    /**
     * HadoopFileListReadJob 용
     * 각 JOB의 상태값을 처음으로 초기화 셋팅하거나, JOB 1이 실행가능한 상태인지 확인한다. 
     * @param context
     */
    @SuppressWarnings("unchecked")
	private void job1ToBeExecuted(JobExecutionContext context) {
 		boolean job1IsRunningPossible = true;
 		
		List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
		if(null == jobStatusNode) {
			jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"NEW", "NEW", "NEW", "NEW"}));
		} 
 		
 		if("NEW".equals(jobStatusNode.get(0))) {
 			jobStatusNode.set(nodeNo, "RUNNING"); 			
 			
 			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
 		}
 		else if("RUNNING".equals(jobStatusNode.get(0))) {
 			job1IsRunningPossible = false;
 		}
 		else if("DONE".equals(jobStatusNode.get(0))) {
 			job1IsRunningPossible = false;
 		} 		

        context.getJobDetail().getJobDataMap().put("job1IsRunningPossible", job1IsRunningPossible);
        context.getJobDetail().getJobDataMap().put("job1IsDonePossible", false);
    }
    
    /**
     * HadoopFileListReadJob 용
     * JOB 1 을 완료 상태로 변경.
     * @param context
     * @param jobException
     */
    @SuppressWarnings("unchecked")
	private void job1WasExecuted(JobExecutionContext context, JobExecutionException jobException) {
    	// 0번 Node 이외의 경우는 실제 작업이 없기 때문에 0번 노드의 상태를 확인하고 종료한다.
    	List<String> jobStatusNode0 = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + 0);
    	List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
    	
    	if(0 != nodeNo && !"DONE".equals(jobStatusNode.get(nodeNo))) {
    		if(!("DONE".equals(jobStatusNode0.get(0)) || "RESCHEDULE".equals(jobStatusNode0.get(0)))) {
        		do {
        			try {
    					Thread.sleep(dependenceWait);
    				} 
        			catch (InterruptedException e) {
    					e.printStackTrace();
    				}
        			jobStatusNode0 = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + 0);
        		}
        		while(!"DONE".equals(jobStatusNode0.get(0)));
        		
        		context.getJobDetail().getJobDataMap().put("job1IsDonePossible", true);     			
    		}
    	}
    	
		// 동작 시간 변경
		if("RESCHEDULE".equals(jobStatusNode0.get(0))) {
			LOGGER.info("QuartzJobListner - Job1 Reschedule");
			
			if(job1Reschedule) {
				Scheduler scheduler = context.getScheduler();
				Trigger oldTrigger = context.getTrigger();

				Trigger newTrigger = TriggerBuilder.newTrigger()
	        		                               .withIdentity(TriggerKey.triggerKey(oldTrigger.getKey().getName() + "_2", oldTrigger.getKey().getGroup()))
	        		                               .withSchedule(CronScheduleBuilder.cronSchedule(job1cronExp_2))
	        		                               .build();			
				
				try {
					scheduler.rescheduleJob(oldTrigger.getKey(), newTrigger);
				}
				catch (SchedulerException e) {
					e.printStackTrace();
				}				
			}
			
        	jobStatusNode.set(0, "NEW");
        	springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
		}    	
    	
		if(context.getJobDetail().getJobDataMap().getBoolean("job1IsDonePossible")) {
			jobStatusNode.set(0, "DONE");
			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
			
			LOGGER.info("QuartzJobListner - Job1 DONE");
			
			QuartzConfigUtil.scheduleJob(context, job2Create, listenerJob2);
			QuartzConfigUtil.deleteJob(context);
		}
    }
}
