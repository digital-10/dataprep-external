package kr.co.digitalship.dprep.custom.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;

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
	HadoopUtil hadoopUtil;
	
	@RequestMapping(value = "/scheduling/add", method = GET, produces = APPLICATION_JSON_VALUE)
	public String start(@RequestParam(defaultValue = "", required = true) String wsId) throws Exception {
		Singleton singleton = Singleton.getInstance();		
		if(StringUtils.isNotBlank(wsId)) {
			singleton.addWsId(wsId);
		}

		return "(Added) Current WsIds : " + singleton.getWsIds().toString();
	}

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
}
