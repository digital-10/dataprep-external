package kr.co.digitalship.dprep.custom.schedule.job;

import java.io.File;
import java.util.Properties;

import org.apache.commons.lang.StringUtils;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.PersistJobDataAfterExecution;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.schedule.CustomQuartzJobBean;

@Component
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class Job0CacheDelete extends CustomQuartzJobBean {
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;	
	
	@Value("${content-service.store.local.path:}")
    private String storeLocalPath;
	
	@Value("${schedule.job0.cronExp:}")
	private String cronExp;	
	
	public Job0CacheDelete() {
		super();
		
		setJobName(this.getClass().getSimpleName());
		setTriggerName(this.getClass().getSimpleName().replace("Job", "Trigger"));
		setGroup("ProfilingBatch");
		setCronExp(cronExp);
		
		// TODO :: 실행주기의 조정 필요함		
		if(StringUtils.isBlank(cronExp)) {
			Properties properties = new PropertiesUtil().getProperties();
			
			nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
			storeLocalPath = properties.getProperty("content-service.store.local.path");
			cronExp = properties.getProperty("schedule.job0.cronExp");

			setCronExp(cronExp);
		}

		setUseJobListener(false);
	}

	@Override
	public void executeInternal(JobExecutionContext context) throws JobExecutionException {
		File dir = new File(storeLocalPath + "/cache");
		
		File[] files = dir.listFiles();
		for(File file : files) {
			file.delete();
		}
	}
}

