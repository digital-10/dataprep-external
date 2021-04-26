package kr.co.digitalship.dprep.custom.schedule.util;

import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobKey;
import org.quartz.JobListener;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.quartz.impl.matchers.KeyMatcher;

import kr.co.digitalship.dprep.custom.schedule.CustomQuartzJobBean;

public class QuartzConfigUtil {
	private static final Queue<JobKey> queue = new ConcurrentLinkedQueue<>();
	
    /**
     * JobDetail :: QuartzJob에 필요한 데이터를 저장하기 위해서는 getJobDataMap()을 통해 데이터를 등록해야 한다.
     */
	public static JobDetail createJobDetail(CustomQuartzJobBean job) {
        JobDetail jobDetail = JobBuilder.newJob(job.getClass())
                                        .withIdentity(JobKey.jobKey(job.getJobName(), job.getGroup()))
                                        .build();
        
        if(null != job.getJobDataMap()) {
        	jobDetail.getJobDataMap().putAll(job.getJobDataMap());
        }
        
        return jobDetail;
    }
    
    /**
     * Trigger
     */
    public static Trigger createCronTrigger(CustomQuartzJobBean job) {
        return TriggerBuilder.newTrigger()
        		             .withIdentity(TriggerKey.triggerKey(job.getTriggerName(), job.getGroup()))
        		             .startNow()
        		             .withSchedule(CronScheduleBuilder.cronSchedule(job.getCronExp()))
        		             .build();
    }
    
    public static void scheduleJob(JobExecutionContext context, CustomQuartzJobBean customQuartzJobBean, JobListener jobListener) {
	    Scheduler scheduler = context.getScheduler();
	    
	    QuartzConfigUtil.scheduleJob(scheduler, customQuartzJobBean, jobListener, true);
    }
    
    public static void scheduleJob(Scheduler scheduler, CustomQuartzJobBean customQuartzJobBean, JobListener jobListener, boolean addQueue) {
	    try {
	    	if(null == scheduler.getJobDetail(customQuartzJobBean.getJobKey())) {
	    		JobDetail jobDetail = QuartzConfigUtil.createJobDetail(customQuartzJobBean);
	    		Trigger trigger = QuartzConfigUtil.createCronTrigger(customQuartzJobBean);
	    		
				scheduler.scheduleJob(jobDetail, trigger);
				
				if(null != customQuartzJobBean && customQuartzJobBean.isUseJobListener()) {
					scheduler.getListenerManager().addJobListener(jobListener, KeyMatcher.keyEquals(customQuartzJobBean.getJobKey()));				
				}
				
				if(addQueue) {
					queue.add(customQuartzJobBean.getJobKey());
				}    		
	    	}
		}
	    catch (SchedulerException e) {
			e.printStackTrace();
		}	    	
    }
    
    public static void deleteJob(JobExecutionContext context) {
	    Scheduler scheduler = context.getScheduler();
	    
	    deleteJob(scheduler);    	
    }
    
    public static void deleteJob(Scheduler scheduler) {
	    try {
	    	JobKey jobKey = QuartzConfigUtil.getKey();
	    	if(null != jobKey) {
				scheduler.deleteJob(jobKey);
	    	}
		}
	    catch (SchedulerException e) {
			e.printStackTrace();
		}    	
    }    
    
    private static JobKey getKey() {
    	if(0 < queue.size()) {
        	return queue.poll();
    	}
    	return null;
    }
    
    public static int getJobSize() {
    	return queue.size();
    }
}
