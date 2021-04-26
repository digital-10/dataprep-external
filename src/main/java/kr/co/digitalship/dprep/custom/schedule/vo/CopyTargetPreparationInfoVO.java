package kr.co.digitalship.dprep.custom.schedule.vo;

import java.io.Serializable;
import java.util.List;

import org.talend.dataprep.api.dataset.statistics.SemanticDomain;

/**
 * preparation 복사 대상에 필요한 복사 대상의 정보
 */
public class CopyTargetPreparationInfoVO implements Serializable {
	private static final long serialVersionUID = 3448016616094148035L;
	
	private String preparationId;
	private String headId;
	private String datasetId;
	private List<String> steps;
	private List<String> columnsTypes;
	private List<String> columnsDomains;
	private List<List<SemanticDomain>> semanticDomains;

	public String getPreparationId() {
		return preparationId;
	}
	public void setPreparationId(String preparationId) {
		this.preparationId = preparationId;
	}
	public String getHeadId() {
		return headId;
	}
	public void setHeadId(String headId) {
		this.headId = headId;
	}
	public String getDatasetId() {
		return datasetId;
	}
	public void setDatasetId(String datasetId) {
		this.datasetId = datasetId;
	}
	public List<String> getSteps() {
		return steps;
	}
	public void setSteps(List<String> steps) {
		this.steps = steps;
	}
	public List<String> getColumnsTypes() {
		return columnsTypes;
	}
	public void setColumnsTypes(List<String> columnsTypes) {
		this.columnsTypes = columnsTypes;
	}
	public List<String> getColumnsDomains() {
		return columnsDomains;
	}
	public void setColumnsDomains(List<String> columnsDomains) {
		this.columnsDomains = columnsDomains;
	}
	public List<List<SemanticDomain>> getSemanticDomains() {
		return semanticDomains;
	}
	public void setSemanticDomains(List<List<SemanticDomain>> semanticDomains) {
		this.semanticDomains = semanticDomains;
	}
	@Override
	public String toString() {
		return "CopyTargetPreparationInfoVO [preparationId=" + preparationId + ", headId=" + headId + ", datasetId="
				+ datasetId + ", steps=" + steps + ", columnsTypes=" + columnsTypes + ", columnsDomains="
				+ columnsDomains + ", semanticDomains=" + semanticDomains + "]";
	}
}
