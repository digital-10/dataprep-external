package kr.co.digitalship.dprep.custom.schedule.vo;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

public class ProcessingInfomationVO implements Serializable {
	private static final long serialVersionUID = -3044374592496257825L;
	
	private String filePath;
	private String fileEncoding;	
	private List<String> fileNames;
	private List<String> datasetIds;
	private List<String> preparationIds;
	private MetadataVO metadataVO;
	private CopyTargetPreparationInfoVO copyTargetPreparationInfoVO;
	private int lineCnt;
	private List<BigDecimal> runningTimes;
	
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getFileEncoding() {
		return fileEncoding;
	}
	public void setFileEncoding(String fileEncoding) {
		this.fileEncoding = fileEncoding;
	}
	public List<String> getFileNames() {
		return fileNames;
	}
	public void setFileNames(List<String> fileNames) {
		this.fileNames = fileNames;
	}
	public List<String> getDatasetIds() {
		return datasetIds;
	}
	public void setDatasetIds(List<String> datasetIds) {
		this.datasetIds = datasetIds;
	}
	public List<String> getPreparationIds() {
		return preparationIds;
	}
	public void setPreparationIds(List<String> preparationIds) {
		this.preparationIds = preparationIds;
	}
	public MetadataVO getMetadataVO() {
		return metadataVO;
	}
	public void setMetadataVO(MetadataVO metadataVO) {
		this.metadataVO = metadataVO;
	}
	public CopyTargetPreparationInfoVO getCopyTargetPreparationInfoVO() {
		return copyTargetPreparationInfoVO;
	}
	public void setCopyTargetPreparationInfoVO(CopyTargetPreparationInfoVO copyTargetPreparationInfoVO) {
		this.copyTargetPreparationInfoVO = copyTargetPreparationInfoVO;
	}
	public int getLineCnt() {
		return lineCnt;
	}
	public void setLineCnt(int lineCnt) {
		this.lineCnt = lineCnt;
	}
	public List<BigDecimal> getRunningTimes() {
		return runningTimes;
	}
	public void setRunningTimes(List<BigDecimal> runningTimes) {
		this.runningTimes = runningTimes;
	}
	
	@Override
	public String toString() {
		return "ProcessingInfomationVO [filePath=" + filePath + ", fileEncoding=" + fileEncoding + ", fileNames="
				+ fileNames + ", datasetIds=" + datasetIds + ", preparationIds=" + preparationIds + ", metadataVO="
				+ metadataVO + ", copyTargetPreparationInfoVO=" + copyTargetPreparationInfoVO + ", lineCnt=" + lineCnt
				+ ", runningTimes=" + runningTimes + "]";
	}
}
	
