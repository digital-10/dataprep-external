package kr.co.digitalship.dprep.custom.schedule.job;

import java.util.List;

import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

public interface DatasetPattern {
	/**
	 * @param listOfProcessingInfomationVO : 해당 노드에 할당된 파일의 정보
	 * @return
	 */
	public List<ProcessingInfomationVO> getIncludeMetaData(List<ProcessingInfomationVO> listOfProcessingInfomationVO);
	
	/**
	 * @param listOfToBeProcessedMetadataVO : 해당 노드에 할당된 파일의 Dataset 메타 정보
	 * @return
	 */
	public List<ProcessingInfomationVO> getIncludePreparationTargetInfo(List<ProcessingInfomationVO> listOfProcessingInfomationVO);
	
	/**
	 * @param listOfProcessingInfomationVO : 해당 노드에 할당된 파일의 정보
	 * @param listOfCopyTargetPreparationInfoVO : 해당 노드에 할당된 파일의 Dataset 의 메타와 일치하는 Preparation 의 기본 정보  
	 * @return
	 */
	public List<ProcessingInfomationVO> copyPreparation(List<ProcessingInfomationVO> listOfProcessingInfomationVO);
	
	/**
	 * @param listOfProcessingInfomationVO : 해당 노드에 할당된 파일의 정보
	 * @param listOfCopyTargetPreparationInfoVO : 해당 노드에 할당된 파일의 Dataset 의 메타와 일치하는 Preparation 의 기본 정보
	 * @param listOfMetadataVO : 해당 노드에 할당된 파일의 Dataset 메타 정보
	 * @param dependenceWait
	 */
	public void exportSingle(List<ProcessingInfomationVO> listOfProcessingInfomationVO, int dependenceWait);
	
	/**
	 * @param listOfProcessingInfomationVO : 해당 노드에 할당된 파일의 정보
	 * @param listOfCopyTargetPreparationInfoVO : 해당 노드에 할당된 파일의 Dataset 의 메타와 일치하는 Preparation 의 기본 정보
	 * @param listOfMetadataVO : 해당 노드에 할당된 파일의 Dataset 메타 정보
	 * @param dependenceWait
	 */	
	public void exportMulti(List<ProcessingInfomationVO> listOfProcessingInfomationVO, int dependenceWait);
}
