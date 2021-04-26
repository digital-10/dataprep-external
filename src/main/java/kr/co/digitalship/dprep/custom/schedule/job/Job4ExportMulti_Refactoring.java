package kr.co.digitalship.dprep.custom.schedule.job;

import java.util.List;
import java.util.Properties;

import org.apache.commons.lang.StringUtils;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.PersistJobDataAfterExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.CustomQuartzJobBean;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

@Component
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class Job4ExportMulti_Refactoring extends CustomQuartzJobBean {
	private static final Logger LOGGER = LoggerFactory.getLogger(Job4ExportMulti_Refactoring.class);

	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;
	
    @Value("${dataprep.node.export.hosts:}")
    private String[] exportHosts;
    
	@Value("${schedule.job4.cronExp:}")
	private String cronExp;	    
	
	@Autowired	
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private DatasetPattern exportPattern;
	
	private final int jobStepIdx = 3;	
	
	public Job4ExportMulti_Refactoring() {
		super();
		
		setJobName(this.getClass().getSimpleName());
		setTriggerName(this.getClass().getSimpleName().replace("Job", "Trigger"));
		setGroup("ProfilingBatch");
		setCronExp(cronExp);
		
		// TODO :: 실행주기의 조정 필요함		
		if(StringUtils.isBlank(cronExp)) {
			Properties properties = new PropertiesUtil().getProperties();
			
			nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
			dependenceWait = Integer.parseInt(properties.getProperty("schedule.job.dependence.wait"));
			exportHosts = properties.getProperty("dataprep.node.export.hosts").trim().split("\\s*,\\s*");
			cronExp = properties.getProperty("schedule.job4.cronExp");

			setCronExp(cronExp);
		}
		
		setUseJobListener(true);
	}

	@Override
	public void executeInternal(JobExecutionContext context) throws JobExecutionException {
    	if(context.getJobDetail().getJobDataMap().getBoolean("job4IsRunningPossible")) {
    		LOGGER.info(String.format("QuartzJobListner - Job4 BEGIN(%d)", nodeNo));
    		
    		@SuppressWarnings("unchecked")
			List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
 			jobStatusNode.set(jobStepIdx, "RUNNING");
 			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
    		
			Gson gson = new Gson();
			String jsonStr = (String)springRedisTemplateUtil.valueGet("LIST_OF_EXPORT_MULTI_" + nodeNo);
			if(StringUtils.isNotBlank(jsonStr)) {
				JsonArray gsonArrayExportMulti = new JsonParser().parse(jsonStr).getAsJsonArray();
				
				List<ProcessingInfomationVO> exportMulti = gson.fromJson(gsonArrayExportMulti, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
				
				if(0 < exportMulti.size()) {
					exportPattern.exportMulti(exportMulti, dependenceWait);
					
					springRedisTemplateUtil.valueSet("LIST_OF_EXPORT_MULTI_" + nodeNo, gson.toJson(exportMulti));
				}
			}
			context.getJobDetail().getJobDataMap().put("job4IsDonePossible", true);
    	}
	}
}
