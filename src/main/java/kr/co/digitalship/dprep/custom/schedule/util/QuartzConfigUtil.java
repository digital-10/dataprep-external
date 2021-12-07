package kr.co.digitalship.dprep.custom.schedule.util;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.http.client.utils.URIBuilder;

//import java.util.Queue;
//import java.util.concurrent.ConcurrentLinkedQueue;

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
import org.quartz.TriggerListener;
import org.quartz.impl.matchers.KeyMatcher;

import kr.co.digitalship.dprep.custom.DprepHttpUtil;
import kr.co.digitalship.dprep.custom.schedule.CustomQuartzJobBean;

public class QuartzConfigUtil {
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
        		             //.startNow()
        		             .withSchedule(CronScheduleBuilder.cronSchedule(job.getCronExp()))
        		             .build();
    }
    
    /**
     * Schedule 에 Job 추가
     * @param context
     * @param customQuartzJobBean
     * @param jobListener
     * @param triggerListener
     */
    public static void scheduleJob(JobExecutionContext context, CustomQuartzJobBean customQuartzJobBean, JobListener jobListener, TriggerListener triggerListener) {
	    QuartzConfigUtil.scheduleJob(context.getScheduler(), customQuartzJobBean, jobListener, triggerListener);
    }       
   
    /**
     * Schedule 에 Job 추가
     * @param scheduler
     * @param customQuartzJobBean
     * @param jobListener
     * @param triggerListener
     */
    public static void scheduleJob(Scheduler scheduler, CustomQuartzJobBean customQuartzJobBean, JobListener jobListener, TriggerListener triggerListener) {
	    try {
	    	if(null == scheduler.getJobDetail(customQuartzJobBean.getJobKey())) {
	    		JobDetail jobDetail = QuartzConfigUtil.createJobDetail(customQuartzJobBean);
	    		Trigger trigger = QuartzConfigUtil.createCronTrigger(customQuartzJobBean);
	    		
				scheduler.scheduleJob(jobDetail, trigger);
				
				//if(null != customQuartzJobBean && customQuartzJobBean.isUseJobListener()) {
				if(customQuartzJobBean.isUseJobListener()) {
					scheduler.getListenerManager().addJobListener(jobListener, KeyMatcher.keyEquals(customQuartzJobBean.getJobKey()));				
				}
				
				//if(null != customQuartzJobBean && customQuartzJobBean.isUseTriggerListener()) {
				if(customQuartzJobBean.isUseTriggerListener()) {
					scheduler.getListenerManager().addTriggerListener(triggerListener, KeyMatcher.keyEquals(customQuartzJobBean.getTriggerKey()));
				}				    		
	    	}
		}
	    catch (SchedulerException e) {
			e.printStackTrace();
		}	    	
    }
    
    /**
     * Schedule 에 Job 삭제
     * @param scheduler
     * @param customQuartzJobBean
     * @param jobListener
     * @param triggerListener
     */    
    public static void deleteJob(JobExecutionContext context) {
	    //Scheduler scheduler = context.getScheduler();
	    
	    try {
	    	//JobKey jobKey = QuartzConfigUtil.getKey();
	    	JobKey jobKey = context.getJobDetail().getKey();
	    	if(null != jobKey) {
				//scheduler.deleteJob(jobKey);
	    		context.getScheduler().deleteJob(jobKey);
	    	}
		}
	    catch (SchedulerException e) {
			e.printStackTrace();
		}    	
    }
    
    /**
     * 개별 노드에 Job 을 추가하기 위한 Rest Api 호출
     * @param host
     * @param jobName
     */
    public static void addJobToNode(String host, String jobName) {
    	DprepHttpUtil dprepHttpUtil = new DprepHttpUtil().init();
    	
		Map<String, String> param = new HashMap<>();        			
		param.put("path", "/scheduling/addJobToNode");
		param.put("jobName", jobName);
    	
		try {
			URIBuilder uriBuilder = new URIBuilder(host);
			
			Iterator<String> keys = param.keySet().iterator();
			while(keys.hasNext()) {
				String key = keys.next();
				
				if("path".equals(key)) {
					uriBuilder.setPath(param.get(key));
				}
				else {
					uriBuilder.addParameter(key, param.get(key));
				}
			}
			
			dprepHttpUtil.callAsyncCommon(uriBuilder, "GET", "text/plain", null);
		}
		catch (URISyntaxException e) {
			e.printStackTrace();
		}     	
    }
}
