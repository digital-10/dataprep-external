package kr.co.digitalship.dprep.custom.schedule.job.listener;

import java.util.ArrayList;
import java.util.Arrays;
//import java.util.Date;
import java.util.List;
//import java.util.Locale;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
//import org.apache.commons.lang.time.DateFormatUtils;
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

import kr.co.digitalship.dprep.custom.PcnApiUtil;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;

import org.quartz.TriggerListener;

@Component
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class ListenerTrigger1 implements TriggerListener {
	private static final Logger LOGGER = LoggerFactory.getLogger(ListenerTrigger1.class);
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;	

	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;	
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private PcnApiUtil pcnApiUtil;
	
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
 		
 		// 전체 Job 상태 정보에 대한 초기 셋팅
		@SuppressWarnings("unchecked")
		List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
		if(null == jobStatusNode) {
			jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"NEW", "NEW", "NEW", "NEW"}));
			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
		}

		if(!"NEW".equals(jobStatusNode.get(0))) {
			vetoExecution = true;
 		}
        
		if(0 == nodeNo) {
			String wsId = pcnApiUtil.getWsId(pcnApiUtil.getAuth());
			if(StringUtils.isEmpty(wsId)) {
				vetoExecution = true;
			}
			
			String redisWsId = (String)springRedisTemplateUtil.valueGet("WS_ID");
			if(!wsId.equals(redisWsId)) {
				springRedisTemplateUtil.valueSet("WS_ID", wsId);
			}
		}
		else {
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
	}
}
