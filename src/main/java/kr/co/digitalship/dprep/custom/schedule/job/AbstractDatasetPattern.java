package kr.co.digitalship.dprep.custom.schedule.job;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
import kr.co.digitalship.dprep.custom.schedule.vo.CopyTargetPreparationInfoVO;
import kr.co.digitalship.dprep.custom.schedule.vo.MetadataVO;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

public abstract class AbstractDatasetPattern implements DatasetPatternImpl {
	private DprepUtil dprepUtil;
	
	private ReentrantLock reentrantLock;
	
	public AbstractDatasetPattern(DprepUtil dprepUtil) {
		this.dprepUtil = dprepUtil;
	}

	/**
	 * PersistancePreparation 복제
	 */
	@Override
	public List<ProcessingInfomationVO> copyPreparation(List<ProcessingInfomationVO> listOfProcessingInfomationVO, int dependenceWait) {
		// 3. 2의 정보로 PersistancePreparation 복제
		reentrantLock = new ReentrantLock();
		
		for(int i = 0, iLen = listOfProcessingInfomationVO.size(); i < iLen; i++) {
			ProcessingInfomationVO processingInfomationVO = listOfProcessingInfomationVO.get(i);
			
			List<String> fileNames = processingInfomationVO.getFileNames();
			List<String> datasetIds = processingInfomationVO.getDatasetIds();
			CopyTargetPreparationInfoVO copyTargetPreparationInfoVO = processingInfomationVO.getCopyTargetPreparationInfoVO();
			
			List<String> preparationIds = new ArrayList<>();
			
			for(int j = 0, jLen = datasetIds.size(); j < jLen; j++) {
            	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
            	if(!isPossibleLock) {
					try {
                		reentrantLock.lock();
                		
						String fileName = fileNames.get(j);
						String datasetId = datasetIds.get(j);
						
						String preparationId = dprepUtil.copyPersistentPreparation(copyTargetPreparationInfoVO.getPreparationId(), datasetId, fileName, dependenceWait);
						
						if(null != preparationId) {
							preparationIds.add(preparationId);
						}
						
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
			processingInfomationVO.setPreparationIds(preparationIds);
		}
		return listOfProcessingInfomationVO;
	}

	/**
	 * Export
	 */
	@Override
	public void export(List<ProcessingInfomationVO> listOfProcessingInfomationVO, int dependenceWait) {
		// TODO Auto-generated method stub
		reentrantLock = new ReentrantLock();

		// 분할
		for(int i = 0, len = listOfProcessingInfomationVO.size(); i < len; i++) {
        	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
        	if(!isPossibleLock) {
    			ProcessingInfomationVO processingInfomationVO = listOfProcessingInfomationVO.get(i);
    			MetadataVO metadataVO = processingInfomationVO.getMetadataVO();
    			
				try {			                		
            		reentrantLock.lock();

					dprepUtil.exportMulti(processingInfomationVO, metadataVO, dependenceWait);

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
	}
}
