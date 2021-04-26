package kr.co.digitalship.dprep.custom.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.quartz.Scheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.JsonArray;

import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.job.Job1Read;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob1;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;

@RestController
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class SchedulingController {
	//public static boolean flagStop = false;
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;	
	
	@Autowired
	SchedulerFactoryBean factory;
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;	
	
	@Autowired
	private Job1Read job1Read;
	
	@Autowired
	private ListenerJob1 listenerJob1;
	
	@Autowired
	HadoopUtil hadoopUtil;
	
	// 노드가 여러개일때...실행에 대한 전파를 어떻게 할 것 인가...는 고민해 봐야 함...
	@RequestMapping(value = "/scheduling/add", method = GET, produces = APPLICATION_JSON_VALUE)
	public String start(@RequestParam(defaultValue = "", required = true) String wsId) throws Exception {
		Singleton singleton = Singleton.getInstance();		
		if(StringUtils.isNotBlank(wsId)) {
			singleton.addWsId(wsId);
		}
/*
		// redis 상태 체크...후에 진행할지...바로 return 할지...
		@SuppressWarnings("unchecked")
		List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
		if(null != jobStatusNode) {
			String[] nodeStatus = jobStatusNode.toArray(new String[jobStatusNode.size()]);
			
			// 여기 조건을 바꿔야함...
			if(!(("NEW".equals(nodeStatus[0]) && "NEW".equals(nodeStatus[1]) && "NEW".equals(nodeStatus[2]) && "NEW".equals(nodeStatus[3]))
		    || ("DONE".equals(nodeStatus[0]) && "DONE".equals(nodeStatus[1]) && "DONE".equals(nodeStatus[2]) && "DONE".equals(nodeStatus[3])))) {
				return "(Added) Current WsIds : " + singleton.getWsIds().toString();
			}
		}
		
		//SchedulingController.flagStop = false;

		Scheduler scheduler = factory.getScheduler();		
		QuartzConfigUtil.scheduleJob(scheduler, job1Read, listenerJob1, true);
		
		return "Schedule_Job1Read";
*/
		return "(Added) Current WsIds : " + singleton.getWsIds().toString();
	}

/*	
	// 임시 - Cycle 이 끝나거나 파일을 Export 전이라면 종료한다.
	@RequestMapping(value = "/scheduling/stop", method = GET, produces = APPLICATION_JSON_VALUE)
	public String stop() throws Exception {
		SchedulingController.flagStop = true;
		
		return "Schedule_Stop_Reservation";
	}
*/	
	@RequestMapping(value = "/test/connect/hadoop", method = GET, produces = APPLICATION_JSON_VALUE)
	public String testConnectHadoop() throws Exception {
		FileSystem fs = hadoopUtil.getFs();		
		fs.copyFromLocalFile(new Path("/home/profiling/dprep_Integration/DPrep/conf/quartz.properties"), new Path("/quartz.properties"));
		
		FSDataInputStream FSDataInputStream = fs.open(new Path("/quartz.properties"));		
		String content = IOUtils.toString(FSDataInputStream, "UTF-8");
		
		fs.delete(new Path("/quartz.properties"), false);
		
		fs.close();		
		
		return content;
	}

	@RequestMapping(value = "/test/connect/redis", method = GET, produces = APPLICATION_JSON_VALUE)
	public String testConnectRedis() throws Exception {
		String result = "Redis Connect Disable";
		springRedisTemplateUtil.valueSet("DshipConnectTest", "Redis Connect Enable");
		
		result = (String)springRedisTemplateUtil.valueGet("DshipConnectTest");
		springRedisTemplateUtil.delete("DshipConnectTest");
		
		return result;
	}	
/*
	// 노드가 여러개일때...실행에 대한 전파를 어떻게 할 것 인가...는 고민해 봐야 함...	
	@RequestMapping(value = "/scheduling/stop", method = GET, produces = APPLICATION_JSON_VALUE)
	public String stop() throws Exception {
		Scheduler scheduler = factory.getScheduler();
		
		// 고려되어야 할 것들이 만다...
		// 1. 원본이 이동된 경우 > 원본을 다시 넣어줘야 하나...
		// 2. Redis 상의 WS_ID 는 1Cycle 이 끝나 갱신 되었을 수 있으므로...다른 정보에 포함되어 있는지 봐야 할 것 같다...
		// 3. Dataset, PersistancePreparation 은 RUNNING 중에 만들어지고 정보는 다 만들어 진후 기록되기 때문에 각 단계가 RUNNING 인 경우 끝날때까지 기다려야 할지도...
		// 4. 3과 관련하여...RUNNING 중에 stop 이 들어오면...다음 스케줄러를 추가하지 못하게 하는 프로세스도 필요하겠다...
		// 5. 작업이 언제 끝날지 알 수 없기때문에...
		
		List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
		if(null != jobStatusNode) {
			// 하둡 파일 삭제
			// PersistancePreparation 삭제
			// Dataset 삭제
			// redis 정보 삭제
			
			// 분할 파일이 모두 Export 된 경우
			if("DONE".equals(jobStatusNode.get(3))) {
				
			}
			
			// PersistancePreparation 이 모두 생성되고 단일 파일이 모두 Export 된 경우
			if("DONE".equals(jobStatusNode.get(2))) {
				
			}
			
			// Dataset 이 모두 만들어진 경우
			if("DONE".equals(jobStatusNode.get(2))) {
				
			}
		}
		

		int size = QuartzConfigUtil.getJobSize();
		for(int i = 0; i < size; i++) {
			QuartzConfigUtil.deleteJob(scheduler);
		}		
		
		return "";
	}
	
	private void getJobInfo(Scheduler scheduler) throws Exception {
		for(String groupName: scheduler.getJobGroupNames()) {
			for(JobKey jobKey : scheduler.getJobKeys(GroupMatcher.jobGroupEquals(groupName))) {
				String jobName = jobKey.getName();
				String jobGroup = jobKey.getGroup();
				
				@SuppressWarnings("unchecked")
				List<Trigger> triggers = (List<Trigger>)scheduler.getTriggersOfJob(jobKey);
				Date nextFireTime = triggers.get(0).getNextFireTime();
				
				System.out.println("[jobName] : " + jobName + " [groupName] : " + jobGroup + " - " + nextFireTime);
			}
		}		
	}
*/	
}
