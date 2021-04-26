package kr.co.digitalship.dprep.custom.schedule.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;
import java.util.zip.GZIPInputStream;

import javax.annotation.PostConstruct;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import kr.co.digitalship.dprep.custom.PropertiesUtil;

@Component
public class DprepMetaUtil {
    @Value("${preparation.store.file.location:}")
    private String preparationsLocation;
	
	@PostConstruct
	public DprepMetaUtil init() {
		if(StringUtils.isEmpty(preparationsLocation)) {
			Properties properties = new PropertiesUtil().getProperties();
			
			preparationsLocation = properties.getProperty("preparation.store.file.location");			
		}
		return this;
	}
	
	/**
	 * 최종 Step Id 반환 
	 * @param preparationId
	 * @return
	 */
	public String getHeadId(String preparationId) {
		File filePersistentPreparation = new File(preparationsLocation + "/PersistentPreparation-" + preparationId);		
		JsonObject gsonObjectPersistentPreparationContent = readGzipFile(filePersistentPreparation);
		if(null != gsonObjectPersistentPreparationContent) {
			return gsonObjectPersistentPreparationContent.get("headId").getAsString();
		}
		return "";
	}
	
	/**
	 * Step Id 에 해당하는 Action의 Id 와 Metadata의 Id 반환 
	 * content (Action) : JsonObject.get("content").getAsString()
	 * rowMetadata (Metadata) : JsonObject.get("rowMetadata").getAsString()
	 * @param headId
	 * @return
	 */
	public JsonObject getStepInfo(String headId) {
		File filePersistentStep = new File(preparationsLocation + "/PersistentStep-" + headId);
		JsonObject gsonObjectPersistentStepContent = readGzipFile(filePersistentStep);
		if(null != gsonObjectPersistentStepContent) {
			return gsonObjectPersistentStepContent;
		}
		return null;
	}
	
	/**
	 * Action 의 정보 
	 * @param content
	 * @return
	 */
	public JsonArray getActionsInfo(String content) {
		File filePreparationActions = new File(preparationsLocation + "/PreparationActions-" + content);
		JsonObject gsonObjectPreparationActions = readGzipFile(filePreparationActions);
		if(null != gsonObjectPreparationActions) {
			return gsonObjectPreparationActions.get("actions").getAsJsonArray();
		}
		return null;
	}
	
	/**
	 * Actions 정보와 도메인 정보등의 매칭을 위해 사용
	 * @param rowMetadataId
	 * @return
	 */	
	public JsonArray getMetadata(String rowMetadataId) {
		File fileStepRowMetadata = new File(preparationsLocation + "/StepRowMetadata-" + rowMetadataId);
		
		JsonObject gsonObjectStepRowMetadata = readGzipFile(fileStepRowMetadata);
		if(null != gsonObjectStepRowMetadata) {
			return gsonObjectStepRowMetadata.get("rowMetadata").getAsJsonObject().get("columns").getAsJsonArray();
		}
		return null;
	}
	
