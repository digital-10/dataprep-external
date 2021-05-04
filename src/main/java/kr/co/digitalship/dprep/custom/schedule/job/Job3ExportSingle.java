package kr.co.digitalship.dprep.custom.schedule.job;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.locks.ReentrantLock;

import org.apache.commons.lang.StringUtils;
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
import org.talend.dataprep.api.dataset.statistics.SemanticDomain;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.CustomQuartzJobBean;
import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

@Component
@PersistJobDataAfterExecution
@DisallowConcurrentExecution
@ConditionalOnBean(type = "kr.co.digitalship.dprep.custom.schedule.QuartzConfig")
public class Job3ExportSingle extends CustomQuartzJobBean {
	private static final Logger LOGGER = LoggerFactory.getLogger(Job3ExportSingle.class);

	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;
	
	//@Value("${kweather.preparation.replace_on_value.idx:-1}")
	//private int replaceOnValueIdx;
	
	//@Value("${kweather.preparation.replace_on_value.value:}")
	//private String replaceOnValueValue;
	
	@Value("${kweather.preparation.domain_change.idx:-1}")
	private int[] domainChangeIdx;
	
	@Value("${kweather.preparation.domain_change.value:}")
	private String[] domainChangeValue;

	@Value("${schedule.job3.cronExp:}")
	private String cronExp;		
	
	@Autowired	
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private AbstractDatasetPattern exportPattern;
	
	@Autowired
	private DprepUtil dprepUtil;
	
	private ReentrantLock reentrantLock;
	
	private final int jobStepIdx = 2;
	
	public Job3ExportSingle() {
		super();
		
		setJobName(this.getClass().getSimpleName());
		setTriggerName(this.getClass().getSimpleName().replace("Job", "Trigger"));
		setGroup("ProfilingBatch");
		setCronExp(cronExp);
		
		// TODO :: 실행주기의 조정 필요함		
		if(StringUtils.isBlank(cronExp)) {
			Properties properties = new PropertiesUtil().getProperties();
			
			nodeNo = Integer.parseInt(properties.getProperty("dataprep.node.no"));
			dependenceWait = Integer.parseInt(properties.getProperty("schedule.job.dependence.wait"));
			//replaceOnValueIdx = Integer.parseInt(properties.getProperty("kweather.preparation.replace_on_value.idx"));
			//replaceOnValueValue = properties.getProperty("preparation.replace_on_value.value");
			String[] domainChangeIdxTemp = properties.getProperty("kweather.preparation.domain_change.idx").trim().split("\\s*,\\s*");
			domainChangeIdx = new int[domainChangeIdxTemp.length];
			for(int i = 0, len = domainChangeIdx.length; i < len; i++) {
				domainChangeIdx[i] = Integer.parseInt(domainChangeIdxTemp[i]);
			}
			domainChangeValue = properties.getProperty("kweather.preparation.domain_change.value").trim().split("\\s*,\\s*");
			cronExp = properties.getProperty("schedule.job3.cronExp");

			setCronExp(cronExp);
		}
		
		setUseJobListener(true);
	}

