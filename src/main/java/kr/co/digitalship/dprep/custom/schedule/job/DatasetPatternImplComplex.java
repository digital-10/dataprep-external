package kr.co.digitalship.dprep.custom.schedule.job;

import java.util.ArrayList;
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
import kr.co.digitalship.dprep.custom.schedule.vo.SplitExportFileStatusVO;

@Component
@ConditionalOnProperty(name = "schedule.job.dataset.pattern", havingValue = "complex")
public class DatasetPatternImplComplex implements DatasetPattern {

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
	
	/**
	 * PersistancePreparation 복제
	 */
	@Override
	public List<ProcessingInfomationVO> copyPreparation(List<ProcessingInfomationVO> listOfProcessingInfomationVO) {
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
	 * 4. Export
	 */
	@Override
	public void exportSingle(List<ProcessingInfomationVO> listOfProcessingInfomationVO, int dependenceWait) {
		for(int i = 0, len = listOfProcessingInfomationVO.size(); i < len; i++) {
        	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
        	if(!isPossibleLock) {
        		ProcessingInfomationVO processingInfomationVO = listOfProcessingInfomationVO.get(i);
        		MetadataVO metadataVO = processingInfomationVO.getMetadataVO();
        		
				try {
            		reentrantLock.lock();
            		
					dprepUtil.exportSingle(processingInfomationVO, metadataVO, dependenceWait); // export
					
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
	
	/**
	 * 4. Export
	 */
	@Override
	public void exportMulti(List<ProcessingInfomationVO> listOfProcessingInfomationVO, int dependenceWait) {
		reentrantLock = new ReentrantLock();

		// 분할
		SplitExportFileStatusVO splitExportFileStatusVO = null;
		for(int i = 0, len = listOfProcessingInfomationVO.size(); i < len; i++) {
			ProcessingInfomationVO processingInfomationVO = listOfProcessingInfomationVO.get(i);
			MetadataVO metadataVO = processingInfomationVO.getMetadataVO();
			
			// 0 번 노드가 분할 파일의 첫부분을 가지고 있다.
			//if(0 == nodeNo) {
				splitExportFileStatusVO = new SplitExportFileStatusVO();
				splitExportFileStatusVO.setFilePath(processingInfomationVO.getFilePath());
				splitExportFileStatusVO.setFileName(processingInfomationVO.getFileNames().get(0));
							
				String splitCount = processingInfomationVO.getDatasetIds().get(0).split("-")[4].substring(3, 6); // 20200807-sJob-0000-0000-003004000001
				splitExportFileStatusVO.setSplitCount(Integer.parseInt(splitCount));
				
				// CURRENT_EXPORT_MULTI_FILE
				SplitExportFileStatusVO tempSplitExportFileStatusVO = (SplitExportFileStatusVO)springRedisTemplateUtil.valueGet("CURRENT_EXPORT_MULTI_FILE_" + nodeNo);
				if(null == tempSplitExportFileStatusVO) {
					springRedisTemplateUtil.valueSet("CURRENT_EXPORT_MULTI_FILE_" + nodeNo, splitExportFileStatusVO);					
				}
				else {
					// SplitCount 와 CompletedCount 가 같다면 이전 파일의 Export가 끝난 것.
					while(tempSplitExportFileStatusVO.getSplitCount() != tempSplitExportFileStatusVO.getCompletedCount()) {
						try {
							Thread.sleep(1000);
						} 
						catch (InterruptedException e) {
							e.printStackTrace();
						}
						tempSplitExportFileStatusVO = (SplitExportFileStatusVO)springRedisTemplateUtil.valueGet("CURRENT_EXPORT_MULTI_FILE_" + nodeNo);
					}
					springRedisTemplateUtil.valueSet("CURRENT_EXPORT_MULTI_FILE_" + nodeNo, splitExportFileStatusVO);
				}
			//}
			
			List<String> preparationIds = processingInfomationVO.getPreparationIds();
			List<String> datasetIds = processingInfomationVO.getDatasetIds();

			for(int j = 0, jLen = preparationIds.size(); j < jLen; j++) {
				splitExportFileStatusVO = (SplitExportFileStatusVO)springRedisTemplateUtil.valueGet("CURRENT_EXPORT_MULTI_FILE_" + nodeNo);
				int curCount = Integer.parseInt(datasetIds.get(j).split("-")[4].substring(0, 3)); // 0부터 시작이라 +1을 해줌 20200807-sJob-0000-0003-000004000001				
/*				
				boolean flagExport = false;
				
				// 단일 노드
				if(1 == nodeCount) {
					flagExport = true;
				}
				// 분할된 파일의 첫 부분인 0 번 노드의 첫번째 부분				
				else if(0 == j && 0 == nodeNo) {
					flagExport = true;
				}
				else {
					while(splitExportFileStatusVO.getCompletedCount() != curCount) {
						try {
							Thread.sleep(1000);
						} 
						catch (InterruptedException e) {
							e.printStackTrace();
						}
						splitExportFileStatusVO = (SplitExportFileStatusVO)springRedisTemplateUtil.valueGet("CURRENT_EXPORT_MULTI_FILE_" + nodeNo);
						curCount = Integer.parseInt(datasetIds.get(j).split("-")[4].substring(0, 3));
					}
					flagExport = true;
				}
				
				if(flagExport) {
*/				
                	boolean isPossibleLock = reentrantLock.isLocked(); // Lock을 걸 수 있는지 확인
                	if(!isPossibleLock) {
						try {			                		
	                		reentrantLock.lock();
	                		
							String datasetId = processingInfomationVO.getDatasetIds().get(j);
							String preparationId = processingInfomationVO.getPreparationIds().get(j);
							//boolean flagFirst = j == 0 ? true : false;
							boolean flagEnd = j == jLen - 1 ? true : false;

							dprepUtil.exportMulti(datasetId, preparationId, splitExportFileStatusVO.getFilePath(), splitExportFileStatusVO.getFileName(), metadataVO, dependenceWait, j, flagEnd);

							Thread.sleep(1000);
							
							splitExportFileStatusVO.setCompletedCount(curCount + 1);
							springRedisTemplateUtil.valueSet("CURRENT_EXPORT_MULTI_FILE_" + nodeNo, splitExportFileStatusVO);
						} 
						catch (InterruptedException e) {
							e.printStackTrace();
						}
						finally {
							reentrantLock.unlock();
						}
                	}
//				}
			}
		}
	}	
}
