package kr.co.digitalship.dprep.custom.schedule.vo;

import java.io.Serializable;

public class SplitExportFileStatusVO implements Serializable {
	private static final long serialVersionUID = -4470138576956249063L;
	
	private String filePath;
	private String fileName;
	private int splitCount = -1;
	private int completedCount = -1;
	
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public int getSplitCount() {
		return splitCount;
	}
	public void setSplitCount(int splitCount) {
		this.splitCount = splitCount;
	}
	public int getCompletedCount() {
		return completedCount;
	}
	public void setCompletedCount(int completedCount) {
		this.completedCount = completedCount;
	}
}
