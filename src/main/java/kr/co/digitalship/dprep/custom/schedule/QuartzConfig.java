package kr.co.digitalship.dprep.custom.schedule;

import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.scheduling.quartz.SpringBeanJobFactory;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.schedule.job.Job0CacheDelete;
import kr.co.digitalship.dprep.custom.schedule.job.Job1Read;
import kr.co.digitalship.dprep.custom.schedule.job.Job1Read_Refactoring;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob1;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob1_Refactoring;
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;

@Configuration
@PropertySource(value = {
		"classpath:/org/talend/dataprep/configuration/default.properties",
		"classpath:default.properties",
		"classpath:application.properties",
		"default.properties",
		"application.properties"
}, ignoreResourceNotFound = true)
@ConditionalOnProperty(name = "schedule.job.enabled", havingValue = "true")
@EnableScheduling
public class QuartzConfig {
    //private final Logger logger = LoggerFactory.getLogger(this.getClass().getSimpleName());
	
	@Autowired
	private ApplicationContext applicationContext;

	@Autowired
	private Job0CacheDelete job0CacheDelete;	
	
	@Autowired
	private Job1Read_Refactoring job1Read;
	
	@Autowired
	private ListenerJob1_Refactoring listenerJob1;
	
	@Bean
	public SpringBeanJobFactory springBeanJobFactory () {
        AutowiringSpringBeanJobFactory jobFactory = new AutowiringSpringBeanJobFactory();
        jobFactory.setApplicationContext(applicationContext);

        return jobFactory;
	}	
	
	@Bean
	public SchedulerFactoryBean schedulerFactoryBean() {
        SchedulerFactoryBean schedulerFactoryBean = new SchedulerFactoryBean();        
        schedulerFactoryBean.setJobFactory(springBeanJobFactory());
        //schedulerFactoryBean.setTransactionManager(transactionManager);
        //schedulerFactoryBean.setDataSource(dataSource);
        schedulerFactoryBean.setOverwriteExistingJobs(true);
        //schedulerFactoryBean.setSchedulerName(innoQuartzProperties.getScheduler().getName());        
        schedulerFactoryBean.setAutoStartup(true);
        schedulerFactoryBean.setWaitForJobsToCompleteOnShutdown(true);
        //schedulerFactoryBean.setGlobalJobListeners(new QuartzJobListner());
        schedulerFactoryBean.setQuartzProperties(new PropertiesUtil().getProperties());
        
        return schedulerFactoryBean;
	}
	
	@Bean
	public Scheduler scheduler(SchedulerFactoryBean factory) throws SchedulerException {
	    Scheduler scheduler = factory.getScheduler();
	    
	    QuartzConfigUtil.scheduleJob(scheduler, job0CacheDelete, null, false);
		QuartzConfigUtil.scheduleJob(scheduler, job1Read, listenerJob1, true);

	    scheduler.start();
	    
		return scheduler;
	}
}
