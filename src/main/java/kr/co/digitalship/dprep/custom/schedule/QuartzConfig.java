package kr.co.digitalship.dprep.custom.schedule;

import javax.annotation.PostConstruct;

import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.scheduling.quartz.SpringBeanJobFactory;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.schedule.job.Job0CacheDelete;
import kr.co.digitalship.dprep.custom.schedule.job.Job0StatusMonitor;
import kr.co.digitalship.dprep.custom.schedule.job.Job1Read;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob1;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerTrigger1;
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
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Autowired
	private ApplicationContext applicationContext;

	@Autowired
	private Job0CacheDelete job0CacheDelete;
	
	@Autowired
	private Job0StatusMonitor job0StatusMonitor;	
	
	@Autowired
	private Job1Read job1Read;
	
	@Autowired
	private ListenerJob1 listenerJob1;
	
	@Autowired
	private ListenerTrigger1 listenerTrigger1;
	
	@PostConstruct
	public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
		nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
	}		
	
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
	    
	    QuartzConfigUtil.scheduleJob(scheduler, job0CacheDelete, null, null);
	    if(0 == nodeNo) {
	    	QuartzConfigUtil.scheduleJob(scheduler, job0StatusMonitor, null, null);
	    	QuartzConfigUtil.scheduleJob(scheduler, job1Read, listenerJob1, listenerTrigger1);	    	
	    }		
	    scheduler.start();
	    
		return scheduler;
	}
}