	/**
	 * 컬럼별 메타 정보 통합
	 * 4개 정보 통합에서 제외                       
	 * 분산(variance),                 
	 * 중앙값(quantiles.median)         
	 * 하위분위수(quantiles.lowerQuantile)
	 * 상위분위수(quantiles.upperQuantile)
	 * 
	 * @param listGsonArrayMetadata
	 * @return
	 */
/*	
	public JsonArray mergeMetadata(List<JsonArray> listGsonArrayMetadata) {
		JsonArray gsonArrayMergeMetadata = new JsonArray();
		for(int i = 0, len = listGsonArrayMetadata.size(); i < len; i++) {
			if(0 == i) {
				gsonArrayMergeMetadata.addAll(listGsonArrayMetadata.get(0).deepCopy());
			}
			else {
				JsonArray gsonArrayMetadataColumns = listGsonArrayMetadata.get(i);
				
				for(int j = 0, jLen = gsonArrayMetadataColumns.size(); j < jLen; j++) {
					JsonObject gsonObjectMergeMetadataColumn = gsonArrayMergeMetadata.get(j).getAsJsonObject();
					JsonObject gsonObjectMetadataColumn = gsonArrayMetadataColumns.get(j).getAsJsonObject();
					
					JsonObject gsonObjectMergeMetadataColumnStatistics = gsonObjectMergeMetadataColumn.get("statistics").getAsJsonObject();
					JsonObject gsonObjectMetadataColumnStatistics = gsonObjectMetadataColumn.get("statistics").getAsJsonObject();
					
					long count = gsonObjectMergeMetadataColumnStatistics.get("count").getAsLong();                   // 총계
					count += gsonObjectMetadataColumnStatistics.get("count").getAsLong();
					gsonObjectMergeMetadataColumnStatistics.addProperty("count", count);
					
					long valid = gsonObjectMergeMetadataColumnStatistics.get("valid").getAsLong();                   // 유효
					valid += gsonObjectMetadataColumnStatistics.get("valid").getAsLong();
					gsonObjectMergeMetadataColumnStatistics.addProperty("valid", valid);
					
					long invalid = gsonObjectMergeMetadataColumnStatistics.get("invalid").getAsLong();               // 무효
					invalid += gsonObjectMetadataColumnStatistics.get("invalid").getAsLong();
					gsonObjectMergeMetadataColumnStatistics.addProperty("invalid", invalid);
					
					long empty = gsonObjectMergeMetadataColumnStatistics.get("empty").getAsLong();                   // 공백
					empty += gsonObjectMetadataColumnStatistics.get("empty").getAsLong();
					gsonObjectMergeMetadataColumnStatistics.addProperty("empty", empty);
					
					double max = gsonObjectMergeMetadataColumnStatistics.get("max").getAsDouble();                   // 최대
					if(!(Double.isNaN(max) || 0 ==  max)) {
						if(max < gsonObjectMetadataColumnStatistics.get("max").getAsDouble()) {
							gsonObjectMergeMetadataColumnStatistics.addProperty("max", gsonObjectMetadataColumnStatistics.get("max").getAsString());
						}
					}
					
					double min = gsonObjectMergeMetadataColumnStatistics.get("min").getAsDouble();                   // 최소					
					if(!(Double.isNaN(min) || 0 ==  min)) {
						if(min > gsonObjectMetadataColumnStatistics.get("min").getAsDouble()) {
							gsonObjectMergeMetadataColumnStatistics.addProperty("min", gsonObjectMetadataColumnStatistics.get("min").getAsString());							
						}
					}					
					
					double mean = gsonObjectMergeMetadataColumnStatistics.get("mean").getAsDouble();                 // 평균					
					if(!(Double.isNaN(mean) || 0 ==  mean)) {
						mean = new BigDecimal(mean).add(new BigDecimal(gsonObjectMetadataColumnStatistics.get("mean").getAsDouble())).doubleValue();
						gsonObjectMergeMetadataColumnStatistics.addProperty("mean", mean);						
					}					
					
					long duplicateCount = gsonObjectMergeMetadataColumnStatistics.get("duplicateCount").getAsLong(); // 중복
					duplicateCount += gsonObjectMetadataColumnStatistics.get("duplicateCount").getAsLong();
					gsonObjectMergeMetadataColumnStatistics.addProperty("duplicateCount", duplicateCount);
					
					long distinctCount = gsonObjectMergeMetadataColumnStatistics.get("distinctCount").getAsLong();   // 구별
					distinctCount += gsonObjectMetadataColumnStatistics.get("distinctCount").getAsLong();
					gsonObjectMergeMetadataColumnStatistics.addProperty("distinctCount", distinctCount);					
					
					// 패턴
					JsonArray gsonArrayMergePatternFrequencyTable = gsonObjectMergeMetadataColumnStatistics.get("patternFrequencyTable").getAsJsonArray();
					JsonArray gsonArrayPatternFrequencyTable = gsonObjectMetadataColumnStatistics.get("patternFrequencyTable").getAsJsonArray();
					for(int k = 0, kLen = gsonArrayPatternFrequencyTable.size(); k < kLen; k++) {
						JsonObject gsonObjectPatternFrequencyTable = gsonArrayPatternFrequencyTable.get(k).getAsJsonObject();
						
						String pattern = gsonObjectPatternFrequencyTable.get("pattern").getAsString();
						long occurrences = gsonObjectPatternFrequencyTable.get("occurrences").getAsLong();
						
						boolean addFlag = true;
						for(int l = 0, lLen = gsonArrayMergePatternFrequencyTable.size(); l < lLen; l++) {
							JsonObject gsonObjectMergePatternFrequencyTable = gsonArrayMergePatternFrequencyTable.get(l).getAsJsonObject();
							
							if(pattern.equals(gsonObjectMergePatternFrequencyTable.get("pattern").getAsString())) {
								gsonObjectMergePatternFrequencyTable.addProperty("occurrences", (gsonObjectMergePatternFrequencyTable.get("occurrences").getAsLong() + occurrences));								
								addFlag = false;
								break;
							}
						}
						
						if(addFlag) {
							gsonArrayMergePatternFrequencyTable.add(gsonObjectPatternFrequencyTable); // pattern 정렬이 필요할지도...
						}
					}
					gsonObjectMergeMetadataColumnStatistics.add("patternFrequencyTable", gsonArrayMergePatternFrequencyTable);
					
					// histogram
					if(null != gsonObjectMergeMetadataColumnStatistics.get("histogram")) {
						JsonArray gsonArrayMergeHistogramItems = gsonObjectMergeMetadataColumnStatistics.get("histogram").getAsJsonObject().get("items").getAsJsonArray();
						JsonArray gsonArrayHistogramItems = gsonObjectMetadataColumnStatistics.get("histogram").getAsJsonObject().get("items").getAsJsonArray();
						for(int k = 0, kLen = gsonArrayHistogramItems.size(); k < kLen; k++) {
							JsonObject gsonObjectItem = gsonArrayHistogramItems.get(k).getAsJsonObject();
							JsonObject gsonObjectItemRange = gsonObjectItem.get("range").getAsJsonObject();
							
							long occurrences = gsonObjectItem.get("occurrences").getAsLong();
							double rangeMin = gsonObjectItemRange.get("min").getAsDouble();
							double rangeMax = gsonObjectItemRange.get("max").getAsDouble();
							
							boolean addFlag = true;
							for(int l = 0, lLen = gsonArrayMergeHistogramItems.size(); l < lLen; l++) {
								JsonObject gsonObjectMergeItem = gsonArrayMergeHistogramItems.get(l).getAsJsonObject();
								JsonObject gsonObjectMergeItemRange = gsonObjectMergeItem.get("range").getAsJsonObject();
								
								if(new BigDecimal(rangeMin).equals(new BigDecimal(gsonObjectMergeItemRange.get("min").getAsDouble()))
								&& new BigDecimal(rangeMax).equals(new BigDecimal(gsonObjectMergeItemRange.get("max").getAsDouble()))) {
									gsonObjectMergeItem.addProperty("occurrences", (gsonObjectMergeItem.get("occurrences").getAsLong() + occurrences));								
									addFlag = false;
									break;
								}
							}
							
							if(addFlag) {
								gsonArrayMergeHistogramItems.add(gsonObjectItem); // histogram 정렬이 필요할지도...
							}							
						}
						gsonObjectMergeMetadataColumnStatistics.get("histogram").getAsJsonObject().add("items", gsonArrayMergeHistogramItems);
					}
					gsonArrayMergeMetadata.set(j, gsonObjectMergeMetadataColumn);
				}
			}
		}
		
		for(int i = 0, len = gsonArrayMergeMetadata.size(); i < len; i++) {
			JsonObject gsonObjectMergeMetadataColumn = gsonArrayMergeMetadata.get(i).getAsJsonObject();
			JsonObject gsonObjectMergeMetadataColumnStatistics = gsonObjectMergeMetadataColumn.get("statistics").getAsJsonObject();
			
			double mean = gsonObjectMergeMetadataColumnStatistics.get("mean").getAsDouble(); // 평균
			if(!(Double.isNaN(mean) || 0 ==  mean)) {
				mean = new BigDecimal(mean).divide(new BigDecimal(listGsonArrayMetadata.size()), getScale(mean), BigDecimal.ROUND_HALF_UP).doubleValue();				
			}
			gsonObjectMergeMetadataColumnStatistics.addProperty("mean", mean);
			
			// patternFrequencyTable 정렬
			JsonArray patternFrequencyTable = gsonObjectMergeMetadataColumnStatistics.get("patternFrequencyTable").getAsJsonArray();
			patternFrequencyTable = sorted(patternFrequencyTable, "pattern", "asc");
			gsonObjectMergeMetadataColumnStatistics.add("patternFrequencyTable", patternFrequencyTable.deepCopy());
			
			// histogram 정렬
			JsonElement gsonElementHistogram = gsonObjectMergeMetadataColumnStatistics.get("histogram");
			if(null != gsonElementHistogram) {
				JsonObject histogram = gsonElementHistogram.getAsJsonObject();
				JsonArray items = histogram.get("items").getAsJsonArray();
				items = sorted(items, "range.min", "asc");
				
				histogram.add("items", items.deepCopy());
				gsonObjectMergeMetadataColumnStatistics.add("histogram", histogram.deepCopy());
			}
			gsonObjectMergeMetadataColumn.add("statistics", gsonObjectMergeMetadataColumnStatistics.deepCopy());
			gsonArrayMergeMetadata.set(i, gsonObjectMergeMetadataColumn.deepCopy());
		}
		
		return gsonArrayMergeMetadata;
	}
*/	
	/**
	 * 합산을 위해 지수형(E)으로 표현하고 있는 double 형을 읽어 들임.
	 * @param gsonArrayMetadata
	 * @return
	 */
/*	
	public JsonArray readMetadata(JsonArray gsonArrayMetadata) {
		for(int i = 0, len = gsonArrayMetadata.size(); i < len; i++) {
			JsonObject gsonObjectColumnMetadata = gsonArrayMetadata.get(i).getAsJsonObject();
			
			double max = gsonObjectColumnMetadata.get("max").getAsDouble();
			if(!(Double.isNaN(max) || 0 ==  max)) {
				gsonObjectColumnMetadata.addProperty("max", new BigDecimal(max).setScale(getScale(max), BigDecimal.ROUND_HALF_UP).toString());
			}
			
			double min = gsonObjectColumnMetadata.get("min").getAsDouble();
			if(!(Double.isNaN(min) || 0 ==  min)) {
				gsonObjectColumnMetadata.addProperty("min", new BigDecimal(min).setScale(getScale(min), BigDecimal.ROUND_HALF_UP).toString());
			}					
			
			double mean = gsonObjectColumnMetadata.get("mean").getAsDouble();
			if(!(Double.isNaN(mean) || 0 ==  mean)) {
				gsonObjectColumnMetadata.addProperty("mean", new BigDecimal(mean).setScale(getScale(mean), BigDecimal.ROUND_HALF_UP).toString());
			}

			// histogram 이 없는 경우도 있다.
			if(null != gsonObjectColumnMetadata.get("histogram")) {
				JsonObject gsonObjectHistogram = gsonObjectColumnMetadata.get("histogram").getAsJsonObject();
				JsonArray gsonArrayItems = gsonObjectHistogram.get("items").getAsJsonArray();
				
				for(int j = 0, jLen = gsonArrayItems.size(); j < jLen; j++) {
					JsonObject gsonObjectItem = gsonArrayItems.get(j).getAsJsonObject();
					JsonObject gsonObjectRange = gsonObjectItem.get("range").getAsJsonObject();
					
					double rangeMin = gsonObjectRange.get("min").getAsDouble();
					if(!(Double.isNaN(rangeMin) || 0 ==  rangeMin)) {
						gsonObjectRange.addProperty("min", new BigDecimal(rangeMin).setScale(getScale(rangeMin), BigDecimal.ROUND_HALF_UP).toString());
					}
					
					double rangeMax = gsonObjectRange.get("max").getAsDouble();
					if(!(Double.isNaN(rangeMax) || 0 ==  rangeMax)) {
						gsonObjectRange.addProperty("max", new BigDecimal(rangeMax).setScale(getScale(rangeMax), BigDecimal.ROUND_HALF_UP).toString());
					}
					
					gsonObjectItem.add("range", gsonObjectRange);
					gsonArrayItems.set(j, gsonObjectItem);
				}
				gsonObjectHistogram.add("items", gsonArrayItems);
				gsonObjectColumnMetadata.add("histogram", gsonObjectHistogram);
			}
			gsonArrayMetadata.set(i, gsonObjectColumnMetadata);
		}
		return gsonArrayMetadata;
	}
*/	
	private JsonObject readGzipFile(File file) {
		if(file.isFile()) {
    		try (FileInputStream fileInputStream = new FileInputStream(file); GZIPInputStream gZIPInputStream = new GZIPInputStream(fileInputStream)) {
    			String strContent = IOUtils.toString(gZIPInputStream, "UTF-8");
    			
    			if(StringUtils.isNotBlank(strContent)) {
        			return new JsonParser().parse(strContent).getAsJsonObject();
    			}
	        } 
    		catch (IOException e) {
    			e.printStackTrace();
	        }
		}		
		return null;
	}
/*	
	private int getScale(double dValue) {
		String strOriginDValue = String.valueOf(dValue);
		String tmpDValue = "";
		String exponent = "0";
		
		int sIdx = strOriginDValue.indexOf(".");		
		if(0 <= sIdx) {
			tmpDValue = strOriginDValue.substring(sIdx + 1);

			int eIdx = tmpDValue.indexOf("E");
			if(0 <= eIdx) {
				exponent = tmpDValue.substring(eIdx + 1);
				tmpDValue = tmpDValue.substring(0, eIdx);
			}
			
			if(tmpDValue.length() > Integer.parseInt(exponent)) {
				return (tmpDValue.length() - Integer.parseInt(exponent));
			}
		}
		
		return 0;
	}
	
	private JsonArray sorted(JsonArray gsonArray, String key, String sortType) {
		JsonArray sortedJsonArray = new JsonArray();
	    List<JsonObject> jsonValues = new ArrayList<JsonObject>();
	    for(int i = 0; i < gsonArray.size(); i++) {
	        jsonValues.add(gsonArray.get(i).getAsJsonObject());
	    }
	    
	    Collections.sort(jsonValues, new Comparator<JsonObject>() {
	        @Override
	        public int compare(JsonObject a, JsonObject b) {
	            String valA = null;
	            String valB = null;
	            
	            String[] keys = key.split("\\.");
	            
	            if(1 < keys.length) {
		            valA = a.get(keys[0]).getAsJsonObject().get(keys[1]).getAsString();
		            valB = b.get(keys[0]).getAsJsonObject().get(keys[1]).getAsString();
	            }
	            else {
		            valA = a.get(key).getAsString();
		            valB = b.get(key).getAsString();	            	
	            }

	            if(isNumeric(valA) && isNumeric(valB)) {
	            	BigDecimal bdA = new BigDecimal(valA);
	            	BigDecimal bdB = new BigDecimal(valB);
	            	
		            if("desc".equals(sortType.toLowerCase())) {
		            	return -bdA.compareTo(bdB);
		            }
		            else {
		            	return bdA.compareTo(bdB);
		            }
	            }
	            else {
		            if("desc".equals(sortType.toLowerCase())) {
		            	return -valA.compareTo(valB);
		            }
		            else {
		            	return valA.compareTo(valB);	            	
		            }	            	
	            }
	        }
	    });
	    
	    for(int i = 0; i < gsonArray.size(); i++) {
	        sortedJsonArray.add(jsonValues.get(i));
	    }
	    
	    return sortedJsonArray;
	}
	
	private boolean isNumeric(String str) {
		try {
			@SuppressWarnings("unused")
			BigDecimal bd = new BigDecimal(str);
		} catch (NumberFormatException e) {
			return false;
		}
		return true;
	}
*/	
}
