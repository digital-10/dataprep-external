package kr.co.digitalship.dprep.custom.schedule.vo;

import java.io.Serializable;
import java.util.List;

import org.talend.dataprep.api.dataset.statistics.SemanticDomain;

public class MetadataVO implements Serializable {
	private static final long serialVersionUID = 7514054309392285344L;
	
	private String headerNbLines;
	private String headers;
	private String delimiter;
	private String encoding;
	private List<String> columnsTypes;
	private List<String> columnsDomains;
	private List<List<SemanticDomain>> semanticDomains;
	
	public String getHeaderNbLines() {
		return headerNbLines;
	}
	public void setHeaderNbLines(String headerNbLines) {
		this.headerNbLines = headerNbLines;
	}
	public String getHeaders() {
		return headers;
	}
	public void setHeaders(String headers) {
		this.headers = headers;
	}
	public String getDelimiter() {
		return delimiter;
	}
	public void setDelimiter(String delimiter) {
		this.delimiter = delimiter;
	}
	public String getEncoding() {
		return encoding;
	}
	public void setEncoding(String encoding) {
		this.encoding = encoding;
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
}
