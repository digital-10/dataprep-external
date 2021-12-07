package kr.co.digitalship.dprep.custom.schedule.job;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
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
import org.talend.dataprep.api.dataset.DataSetMetadata;
import org.talend.dataprep.api.dataset.RowMetadata;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.CustomQuartzJobBean;
import kr.co.digitalship.dprep.custom.schedule.util.BackgroundAnalysisCustom;
import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

@Component
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class Job4Export extends CustomQuartzJobBean {
	private static final Logger LOGGER = LoggerFactory.getLogger(Job4Export.class);

	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;
	
    @Value("${transformation.service.url:}")
    private String[] transformationServiceUrl; 
    
	@Value("${schedule.job4.cronExp:}")
	private String cronExp;
	
	@Value("${hadoop.result.reg.base.path:}")
	private String hadoopResultRegBasePath;	
	
	@Autowired	
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private AbstractDatasetPattern exportPattern;
	
	@Autowired
	private BackgroundAnalysisCustom backgroundAnalysisCustom;
	
	@Autowired
	private HadoopUtil hadoopUtil;
	
    @Autowired
    private ObjectMapper mapper;	
    
	@Autowired
	private DprepUtil dprepUtil;    
	
	public Job4Export() {
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
		
		nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
		dependenceWait = Integer.parseInt(properties.getProperty("schedule.job.dependence.wait"));
		transformationServiceUrl = properties.getProperty("transformation.service.url").trim().split("\\s*,\\s*");
		cronExp = properties.getProperty("schedule.job4.cronExp");
		hadoopResultRegBasePath = properties.getProperty("hadoop.result.reg.base.path");

		setCronExp(cronExp);
	}

	@Override
	public void executeInternal(JobExecutionContext context) throws JobExecutionException {
		LOGGER.debug(String.format(context.getJobDetail().getKey().getName() + " executeInternal (%d)", nodeNo));
    		
		List<String> jobStatusNode = new ArrayList<String>(Arrays.asList(new String[]{"DONE", "DONE", "DONE", "RUNNING"}));
		springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);
		
		Gson gson = new Gson();
		String jsonStr = (String)springRedisTemplateUtil.valueGet("LIST_OF_EXPORT_" + nodeNo);
		if(StringUtils.isNotBlank(jsonStr)) {
			JsonArray gsonArrayExport = new JsonParser().parse(jsonStr).getAsJsonArray();
			//jsonStr = null; // 빠른 반환을 위해 null 처리함
			
			List<ProcessingInfomationVO> exportList = gson.fromJson(gsonArrayExport, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
			//gsonArrayExport = null; // 빠른 반환을 위해 null 처리함 
			
			if(0 < exportList.size()) {
				exportPattern.export(exportList, dependenceWait);
				//exportList = null; // 빠른 반환을 위해 null 처리함
				this.makeMetadata(exportList);
			}
		}
		context.getJobDetail().getJobDataMap().put("job4IsDonePossible", true);
	}
	
	// 파일단위로 최종 metadata 생성 출력
	private void makeMetadata(List<ProcessingInfomationVO> exportList) {
		for(int i = 0, len = exportList.size(); i < len; i++) {
			ProcessingInfomationVO processingInfomationVO = exportList.get(i);
			
        	String filePath = processingInfomationVO.getFilePath();
        	String name = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.lastIndexOf("."));
        	String datasetId = processingInfomationVO.getDatasetIds().get(0);
        	String preparationId = processingInfomationVO.getPreparationIds().get(0);
        	
        	RowMetadata rowMetadata = dprepUtil.getStepRowMetadata(preparationId);
        	
            String wsId = (String)springRedisTemplateUtil.valueGet("WS_ID");
            
        	filePath = String.format("/kWeather/DSHIP/Complete/Csv/%s/%s.csv", wsId, name);
            
    		DataSetMetadata dataSetMetadata = backgroundAnalysisCustom.analyze(datasetId, filePath, rowMetadata);
    		dataSetMetadata.setId(datasetId);
    		dataSetMetadata.setName(name);

    		FileSystem fs = hadoopUtil.getFs();
    		try {
    			hadoopUtil.write(fs, mapper.writeValueAsString(dataSetMetadata), hadoopResultRegBasePath, wsId, String.format("%s_after_metadata.json", name));
    		} 
    		catch (JsonProcessingException e) {
    			e.printStackTrace();
    		}
            finally {
                if(null != fs) {
                    try { fs.close(); } catch (IOException e) {}                                
                }
            }            		
		}
	}
}
