package kr.co.digitalship.dprep.custom.schedule.job;

import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
import kr.co.digitalship.dprep.custom.schedule.vo.MetadataVO;
import kr.co.digitalship.dprep.custom.schedule.vo.CopyTargetPreparationInfoVO;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

@Component
@ConditionalOnProperty(name = "schedule.job.dataset.pattern", havingValue = "complex")
public class DatasetPatternComplex extends AbstractDatasetPattern {

	//@Value("${dataprep.node.count:0}")
	//private int nodeCount;	

	@Value("${dataprep.node.no:0}")
	private int nodeNo;
	
	@Value("${schedule.job.dependence.wait:0}")
	private int dependenceWait;
	
	@Autowired
	private DprepUtil dprepUtil;

	@Autowired	
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	private ReentrantLock reentrantLock;	

	@Autowired
	public DatasetPatternComplex(DprepUtil dprepUtil) {
		super(dprepUtil);
	}
	
	/**
	 * 할당 파일의 정보 + 메타 정보 
	 */
	@Override
	public List<ProcessingInfomationVO> getIncludeMetaData(List<ProcessingInfomationVO> listOfProcessingInfomationVO) {
		reentrantLock = new ReentrantLock();
		Gson gson = new Gson();
		
		for(int i = 0, iLen = listOfProcessingInfomationVO.size(); i < iLen; i++) {
        	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
        	if(!isPossibleLock) {
        		ProcessingInfomationVO processingInfomationVO = listOfProcessingInfomationVO.get(i);
        		List<String> datasetIds = processingInfomationVO.getDatasetIds();
        		
        		try {        		
	        		reentrantLock.lock();
	        		
	        		String datasetId = datasetIds.get(0); // 파일당 1개만.
	        		MetadataVO metadataVO = dprepUtil.getMetadata(datasetId, dependenceWait, true);
	        		processingInfomationVO.setMetadataVO(metadataVO);
	        		
					Thread.sleep(1000);
				} 
        		catch (InterruptedException e) {
					e.printStackTrace();
				}
        		finally {
        			reentrantLock.unlock();
        		}
        	}
		}
		springRedisTemplateUtil.valueSet("INCLUDE_META_INFO_" + nodeNo, gson.toJson(listOfProcessingInfomationVO));
		
		return listOfProcessingInfomationVO;
	}
	
	/**
	 * 할당 파일의 정보 + 메타 정보 + 복제 대상 preparation 정보 
	 */
	@Override
	public List<ProcessingInfomationVO> getIncludePreparationTargetInfo(List<ProcessingInfomationVO> listOfProcessingInfomationVO) {
		reentrantLock = new ReentrantLock();
		Gson gson = new Gson();
		
		List<String> targetPreparationIds = dprepUtil.getPersistentPreparationId();
		CopyTargetPreparationInfoVO copyTargetPreparationInfoVO = null;
		
		for(int i = 0, len = listOfProcessingInfomationVO.size(); i < len; i++) {
        	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
        	if(!isPossibleLock) {
        		ProcessingInfomationVO processingInfomationVO = listOfProcessingInfomationVO.get(i);
        		MetadataVO metadataVO = processingInfomationVO.getMetadataVO();
        		
        		try {	        		
	        		reentrantLock.lock();
	        		
	        		copyTargetPreparationInfoVO = dprepUtil.getMappingDP(targetPreparationIds, metadataVO, dependenceWait);
	        		processingInfomationVO.setCopyTargetPreparationInfoVO(copyTargetPreparationInfoVO);

					Thread.sleep(1000);
				} 
        		catch (InterruptedException e) {
					e.printStackTrace();
				}
        		finally {
        			reentrantLock.unlock();
        		}
        	}
		}
		
		springRedisTemplateUtil.valueSet("INCLUDE_PREPARATION_TARGET_INFO_" + nodeNo, gson.toJson(listOfProcessingInfomationVO));
		
		return listOfProcessingInfomationVO;
	}
}
