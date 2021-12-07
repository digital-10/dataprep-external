package kr.co.digitalship.dprep.custom.schedule.job;

import java.io.File;
import java.util.List;

import javax.annotation.PostConstruct;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.PersistJobDataAfterExecution;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
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
		setGroup("ProfilingCacheDeleteBatch");
		setCronExp(cronExp);
	}

	@PostConstruct
	public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
		nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
		storeLocalPath = properties.getProperty("content-service.store.local.path");
		cronExp = properties.getProperty("schedule.job0.cronExp");

		setCronExp(cronExp);
	}		
	
	@Override
	public void executeInternal(JobExecutionContext context) throws JobExecutionException {
		boolean flag = true;
		try {
			List<JobExecutionContext> currentJobs = context.getScheduler().getCurrentlyExecutingJobs();
			for (JobExecutionContext jobCtx: currentJobs) {
				String name = jobCtx.getJobDetail().getKey().getName();
				String group = jobCtx.getJobDetail().getKey().getGroup();
				
				if("ProfilingBatch".equals(group) && "Job4Export".equals(name)) {
					flag = false;
				}
			}
		} catch (SchedulerException e) {
			e.printStackTrace();
		}
		
		// Job4Export 가 실행중인 경우는 처리하지 않을 수 있도록함.
		if(flag) {
			File dir = new File(storeLocalPath + "/cache");
			
			File[] files = dir.listFiles();
			for(File file : files) {
				file.delete();
			}			
		}
	}
}

