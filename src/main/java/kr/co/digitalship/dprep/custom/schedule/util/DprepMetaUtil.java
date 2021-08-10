package kr.co.digitalship.dprep.custom.schedule.util;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
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
import kr.co.digitalship.dprep.custom.Singleton;

@Component
public class DprepMetaUtil {
    @Value("${preparation.store.file.location:}")
    private String preparationsLocation;
	
	@PostConstruct
	public DprepMetaUtil init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
		preparationsLocation = properties.getProperty("preparation.store.file.location");
		
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
	private JsonObject readGzipFile(File file) {
		if(file.isFile()) {
    		try (InputStream in = Files.newInputStream(Paths.get(file.getPath()), StandardOpenOption.READ); GZIPInputStream gZIPInputStream = new GZIPInputStream(in)) {
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
}
