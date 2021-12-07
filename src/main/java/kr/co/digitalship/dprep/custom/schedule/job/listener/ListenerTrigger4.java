package kr.co.digitalship.dprep.custom.schedule.job.listener;

import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.time.DateFormatUtils;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.Trigger;
import org.quartz.Trigger.CompletedExecutionInstruction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;

import org.quartz.TriggerListener;

@Component
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class ListenerTrigger4 implements TriggerListener {
	private static final Logger LOGGER = LoggerFactory.getLogger(ListenerTrigger4.class);
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;	

	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;	
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
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

	@Override
	public void triggerFired(Trigger trigger, JobExecutionContext context) {
		@SuppressWarnings("unchecked")
		List<String> jobRunningStartTime = (List<String>)springRedisTemplateUtil.valueGet("JOB_RUNNING_START_TIME_" + nodeNo);
		if(null != jobRunningStartTime) {
			jobRunningStartTime.set(3, DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS", Locale.KOREA));
			springRedisTemplateUtil.valueSet("JOB_RUNNING_START_TIME_" + nodeNo, jobRunningStartTime);			
		}
		
		LOGGER.debug("===============================================================================");
		LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " triggerFired (%d)", nodeNo));

		JobDataMap map = context.getJobDetail().getJobDataMap();

		if(map.containsKey("EXECUTION_COUNT")) {
			map.put("EXECUTION_COUNT", map.getInt("EXECUTION_COUNT") + 1);
		}
		else {
			map.put("EXECUTION_COUNT", 1);
		}
	}

	@Override
	public boolean vetoJobExecution(Trigger trigger, JobExecutionContext context) {
		LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " vetoJobExecution (%d)", nodeNo));
		
 		boolean vetoExecution = false;
 		
    	@SuppressWarnings("unchecked")
		List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
 		
		if(!"NEW".equals(jobStatusNode.get(3))) {
			vetoExecution = true;
 		}
		
		JobDataMap map = context.getJobDetail().getJobDataMap();
		if(1 < map.getInt("EXECUTION_COUNT")) {
			vetoExecution = true;
		}		
		
		return vetoExecution;
	}

	@Override
	public void triggerMisfired(Trigger trigger) {

	}

	@Override
	public void triggerComplete(Trigger trigger, JobExecutionContext context, CompletedExecutionInstruction triggerInstructionCode) {
		LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " triggerComplete (%d)", nodeNo));		
		LOGGER.debug("===============================================================================");
		
		@SuppressWarnings("unchecked")
		List<String> jobRunningEndTime = (List<String>)springRedisTemplateUtil.valueGet("JOB_RUNNING_END_TIME_" + nodeNo);
		if(null != jobRunningEndTime) {
			jobRunningEndTime.set(3, DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS", Locale.KOREA));
			springRedisTemplateUtil.valueSet("JOB_RUNNING_END_TIME_" + nodeNo, jobRunningEndTime);			
		}
	}
}
