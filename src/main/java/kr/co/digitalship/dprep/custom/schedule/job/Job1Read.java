package kr.co.digitalship.dprep.custom.schedule.job;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.hadoop.fs.FileSystem;
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
import kr.co.digitalship.dprep.custom.Singleton;
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
	
    @Value("${dataset.service.url:}")
    private String[] datasetServiceUrl; 
	
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
		setUseJobListener(true);
		setUseTriggerListener(true);
	}
	
	@PostConstruct
	public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
		hadoopReadBasePath = properties.getProperty("hadoop.read.base.path");
		hadoopResultRegBasePath = properties.getProperty("hadoop.result.reg.base.path");
		cronExp = properties.getProperty("schedule.job1.cronExp");
		datasetServiceUrl = properties.getProperty("dataset.service.url").trim().split("\\s*,\\s*");

		setCronExp(cronExp);
	}		

	@Override
	public void executeInternal(JobExecutionContext context) throws JobExecutionException {		
		LOGGER.debug(context.getJobDetail().getKey().getName() + " executeInternal (0)");
		
		// 기처리 목록을 제외하고 노드 수만큼 파일 목록을 나눈다.
		FileSystem fs = hadoopUtil.getFs();
		try {
			String wsId = (String)springRedisTemplateUtil.valueGet("WS_ID");
			String strReadPath = hadoopReadBasePath + "/" + wsId;
			
			// 노드별로 나뉜 파일 목록
			//List<List<String>> fileLists = hadoopUtil.getFileList(fs, strReadPath, null);
			List<String> fileLists = hadoopUtil.getFileList(fs, strReadPath);
			if(null == fileLists || 0 == fileLists.size()) {
				pcnApiUtil.getNextWsId(pcnApiUtil.getAuth()); //
			}
			else {
				@SuppressWarnings("unchecked")
				List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_0");
	 			jobStatusNode.set(0, "RUNNING");
	 			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_0", jobStatusNode);
				
	 			// 설정된 노드 정보중 실제 사용 가능한 노드의 확인
	 			String[] nodeLiveChk = new String[datasetServiceUrl.length];
	 			nodeLiveChk[0] = "ON";
	 			
	 			int nodeCount = 1;
	 			for(int i = 1, len = datasetServiceUrl.length; i < len; i++) {
	 				String[] remoteHostInfo = datasetServiceUrl[i].replace("http://", "").split(":");
	 				
	 				Socket socket = null;
	 				try {
	 					socket = new Socket();
	 					SocketAddress addr = new InetSocketAddress(remoteHostInfo[0], Integer.parseInt(remoteHostInfo[1]));
	 					socket.connect(addr, 1000);

	 					nodeCount += 1;
	 					nodeLiveChk[i] = "ON";
	 				} 
	 				catch (Exception e) {
	 					nodeLiveChk[i] = "OFF ";
	 				}
	 				finally {
	 					try { if(null != socket) socket.close(); } catch (IOException e) {}
	 				}	 				
	 			}

				BigDecimal totRow = new BigDecimal(fileLists.size());
				BigDecimal eachCnt = totRow.divide(new BigDecimal(nodeCount), 0,  BigDecimal.ROUND_UP);

				//int realNodeCount = 0;
				for(int i = 0; i < nodeCount; i++) {
					int fromIndex = i * eachCnt.intValue();
					int toIndex = (i + 1) * eachCnt.intValue();

					if(totRow.intValue() <= fromIndex) {
						break;
					}
					else if(totRow.intValue() < toIndex) {
						toIndex = totRow.intValue();
					}
					springRedisTemplateUtil.valueSet("LIST_OF_FILES_TO_BE_PROCESSED_" + i, new ArrayList<String>(fileLists.subList(fromIndex, toIndex)));
					
					//realNodeCount += 1;
				}					
	
	    		//context.getJobDetail().getJobDataMap().put("realNodeCount", realNodeCount);
	            context.getJobDetail().getJobDataMap().put("job1IsDonePossible", true);
	            context.getJobDetail().getJobDataMap().put("nodeLiveChk", nodeLiveChk);
			}
		}
		catch(Exception e) {
			
		}
		finally {
			try { if(null != fs) fs.close(); } catch (IOException e) {}
		}
	}
}