	@Override	
	public void executeInternal(JobExecutionContext context) throws JobExecutionException {
    	if(context.getJobDetail().getJobDataMap().getBoolean("job3IsRunningPossible")) {
    		LOGGER.info(String.format("QuartzJobListner - Job3 BEGIN(%d)", nodeNo));
    		
    		@SuppressWarnings("unchecked")
			List<String> jobStatusNode = (List<String>)springRedisTemplateUtil.valueGet("JOB_STATUS_NODE_" + nodeNo);
 			jobStatusNode.set(jobStepIdx, "RUNNING");
 			springRedisTemplateUtil.valueSet("JOB_STATUS_NODE_" + nodeNo, jobStatusNode);        		
    		
    		// 1. job2에서 만든 dataset 중 하나를 확인 - 컬럼길이, 컬럼타입, 도메인 :: 컬럼타입과 도메인의 경우 70% 초과 일치하는 경우. ( 동일 데이터를 잘라서 올려도 다른 경우가 있다 )
			Gson gson = new Gson();
			String jsonStr = (String)springRedisTemplateUtil.valueGet("LIST_OF_DATASET_INFO_" + nodeNo);
			if(StringUtils.isNotEmpty(jsonStr)) {
				JsonArray datasetsInfo = new JsonParser().parse(jsonStr).getAsJsonArray();
				
				// 1. 해당 노드에 할당된 파일의 정보
				List<ProcessingInfomationVO> listOfDatasetInfo = gson.fromJson(datasetsInfo, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
				
				// 2. 할당 파일의 정보 + 메타 정보 
				listOfDatasetInfo = exportPattern.getIncludeMetaData(listOfDatasetInfo);

				// 3. 할당 파일의 정보 + 메타 정보 + 복제 대상 preparation 정보 
				listOfDatasetInfo = exportPattern.getIncludePreparationTargetInfo(listOfDatasetInfo);
				
				reentrantLock = new ReentrantLock();
				boolean flagInfoRewrite = false;
				for(int i = listOfDatasetInfo.size() - 1; i >= 0; i--) {
					ProcessingInfomationVO processingInfomationVO = listOfDatasetInfo.get(i);
					if(null == processingInfomationVO.getCopyTargetPreparationInfoVO()) {
						// 처리 대상에서 제외 (복제 대상 레시피가 없는 경우)
						List<String> datasetIds = processingInfomationVO.getDatasetIds();

				    	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
				    	if(!isPossibleLock) {
				    		try {
								reentrantLock.lock();
								
								dprepUtil.deleteDatasetById(datasetIds, dependenceWait);
								
								Thread.sleep(1000);
							} 
				    		catch (InterruptedException e) {
								e.printStackTrace();
							}
				    		finally {
				    			reentrantLock.unlock();
				    		}
				    	}
						
						listOfDatasetInfo.remove(i);
						flagInfoRewrite = true;
					}
				}
				
				// 4. 복제 대상 preparation 정보가 없는 대상 제거후 재저장. 
				if(flagInfoRewrite) {
					springRedisTemplateUtil.valueSet("INCLUDE_PREPARATION_TARGET_INFO_" + nodeNo, gson.toJson(listOfDatasetInfo));					
				}

				// 5. 4의 정보로 PersistancePreparation 복제
				List<ProcessingInfomationVO> listOfProcessingInfomationVO = null;
				if(null == listOfDatasetInfo || 0 == listOfDatasetInfo.size()) {
					// 종료
					context.getJobDetail().getJobDataMap().put("job3IsDoNotProceedAfter", true);
					exit();
					
					return;
				}
				else {
					listOfProcessingInfomationVO = exportPattern.copyPreparation(listOfDatasetInfo, dependenceWait);					
				}
				
				// 6. 컬럼 데이터 일부 정제 및 도메인 변경 k-weather
				for(int i = 0, len = listOfProcessingInfomationVO.size(); i < len; i++) {
			    	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
			    	if(!isPossibleLock) {
						ProcessingInfomationVO processingInfomationVO = listOfProcessingInfomationVO.get(i);
						
						List<String> preparationIds = processingInfomationVO.getPreparationIds();
						//String delimiter = processingInfomationVO.getMetadataVO().getDelimiter();
						String[] headers = processingInfomationVO.getMetadataVO().getHeaders().replace("[", "").replace("]", "").split(",");
						
						List<String> columnsDomains = processingInfomationVO.getCopyTargetPreparationInfoVO().getColumnsDomains();
						List<List<SemanticDomain>> semanticDomains = processingInfomationVO.getCopyTargetPreparationInfoVO().getSemanticDomains();

						// 이미 변경되어 있는 경우는 변경을 않기 위해...
						//if(-1 < replaceOnValueIdx) {
							try {
								reentrantLock.lock();
								
								JsonObject gsonObject = new JsonObject();
								JsonArray gsonArray = new JsonArray();
/*								
								if(StringUtils.isBlank(columnsDomains.get(replaceOnValueIdx))) {
									gsonArray.add(dprepUtil.getReplaceOnValue(replaceOnValueIdx, delimiter, headers[replaceOnValueIdx]));									
								}
*/								
								for(int j = 0, jLen = domainChangeIdx.length; j < jLen; j++) {
									List<SemanticDomain> semanticDomain = semanticDomains.get(domainChangeIdx[j]);
									
									for(int k = 0, kLen = semanticDomain.size(); k < kLen; k++) {
										SemanticDomain semanticDn = semanticDomain.get(k);
										if(domainChangeValue[j].equals(semanticDn.getId()) && !domainChangeValue[j].equals(columnsDomains.get(domainChangeIdx[j]))) {
											gsonArray.add(dprepUtil.getDomainChange(domainChangeIdx[j], headers[domainChangeIdx[j]], String.valueOf(semanticDn.getScore()), semanticDn.getId(), semanticDn.getLabel()));
											break;
										}
									}
								}
								gsonObject.add("actions", gsonArray);
								
								dprepUtil.executeAction(preparationIds, gsonObject);
								
								Thread.sleep(1000);
							} 
							catch (InterruptedException e) {
								e.printStackTrace();
							}
							finally {
								reentrantLock.unlock();
							}
						//}			    		
			    	}
				}

				// 7. 단일, 분할 파일의 분리
				List<ProcessingInfomationVO> exportSingle = new ArrayList<>();
				List<ProcessingInfomationVO> exportMulti = new ArrayList<>();
				
				if(null != listOfProcessingInfomationVO) {
					for(int i = 0, len = listOfProcessingInfomationVO.size(); i < len; i++) {
						ProcessingInfomationVO processingInfomationVO = listOfProcessingInfomationVO.get(i);
						if(1 < processingInfomationVO.getPreparationIds().size()) {
							exportMulti.add(processingInfomationVO);
						}
						else {
							exportSingle.add(processingInfomationVO);
						}
					}					
				}
				
				if(0 < exportMulti.size()) {
					springRedisTemplateUtil.valueSet("LIST_OF_EXPORT_MULTI_" + nodeNo, gson.toJson(exportMulti));
				}
				
				if(0 < exportSingle.size()) {
					// 4. Export
					exportPattern.export(exportSingle, dependenceWait);					
					
					springRedisTemplateUtil.valueSet("LIST_OF_EXPORT_SINGLE_" + nodeNo, gson.toJson(exportSingle));
				}
			}
			context.getJobDetail().getJobDataMap().put("job3IsDonePossible", true);
    	}
	}
	
	private void exit() {
		List<String> keys = new ArrayList<>();

		keys.add("INCLUDE_PREPARATION_TARGET_INFO_" + nodeNo);			
		keys.add("INCLUDE_META_INFO_" + nodeNo);
		keys.add("LIST_OF_DATASET_INFO_" + nodeNo);
		keys.add("LIST_OF_FILES_TO_BE_PROCESSED_" + nodeNo);
		
		springRedisTemplateUtil.delete(keys);		

		LOGGER.info(String.format("QuartzJobListner - Job3 Recipe Info Not Found(%d)", nodeNo));
	}
}
