package kr.co.digitalship.dprep.custom.schedule.job;

import java.util.List;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
import kr.co.digitalship.dprep.custom.schedule.vo.MetadataVO;
import kr.co.digitalship.dprep.custom.schedule.vo.CopyTargetPreparationInfoVO;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

@Component
@ConditionalOnProperty(name = "schedule.job.dataset.pattern", havingValue = "single")
public class DatasetPatternSingle extends AbstractDatasetPattern {

	@Value("${dataprep.node.count:0}")
	private int nodeCount;	
	
	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;
	
	@Autowired
	private DprepUtil dprepUtil;

	@Autowired	
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	public DatasetPatternSingle(DprepUtil dprepUtil) {
		super(dprepUtil);
	}	
	
	/**
	 * 할당 파일의 정보 + 메타 정보 
	 */
	@Override
	public List<ProcessingInfomationVO> getIncludeMetaData(List<ProcessingInfomationVO> listOfProcessingInfomationVO) {
		Gson gson = new Gson();
		
		if(0 == nodeNo) {
			String sampleDatasetId = listOfProcessingInfomationVO.get(0).getDatasetIds().get(0);
			MetadataVO metadataVO = dprepUtil.getMetadata(sampleDatasetId, dependenceWait, true);
			
			for(int i = 0, len = listOfProcessingInfomationVO.size(); i < len; i++) {
				listOfProcessingInfomationVO.get(i).setMetadataVO((MetadataVO)SerializationUtils.clone(metadataVO));
			}
			springRedisTemplateUtil.valueSet("INCLUDE_META_INFO_0", gson.toJson(listOfProcessingInfomationVO));
			
			for(int i = 1, len = nodeCount; i < len; i++) {
				String jsonStr = (String)springRedisTemplateUtil.valueGet("LIST_OF_DATASET_INFO_" + i);
				
				if(StringUtils.isNotBlank(jsonStr)) {
					JsonArray datasetsInfo = new JsonParser().parse(jsonStr).getAsJsonArray();
					
					// 해당 노드에 할당된 파일의 정보
					List<ProcessingInfomationVO> listOfDatasetInfo = gson.fromJson(datasetsInfo, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
					
					for(int j = 0, jLen = listOfDatasetInfo.size(); j < jLen; j++) {
						listOfDatasetInfo.get(j).setMetadataVO((MetadataVO)SerializationUtils.clone(metadataVO));
					}
					
					springRedisTemplateUtil.valueSet("INCLUDE_META_INFO_" + i, gson.toJson(listOfDatasetInfo));
	            }
			}	
		}
		else {
			String jsonStr = (String)springRedisTemplateUtil.valueGet("INCLUDE_META_INFO_" + nodeNo);
			if(StringUtils.isNotBlank(jsonStr)) {
				JsonArray datasetsInfo = new JsonParser().parse(jsonStr).getAsJsonArray();
				listOfProcessingInfomationVO = gson.fromJson(datasetsInfo, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
            }
			
			while(null == listOfProcessingInfomationVO || null == jsonStr) {
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				
				jsonStr = (String)springRedisTemplateUtil.valueGet("INCLUDE_META_INFO_" + nodeNo);
				if(StringUtils.isNotBlank(jsonStr)) {
					JsonArray datasetsInfo = new JsonParser().parse(jsonStr).getAsJsonArray();
					listOfProcessingInfomationVO = gson.fromJson(datasetsInfo, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
	            }						
			}				
		}
		
		return listOfProcessingInfomationVO;
	}
	
	/**
	 * 할당 파일의 정보 + 메타 정보 + 복제 대상 preparation 정보 
	 */
	@Override
	public List<ProcessingInfomationVO> getIncludePreparationTargetInfo(List<ProcessingInfomationVO> listOfProcessingInfomationVO) {
		Gson gson = new Gson();
		
		if(0 == nodeNo) {
			// 수정일로 내림차순된 기생성 preparation 아이디 
			List<String> targetPreparationIds = dprepUtil.getPersistentPreparationId();
			ProcessingInfomationVO processingInfomationVO = listOfProcessingInfomationVO.get(0);
			MetadataVO metaDataVO = processingInfomationVO.getMetadataVO();
			
			CopyTargetPreparationInfoVO copyTargetPreparationInfoVO = dprepUtil.getMappingDP(targetPreparationIds, metaDataVO, dependenceWait);
			
			for(int i = 0, len = listOfProcessingInfomationVO.size(); i < len; i++) {
				listOfProcessingInfomationVO.get(i).setCopyTargetPreparationInfoVO((CopyTargetPreparationInfoVO)SerializationUtils.clone(copyTargetPreparationInfoVO));
			}
			
			springRedisTemplateUtil.valueSet("INCLUDE_PREPARATION_TARGET_INFO_0", gson.toJson(listOfProcessingInfomationVO));
			
			for(int i = 1, len = nodeCount; i < len; i++) {
				String jsonStr = (String)springRedisTemplateUtil.valueGet("INCLUDE_META_INFO_" + i);
				
				if(StringUtils.isNotBlank(jsonStr)) {
					JsonArray datasetsInfo = new JsonParser().parse(jsonStr).getAsJsonArray();
					
					// 해당 노드에 할당된 파일의 정보
					List<ProcessingInfomationVO> listOfDatasetInfo = gson.fromJson(datasetsInfo, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
					
					for(int j = 0, jLen = listOfDatasetInfo.size(); j < jLen; j++) {
						listOfDatasetInfo.get(j).setCopyTargetPreparationInfoVO((CopyTargetPreparationInfoVO)SerializationUtils.clone(copyTargetPreparationInfoVO));
					}
					
					springRedisTemplateUtil.valueSet("INCLUDE_META_INFO_" + i, gson.toJson(listOfDatasetInfo));
	            }
			}			
		}
		else {
			String jsonStr = (String)springRedisTemplateUtil.valueGet("INCLUDE_PREPARATION_TARGET_INFO_" + nodeNo);
			if(StringUtils.isNotBlank(jsonStr)) {
				JsonArray datasetsInfo = new JsonParser().parse(jsonStr).getAsJsonArray();
				listOfProcessingInfomationVO = gson.fromJson(datasetsInfo, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
            }			
			
			while(null == listOfProcessingInfomationVO || StringUtils.isBlank(jsonStr)) {
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				
				jsonStr = (String)springRedisTemplateUtil.valueGet("INCLUDE_PREPARATION_TARGET_INFO_" + nodeNo);
				if(StringUtils.isNotBlank(jsonStr)) {
					JsonArray datasetsInfo = new JsonParser().parse(jsonStr).getAsJsonArray();
					listOfProcessingInfomationVO = gson.fromJson(datasetsInfo, new TypeToken<List<ProcessingInfomationVO>>() {}.getType());
	            }
			}
		}
		
		return listOfProcessingInfomationVO;
	}
}
