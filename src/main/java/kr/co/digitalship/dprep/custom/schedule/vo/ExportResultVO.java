package kr.co.digitalship.dprep.custom.schedule.vo;

import java.io.Serializable;

public class ExportResultVO  implements Serializable {
	private static final long serialVersionUID = 73986129651182518L;
	
	private String filePath;
	private int lineCnt;
	
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public int getLineCnt() {
		return lineCnt;
	}
	public void setLineCnt(int lineCnt) {
		this.lineCnt = lineCnt;
	}
	
	@Override
	public String toString() {
		return "ExportResultVO [filePath=" + filePath + ", lineCnt=" + lineCnt + "]";
	}
}
