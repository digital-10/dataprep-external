package kr.co.digitalship.dprep.custom.schedule.job.listener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.job.Job2CreateDataset;
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

//	@Value("${schedule.job1.reschedule:}")
//	private boolean job1Reschedule;	
	
//	@Value("${schedule.job1_2.cronExp:}")
//	private String job1cronExp_2;
	
    @Value("${dataset.service.url:}")
    private String[] datasetServiceUrl; 
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;	
	
	@Autowired
	private Job2CreateDataset job2CreateDataset;
	
	@Autowired
	private ListenerJob2 listenerJob2;
	
	@Autowired
	private ListenerTrigger2 listenerTrigger2;
	
	@PostConstruct
	public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
		nodeCount = Integer.parseInt(properties.getProperty("dataprep.node.count"));
		nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
		dependenceWait = Integer.parseInt(properties.getProperty("schedule.job.dependence.wait"));
//		job1Reschedule = Boolean.parseBoolean(properties.getProperty("schedule.job1.reschedule"));
//		job1cronExp_2 = properties.getProperty("schedule.job1_2.cronExp");
		datasetServiceUrl = properties.getProperty("dataset.service.url").trim().split("\\s*,\\s*");
	}
	
    @Override
    public String getName() {
        return getClass().getSimpleName();
    }

    /**
     * JobDetail이 실행될 떄 스케줄러에의해서 호출되는 메서드
     * Job 상태 정보 초기 셋팅 및 실행 여부 판단
     * 
     * @param context
     */    
    @Override
    public void jobToBeExecuted(JobExecutionContext context) {
    	LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " jobToBeExecuted (%d)", nodeNo));

		// DATE_OF_PROCESSING 대한 결정과 이전값과 다른 경우에 Redis에 저장
		String yyyyMMdd1 = (String)springRedisTemplateUtil.valueGet("DATE_OF_PROCESSING");
		String yyyyMMdd2 = DateFormatUtils.format(new Date(), "yyyyMMdd", Locale.KOREA);
		if(StringUtils.isNotEmpty(yyyyMMdd1)) {
    		if(!yyyyMMdd2.equals(yyyyMMdd1)) {
    			springRedisTemplateUtil.valueSet("DATE_OF_PROCESSING", yyyyMMdd2);
    		}
		}
		else {
			springRedisTemplateUtil.valueSet("DATE_OF_PROCESSING", yyyyMMdd2);
		}
		
        context.getJobDetail().getJobDataMap().put("job1IsDonePossible", false); // Job 종료 가능여부
    }

    @Override
    public void jobExecutionVetoed(JobExecutionContext context) {
    	LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " jobExecutionVetoed (%d)", nodeNo));
    }

    /**
     * Job 실행이 완료된 후 호출되는 메서드
     * Job 의 종료 및 후속 실행 Job 셋팅
     * 
     * @param context
     * @param jobException
     */    
	@Override
    public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {
		LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " jobWasExecuted (%d)", nodeNo));
		
		if(context.getJobDetail().getJobDataMap().getBoolean("job1IsDonePossible")) {
			/*
			int realNodeCount = context.getJobDetail().getJobDataMap().getInt("realNodeCount");
			
			for(int i = nodeCount - 1; i >= 0; i--) {
				List<String> jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"DONE", "NEW", "NEW", "NEW"}));
				if(realNodeCount <= i) {
					jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"END", "END", "END", "END"}));
					springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + i, jobStatusNode);
					
					continue;
				}
				springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + i, jobStatusNode);
				
				if(0 == i) {
					QuartzConfigUtil.deleteJob(context);
					QuartzConfigUtil.scheduleJob(context, job2CreateDataset, listenerJob2, listenerTrigger2);
				}
				// 개별 노드 Async Call - 개별노드의 Scheduler 에 job2CreateDataset 를 추가한다.
				else {
        			QuartzConfigUtil.addJobToNode(datasetServiceUrl[i], "job2CreateDataset");
				}
			}
			*/
			String[] nodeLiveChk = (String[])context.getJobDetail().getJobDataMap().get("nodeLiveChk");
			
			for(int i = nodeLiveChk.length - 1; i >= 0; i--) {
				List<String> jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"DONE", "NEW", "NEW", "NEW"}));
				if("OFF".equals(nodeLiveChk[i])) {
					jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"END", "END", "END", "END"}));
					springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + i, jobStatusNode);
					
					continue;
				}
				springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + i, jobStatusNode);
				
				if(0 == i) {
					QuartzConfigUtil.deleteJob(context);
					QuartzConfigUtil.scheduleJob(context, job2CreateDataset, listenerJob2, listenerTrigger2);
				}
				// 개별 노드 Async Call - 개별노드의 Scheduler 에 job2CreateDataset 를 추가한다.
				else {
        			QuartzConfigUtil.addJobToNode(datasetServiceUrl[i], "job2CreateDataset");
				}
			}
		}
    }
}
