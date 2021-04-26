package kr.co.digitalship.dprep.custom.schedule.job;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.fs.FileSystem;
import org.apache.http.client.utils.DateUtils;
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

import kr.co.digitalship.dprep.custom.PcnApiUtil;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.CustomQuartzJobBean;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;

@Component
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class Job1Read extends CustomQuartzJobBean {
	private static final Logger LOGGER = LoggerFactory.getLogger(Job1Read.class);
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;	
	
	@Value("${hadoop.read.base.path:}")
    private String hadoopReadBasePath;
	
	@Value("${hadoop.result.reg.base.path:}")
	private String hadoopResultRegBasePath;
	
	@Value("${schedule.job1.cronExp:}")
	private String cronExp;
	
	@Autowired
	private HadoopUtil hadoopUtil;
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private PcnApiUtil pcnApiUtil;
	
	public Job1Read() {
		super();
		
		setJobName(this.getClass().getSimpleName());
		setTriggerName(this.getClass().getSimpleName().replace("Job", "Trigger"));
		setGroup("ProfilingBatch");
		setCronExp(cronExp);
		
		// TODO :: 실행주기의 조정 필요함		
		if(StringUtils.isBlank(cronExp)) {
			Properties properties = new PropertiesUtil().getProperties();
			
			nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
			hadoopReadBasePath = properties.getProperty("hadoop.read.base.path");
			hadoopResultRegBasePath = properties.getProperty("hadoop.result.reg.base.path");
			cronExp = properties.getProperty("schedule.job1.cronExp");

			setCronExp(cronExp);
		}
		
		setUseJobListener(true);
	}

	@Override
    @SuppressWarnings("unchecked")	
	public void executeInternal(JobExecutionContext context) throws JobExecutionException {
    	if(context.getJobDetail().getJobDataMap().getBoolean("job1IsRunningPossible") && 0 == nodeNo) {
    		// TODO :: PCN Api 를 통해 wsId 를 가져오는 부분이 필요하다. (오름차순 정렬로 wsId 값이 작은 것 부터 하나씩 처리) yyyyMMdd 를 대체하는게 좋을 것 같다.
    		String token = pcnApiUtil.getAuth();
    		String wsId = pcnApiUtil.getWsId(token);
    		
    		LOGGER.info("QuartzJobListner - Job1 BEGIN");    		
    		
    		springRedisTemplateUtil.valueSet("WS_ID", wsId);    		

    		if(StringUtils.isEmpty(wsId)) {
            	List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
            	jobStatusNode.set(0, "RESCHEDULE");
            	springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);    			
    		}
    		else {    		
        		String yyyyMMdd = DateUtils.formatDate(new Date(), "yyyyMMdd");
        		springRedisTemplateUtil.valueSet("DATE_OF_PROCESSING", yyyyMMdd);
		
        		// 기처리 목록을 제외하고 노드 수만큼 파일 목록을 나눈다.
        		FileSystem fs = hadoopUtil.getFs();
        		String strReadPath = hadoopReadBasePath + "/" + wsId;
        		List<List<String>> fileLists = hadoopUtil.getFileList(fs, strReadPath, null);
        		
        		if(null == fileLists || 0 == fileLists.size()) {
        			wsId = pcnApiUtil.getNextWsId(token);
        			
    	    		if(StringUtils.isBlank(wsId)) {
    	            	List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
    	            	jobStatusNode.set(0, "RESCHEDULE");
    	            	springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);    	    			
    	    		}
    	    		else {
                    	List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
                    	jobStatusNode.set(0, "NEW");
                    	springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);    	    			
    	    		}
        		}
        		else {
            		for(int i = 0, len = fileLists.size(); i < len; i++) {
                		springRedisTemplateUtil.valueSet("LIST_OF_FILES_TO_BE_PROCESSED_" + i, fileLists.get(i));    			
            		}
                    context.getJobDetail().getJobDataMap().put("job1IsDonePossible", true);            	
        		}
        		
                if(null != fs) {
    	            try { fs.close(); } catch (IOException e) {}
                }    			
    		}
    	}
	}
}

