package kr.co.digitalship.dprep.custom.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Deque;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import javax.annotation.PostConstruct;

import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.toList;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.TEXT_PLAIN_VALUE;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.hadoop.fs.FileSystem;
import org.apache.http.client.utils.URIBuilder;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.talend.daikon.exception.ExceptionContext;
import org.talend.dataprep.api.dataset.DataSetMetadata;
import org.talend.dataprep.api.preparation.Action;
import org.talend.dataprep.api.preparation.AppendStep;
import org.talend.dataprep.api.preparation.MixedContentMap;
import org.talend.dataprep.api.preparation.Preparation;
import org.talend.dataprep.api.service.PreparationAPI;
import org.talend.dataprep.exception.TDPException;
import org.talend.dataprep.exception.error.DataSetErrorCodes;
import org.talend.dataprep.util.ReentrantReadWriteLockGroup;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import io.swagger.annotations.ApiParam;
import kr.co.digitalship.dprep.custom.CommonUtil;
import kr.co.digitalship.dprep.custom.DprepHttpUtil;
import kr.co.digitalship.dprep.custom.FileTypeDetector;
import kr.co.digitalship.dprep.custom.PcnApiUtil;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.SJDprepHttpUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.SplitUtil;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.job.Job1Read;
import kr.co.digitalship.dprep.custom.schedule.job.Job2CreateDataset;
import kr.co.digitalship.dprep.custom.schedule.job.Job4Export;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob1;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob2;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerJob4;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerTrigger1;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerTrigger2;
import kr.co.digitalship.dprep.custom.schedule.job.listener.ListenerTrigger4;
import kr.co.digitalship.dprep.custom.schedule.util.BackgroundAnalysisCustom;
import kr.co.digitalship.dprep.custom.schedule.util.DprepUtil;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;
import kr.co.digitalship.dprep.custom.schedule.util.QuartzConfigUtil;
import kr.co.digitalship.dprep.custom.schedule.vo.ProcessingInfomationVO;

@RestController
public class SJProfilingReportController {
	private static final Logger LOGGER = LoggerFactory.getLogger(SJProfilingReportController.class);

	private final ReentrantReadWriteLockGroup locks = new ReentrantReadWriteLockGroup(true, 100);	
	
	@Autowired
	private DprepUtil dprepUtil;
	
	@Autowired
	private PcnApiUtil pcnApiUtil;

	@Autowired
	private DprepHttpUtil dprepHttpUtil;
	
	@Autowired
	private FileTypeDetector fileTypeDetector;	
	
	@Autowired
	private SplitUtil splitUtil;
	
	@Autowired
	private SJDprepHttpUtil sJDprepHttpUtil;
	
	@Autowired
	private BackgroundAnalysisCustom backgroundAnalysisCustom;	
	
	@Autowired
	private HadoopUtil hadoopUtil;	

    @Autowired
    private ObjectMapper mapper;	
	
    @Value("${preparation.store.file.location:}")
    private String preparationsLocation;
    
    @Value("${sejong.api.export.base.path:}")
    private String sejongApiExportBasePath;    
    
    @PostConstruct
    public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
    }  	
	
    /**
     * 확인이 필요한 사항
     * 0. 샘플데이터의 건수는 몇건인가? 
     * 1. 원본 데이터를 어떤 방식으로 읽어 들일 것인가?
     *    1.1 임의의 샘플 파일을 하둡내 임의의 디렉토리에 미리 넣어 놓고 해당 파일의 경로 정보를 디지탈쉽측에 줄 것인가?
     *    1.2 WS_ID 를 디지탈쉽측에 전달하고 디지탈쉽은 해당 WS_ID 에 해당하는 디렉토리의 파일을 대상으로 임의의 파일에서 임의의 행을 추출하여 샘플파일을 특정 경로에 만들어서 사용할 것인가?
     *        eg) WS_ID = 6 인 경우 하둡내 대상 경로 /kWeather/PCN/6, 샘플 파일 생성은  /kWeather/SEJONG/sample/6 정도? (노드가 달라도 샘플 파일의 데이터는 동일해야 하므로 해당 파일 유지)
     *    1.3 DPrep 이 이미 생성해 놓은 데이터셋을 대상으로 할 것 인가? (레시피 구성 이전의 데이터)
     * 2. 출력 파일의 네이밍을 규칙이 필요
     *    1.1 세종대측에서 원본 데이터 및 스텝, 노드별 출력 데이터를 구분하기 위해 어떤 정보를 넘겨 줄 수 있는지 확인하여 네이밍 규칙을 정해야함.
     *         eg) A 데이터 - 스텝1 - 노드3, B 데이터 - 스텝1 - 노드3
     *             A 데이터 - 스텝2 - 노드1
     * 3. 레시피 생성을 위한 데이터는 해당 노드의 이전 노드들의 액션 정보를 포함해서 전송해 주어야함. 
     * 4. 스케줄러가 sjpr 으로 구분된 레시피를 우선 복제할 수 있도록 수정 필요함.
     */
    
	/** 대충 이런 형태로 세종대로부터 호출을 받음.
	 * /kWeather/SEJONG/sample/{WS_ID}/sample.csv
	 * /kWeather/SEJONG/sample/{WS_ID}/metadata.json
	 * /kWeather/SEJONG/sample/{WS_ID}/sample_{stepNo}_{nodeNo}.csv
	 * 
	 * /kWeather/SEJONG/sample/ 해당 경로는 properties로 빼야됨...
	 * 
	 * 입력 - 대상 파일 경로(명), 스텝 구분값, 노드 구분값,
	 * 출력 - 기본출력경로/파일명/스텝_노드.csv, 기본출력경로/파일명/스텝_노드.json 형태 | 이 경우에 동일 파일명은 어떻게 하지? 세종대가 원본 파일에 대한 구분을 가지고 있을까?
	 * eg) A, A' 가 동일 파일명이면 어떻게 구분할 것 인가?
	 * 
	 * action 은 6가지 항목
	 * 무효값 지우기(clear_invalid) / 무효값이 있는 행 삭제(delete_invalid) / 빈값이 있는 행 삭제(delete_empty)
	 * 무효값 채우기(fillinvalidwithdefault) / 빈값 채우기(fillemptywithdefault)
	 * 바꾸기(replace_on_value)
	 * 
	 * column_id 4자리 숫자. 0에서 시작하며 좌측을 0으로 채우는 형 
	 * eg) 6개의 컬럼. 0000, 0001 ..., 0005
	 * 
	 * body - json
     *{
     *    "actions": [{
     *        "action": "clear_invalid",
     *        "parameters": {
     *            "column_id": "0002"
     *        }
     *    }, {
     *        "action": "fillinvalidwithdefault",
     *        "parameters": {
     *            "replace_value": "2222",
     *            "column_id": "0004"
     *        }
     *    }, {
     *        "action": "replace_on_value",
     *        "parameters": {
     *            "matching_value": "11",
     *            "operator": "equals",
     *            "replace_value": "1111",
     *            "column_id": "0003"
     *        }
     *    }
     *    ]
     *}
     *
     * 하둡에서 이전 데이터를 끌어서 쓰는 경우...해당 데이터에 대한 판단...을 어떻게 해야하나...
     * 
     * 현재 샘플 데이터로 전체 처리 : /sj/createRecipe/{ws_id}/{sample_data_lines}/{step_no}/{node_no}
     * 
     * sample_data_lines 부분을 Object 로 받을까...
     * 
     * 샘플 파일을 만드는 부분을 분리하고...
     * prev 로 이전 출력 파일의 앞 {step_no}_{node_no}를 전달 받을까...
     * 
	 */    
    
    /**
     * 현재 사용 않음
     * 
     * 파일 경로, 액션 정보 필요할 것으로 판단됨.
     * 호출시 입력 정보는 추후 조정 될 수 있음.
     * 필요한 경우 요청 정보를 Queue 에 적재하고 순차로 종료 알림 호출을 할 수 도 있음.
     */
/*    
	@RequestMapping(value = "/sj/createRecipe/{ws_id}/{sample_data_lines}/{step_no}/{node_no}", method = POST, produces = APPLICATION_JSON_VALUE)
    public void createRecipe(@PathVariable(value = "ws_id", required=true) String wsId,
    		                 @PathVariable(value = "sample_data_lines", required=true) int sampleDataLines,
    		                 //@RequestParam(value = "filename", required=true) String filename, 
    		                 @PathVariable(value = "step_no", required=true) int stepNo, 
    		                 @PathVariable(value = "node_no", required=true) int nodeNo, 
    		                 @RequestBody final AppendStep actionsContainer) {
		
		long start = System.currentTimeMillis();
		
        // 이전 작업 Dprep 데이터 전체 삭제
    	sJDprepHttpUtil.deletePreparation();
    	sJDprepHttpUtil.deleteDataset();
		
		FileSystem fs = hadoopUtil.getFs();
		// 샘플 데이터 생성 (없는 경우에)
		sJDprepHttpUtil.createSampleDataFile(fs, wsId, sampleDataLines);

		// 샘플 데이터 생성 기본 경로로 WS 당 1개의 sample.csv 가 있음.
		String fileBasePath = sejongApiExportBasePath + "/" + wsId;

		String baseName = "sample_recipe";
		List<String> listDatasetIds = new ArrayList<>();
		//try(InputStream in = Files.newInputStream(Paths.get(filePath), StandardOpenOption.READ)) {

		try(InputStream in = hadoopUtil.getInputStream(fs, fileBasePath + "/sample.csv")) {
			InputStream inputStream = fileTypeDetector.detect(in);
        	Deque<InputStream> contents = splitUtil.doSplit(inputStream, fileTypeDetector.getFileType(), fileTypeDetector.getFileEncoding());
        	
        	Deque<String> datasetIds = splitUtil.getDatasetId(DateFormatUtils.format(new Date(), "yyyyMMdd", Locale.KOREA), "sjpr", 0, 0, contents.size());
        	        	
        	//baseName = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.lastIndexOf("."));
        	
        	Deque<String> fileNames = new ConcurrentLinkedDeque<>();
        	for(int i = 0, len = datasetIds.size(); i < len; i++) {
        		if(0 < i) {
        			fileNames.add(String.format("%s_%d", baseName, i));
        		}
        		else {
        			fileNames.add(baseName);
        		}
        	}
        	
        	Deque<Map<String, String>> params = sJDprepHttpUtil.genCreateDatasetParams(fileNames, "", 0, datasetIds);
        	for(int i = 0, len = params.size(); i < len; i++) {
            	URIBuilder uriBuilders = sJDprepHttpUtil.uriBuild(params.poll());
            	// 네이밍 Id 네이밍에 sjpr 포함시 미리 정의한 Id 로 생성  
            	// /dataprep-dataset/src/main/java/org/talend/dataprep/dataset/store/content/file/LocalFileContentStore.java - line 51
            	String datasetId = sJDprepHttpUtil.callHttp(uriBuilders, "POST", contents.poll());
            	if(null != datasetId) {
            		listDatasetIds.add(datasetId);            		
            	}            	
        	}
		}
		catch (IOException e) {
			//baseName = null;
			listDatasetIds = null;
			LOGGER.error("unable to load sample data", e);
		}
		finally {
			//lock.readLock().unlock();
		}
		
		if(null == listDatasetIds) {
			return;
		}
		
		// PersistentPreparation 생성 (데이터셋 Id 네이밍에 sjpr 포함시 데이터셋과 동일한 Id로 생성)
		// /dataprep-preparation/src/main/java/org/talend/dataprep/preparation/service/PreparationService.java - line 177
		List<String> listPreparationIds = new ArrayList<>();
		
		Map<String, String> param = sJDprepHttpUtil.genCreatePreparationParam();
		URIBuilder uriBuilders = sJDprepHttpUtil.uriBuild(param);
		
		for(int i = 0, len = listDatasetIds.size(); i < len; i++) {
			JsonObject gsonObject = new JsonObject();
			gsonObject.addProperty("name", baseName);
			gsonObject.addProperty("dataSetId", listDatasetIds.get(i));
			
			String preparationId = sJDprepHttpUtil.callHttp(uriBuilders, "POST", gsonObject);
			if(null != preparationId) {
				listPreparationIds.add(preparationId);				
			}
		}
		
		// Action 에 column_name 이 필요하기 때문에 metadata 를 읽음
		param.clear();
		param.put("path", sJDprepHttpUtil.getDatasetMetadataPath(listDatasetIds.get(0)));
		
		uriBuilders = sJDprepHttpUtil.uriBuild(param);		
		
		String datasetMetadata = sJDprepHttpUtil.callHttp(uriBuilders, "GET", null);
		if(null != datasetMetadata) {
			sJDprepHttpUtil.setDatasetMetadata(new JsonParser().parse(datasetMetadata).getAsJsonObject());
		}

		// actionsContainer에 도메인 변환 액션 추가 필요함.
		List<Action> actions = actionsContainer.getActions();
		actions.add(0, sJDprepHttpUtil.genDomainChangeAction("0003", "초미세먼지"));
		actions.add(1, sJDprepHttpUtil.genDomainChangeAction("0005", "습도"));
		
		// Action 추가로 레시피 생성
		JsonArray gsonArrayActions = sJDprepHttpUtil.genActions(actionsContainer);		
        for(int i = 0, len = listPreparationIds.size(); i < len; i++) {
        	param.clear();
        	param.put("path", sJDprepHttpUtil.getAddActionPath(listPreparationIds.get(i)));
    		
    		uriBuilders = sJDprepHttpUtil.uriBuild(param);
    		
    		sJDprepHttpUtil.callHttp(uriBuilders, "POST", gsonArrayActions);
        }
		
		// 출력
        StringBuffer stringBuffer = new StringBuffer();
        String headerNbLines = sJDprepHttpUtil.getHeaderNbLines();
        		
        param = sJDprepHttpUtil.genExportParam();
        for(int i = 0, len = listDatasetIds.size(); i < len; i++) {
    		param.put("datasetId", listDatasetIds.get(i));
    		param.put("preparationId", listPreparationIds.get(i));
    		param.put("exportParameters.fileName", ""); // export 파일명은 재정의 필요할 수 있음...
    		
    		uriBuilders = sJDprepHttpUtil.uriBuild(param);

    		String responseTxt = sJDprepHttpUtil.callHttp(uriBuilders, "GET", null);
    		
			if("0".equals(headerNbLines)) {
				stringBuffer = CommonUtil.readAndExcludeHeader(stringBuffer, responseTxt);    				
			}
			else {
				stringBuffer.append(responseTxt);
			}
    		
			if(i == len - 1) {
	    		//System.out.println("======================================");
	    		//System.out.println(stringBuffer.toString());
	    		//System.out.println("======================================");
	    		
				hadoopUtil.write(fs, stringBuffer.toString(), fileBasePath + "/" + stepNo + "_" + nodeNo + "_complete.csv");
			}    		
        }
		
        // 분할된 부분의 전체 메타
        // 0 번째 데이터 셋 아이디인 이유는...실제 데이터와 관계 없이 메타데이터의 형태만 맞으면 되기 때문에...
		// 저장 경로등은 확인 필요.
        DataSetMetadata dataSetMetadata = backgroundAnalysisCustom.analyze(1, listDatasetIds.get(0));
		//dataSetMetadata.setId(wsId);
		//dataSetMetadata.setName(wsId);
        try {
			hadoopUtil.write(fs, mapper.writeValueAsString(dataSetMetadata), fileBasePath + "/" + stepNo + "_" + nodeNo + "_metadata.json");
		} 
        catch (JsonProcessingException e) {
			e.printStackTrace();
		}
        
        try { if(null != fs) fs.close(); } catch (IOException e) {}
        
		long end = System.currentTimeMillis();
		long elapsed = (end - start) / 1000;
		
		LOGGER.info("소요시간 : " + elapsed + "초");
		
		// 처리종료 알림 호출
	}
*/	
    
	/**
	 * 샘플 데이터 생성으로 생성후 메타 데이터까지 출력...
	 * 샘플 데이터이기 때문에 10만건 이하라고 상정함. 
	 * 기존 스케줄러 로직을 대부분 가져다 씀으로...
	 * Deque 형태이나 샘플데이터는 10만건 이하의 데이터일것이라 실제 1개만 있을 것임.
	 * 
	 * @param wsId : ws id
	 * @param rows : 생성할 샘플 파일의 행수
	 */
/*    
	@RequestMapping(value = "/sj/createSample/{ws_id}/{rows}", method = GET, produces = TEXT_PLAIN_VALUE)
    public void createSample(@PathVariable(value = "ws_id", required=true) String wsId,
    		                 @PathVariable(value = "rows", required=true) int rows) {
		
		long start = System.currentTimeMillis();
		
        // 이전 작업 Dprep 데이터 전체 삭제
    	sJDprepHttpUtil.deletePreparation();
    	sJDprepHttpUtil.deleteDataset();
		
		FileSystem fs = hadoopUtil.getFs();
		// 샘플 데이터 생성 (없는 경우에)
		sJDprepHttpUtil.createSampleDataFile(fs, wsId, rows);

		// 샘플 데이터 생성 기본 경로로 WS 당 1개의 sample.csv 가 있음.
		String fileBasePath = sejongApiExportBasePath + "/" + wsId;

		try(InputStream in = hadoopUtil.getInputStream(fs, fileBasePath + "/sample.csv")) {
			String datasetName = "sample_dataset";
			
			InputStream inputStream = fileTypeDetector.detect(in);
        	Deque<InputStream> contents = splitUtil.doSplit(inputStream, fileTypeDetector.getFileType(), fileTypeDetector.getFileEncoding());
        	
        	Deque<String> datasetIds = splitUtil.getDatasetId(DateFormatUtils.format(new Date(), "yyyyMMdd", Locale.KOREA), "sjpr", 0, 0, contents.size());
        	        	
        	Deque<String> fileNames = new ConcurrentLinkedDeque<>();
        	for(int i = 0, len = datasetIds.size(); i < len; i++) {
        		if(0 < i) {
        			fileNames.add(String.format("%s_%d", datasetName, i));
        		}
        		else {
        			fileNames.add(datasetName);
        		}
        	}
        	
        	Deque<Map<String, String>> params = sJDprepHttpUtil.genCreateDatasetParams(fileNames, "", 0, datasetIds);
        	for(int i = 0, len = params.size(); i < len; i++) {
            	URIBuilder uriBuilders = sJDprepHttpUtil.uriBuild(params.poll());
            	// 네이밍 Id 네이밍에 sjpr 포함시 미리 정의한 Id 로 생성  
            	// /dataprep-dataset/src/main/java/org/talend/dataprep/dataset/store/content/file/LocalFileContentStore.java - line 51
            	String datasetId = sJDprepHttpUtil.callHttp(uriBuilders, "POST", contents.poll());
            	            	
            	DataSetMetadata dataSetMetadata = sJDprepHttpUtil.getDataSetMetadata(datasetId);
            	dataSetMetadata = sJDprepHttpUtil.changeDomainInfo(dataSetMetadata);
            	
                try {
        			hadoopUtil.write(fs, mapper.writeValueAsString(dataSetMetadata), fileBasePath + "/sample_metadata.json");
        		} 
                catch (JsonProcessingException e) {
        			e.printStackTrace();
        		}            	
        	}
		}
		catch (IOException e) {
			LOGGER.error("unable to load sample data", e);
		}
		finally {
			try { if(null != fs) fs.close(); } catch (IOException e) {}  
		}
		
		long end = System.currentTimeMillis();
		long elapsed = (end - start) / 1000;
		
		LOGGER.info("소요시간 : " + elapsed + "초");
		
		// 처리종료 알림 호출
	}
*/	
	@RequestMapping(value = "/sj/createSample/{ws_id}/{rows}", method = GET, produces = TEXT_PLAIN_VALUE)
    public void createSample(@PathVariable(value = "ws_id", required=true) String wsId,
    		                 @PathVariable(value = "rows", required=true) int rows) {
		
		long start = System.currentTimeMillis();
		
		FileSystem fs = hadoopUtil.getFs();
		// 샘플 데이터 생성 (없는 경우에)
		sJDprepHttpUtil.createSampleDataFile(fs, wsId, rows);		
		
		this.createRecipe(wsId, "sample", -1, -1, null);
		
		long end = System.currentTimeMillis();
		long elapsed = (end - start) / 1000;
		
		LOGGER.info("소요시간 : " + elapsed + "초");		
	}
    
	
	/**
	 * 처음 만들것을 조금 수정함...돌아는 갈 것 같아 더 수정은 안함.
	 * 
	 * @param wsId
	 * @param filename : 확장자 제외 eg) sample, 1_1_complete ...
	 * @param stepNo
	 * @param nodeNo
	 * @param actionsContainer
	 */	
	@RequestMapping(value = "/sj/createRecipe/{ws_id}/{filename}/{step_no}/{node_no}", method = POST, produces = APPLICATION_JSON_VALUE)
    public void createRecipe(@PathVariable(value = "ws_id", required=true) String wsId,
    						 @PathVariable(value = "filename", required=true) String filename,
    		                 @PathVariable(value = "step_no", required=true) int stepNo,
    		                 @PathVariable(value = "node_no", required=true) int nodeNo, 
    		                 @RequestBody AppendStep actionsContainer) {
		
		long start = System.currentTimeMillis();

    	sJDprepHttpUtil.deletePreparation();
    	sJDprepHttpUtil.deleteDataset();
	    
	    FileSystem fs = hadoopUtil.getFs();
		// 샘플 데이터 생성 기본 경로로 WS 당 1개의 sample.csv 가 있음.
		String fileBasePath = sejongApiExportBasePath + "/" + wsId;

		List<String> listDatasetIds = new ArrayList<>();

		try(InputStream in = hadoopUtil.getInputStream(fs, fileBasePath + "/" + filename + ".csv")) {
			String datasetName = "profiling report dataset";
			
			InputStream inputStream = fileTypeDetector.detect(in);
        	Deque<InputStream> contents = splitUtil.doSplit(inputStream, fileTypeDetector.getFileType(), fileTypeDetector.getFileEncoding());
        	
        	Deque<String> datasetIds = splitUtil.getDatasetId(DateFormatUtils.format(new Date(), "yyyyMMdd", Locale.KOREA), "sjpr", 0, 0, contents.size());
        	        	
        	//baseName = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.lastIndexOf("."));
        	
        	Deque<String> fileNames = new ConcurrentLinkedDeque<>();
        	for(int i = 0, len = datasetIds.size(); i < len; i++) {
        		if(0 < i) {
        			fileNames.add(String.format("%s_%d", datasetName, i));
        		}
        		else {
        			fileNames.add(datasetName);
        		}
        	}
        	
        	Deque<Map<String, String>> params = sJDprepHttpUtil.genCreateDatasetParams(fileNames, "", 0, datasetIds);
        	for(int i = 0, len = params.size(); i < len; i++) {
            	URIBuilder uriBuilders = sJDprepHttpUtil.uriBuild(params.poll());
            	// 네이밍 Id 네이밍에 sjpr 포함시 미리 정의한 Id 로 생성  
            	// /dataprep-dataset/src/main/java/org/talend/dataprep/dataset/store/content/file/LocalFileContentStore.java - line 51
            	String datasetId = sJDprepHttpUtil.callHttp(uriBuilders, "POST", contents.poll());
            	if(null != datasetId) {
                	DataSetMetadata dataSetMetadata = sJDprepHttpUtil.getDataSetMetadata(datasetId);
                	dataSetMetadata = sJDprepHttpUtil.changeDomainInfo(dataSetMetadata);            		
            		
            		listDatasetIds.add(datasetId);            		
            	}            	
        	}
		}
		catch (IOException e) {
			listDatasetIds = null;
			LOGGER.error("unable to load sample data", e);
		}
		finally {
			//lock.readLock().unlock();
		}
		
		if(null == listDatasetIds) {
			return;
		}
		
		// PersistentPreparation 생성 (데이터셋 Id 네이밍에 sjpr 포함시 데이터셋과 동일한 Id로 생성)
		// /dataprep-preparation/src/main/java/org/talend/dataprep/preparation/service/PreparationService.java - line 177
		List<String> listPreparationIds = new ArrayList<>();
		
		Map<String, String> param = sJDprepHttpUtil.genCreatePreparationParam();
		URIBuilder uriBuilders = sJDprepHttpUtil.uriBuild(param);
		
		String preparationName = "profiling report preparation";
		for(int i = 0, len = listDatasetIds.size(); i < len; i++) {
			JsonObject gsonObject = new JsonObject();
			gsonObject.addProperty("name", preparationName);
			gsonObject.addProperty("dataSetId", listDatasetIds.get(i));
			
			String preparationId = sJDprepHttpUtil.callHttp(uriBuilders, "POST", gsonObject);
			if(null != preparationId) {
				listPreparationIds.add(preparationId);				
			}
		}
		
		// Action 에 column_name 이 필요하기 때문에 metadata 를 읽음
		param.clear();
		param.put("path", sJDprepHttpUtil.getDatasetMetadataPath(listDatasetIds.get(0)));
		
		uriBuilders = sJDprepHttpUtil.uriBuild(param);
		
		String datasetMetadata = sJDprepHttpUtil.callHttp(uriBuilders, "GET", null);
		if(null != datasetMetadata) {
			sJDprepHttpUtil.setDatasetMetadata(new JsonParser().parse(datasetMetadata).getAsJsonObject());
		}

		// 직전까지 누적된 actions 정보를 반영해줌
		JsonArray gsonArrayActions = null;
		if(-1 == stepNo && -1 == nodeNo) {
			actionsContainer = new AppendStep();
			
			List<Action> actions = actionsContainer.getActions();
			actions.add(0, sJDprepHttpUtil.genDomainChangeAction("0003", "초미세먼지"));
			actions.add(1, sJDprepHttpUtil.genDomainChangeAction("0005", "습도"));					
			
			gsonArrayActions = sJDprepHttpUtil.genActions(actionsContainer);
		}
		else {
			String prevActionsFilename = filename.replace("complete", "actions");
			if("sample".equals(filename)) {
				prevActionsFilename = "sample_actions";
			}
			
			String jsonStr = hadoopUtil.getStr(fileBasePath + "/" + prevActionsFilename + ".json");
			gsonArrayActions = new JsonParser().parse(jsonStr).getAsJsonArray();
			
			JsonArray addingActions = sJDprepHttpUtil.genActions(actionsContainer);			
			for(int i = 0, len = addingActions.size(); i < len; i++) {
				gsonArrayActions.add(addingActions.get(i).getAsJsonObject());
			}			
		}
		
        for(int i = 0, len = listPreparationIds.size(); i < len; i++) {
        	param.clear();
        	param.put("path", sJDprepHttpUtil.getAddActionPath(listPreparationIds.get(i)));
    		
    		uriBuilders = sJDprepHttpUtil.uriBuild(param);

    		sJDprepHttpUtil.callHttp(uriBuilders, "POST", gsonArrayActions);
        }
        
        String expertBaseName = stepNo + "_" + nodeNo;
        if(-1 == stepNo && -1 == nodeNo) {
        	expertBaseName = "sample";
        }
		
		// 출력
        StringBuffer stringBuffer = new StringBuffer();
        String headerNbLines = sJDprepHttpUtil.getHeaderNbLines();
        		
        param = sJDprepHttpUtil.genExportParam();
        for(int i = 0, len = listDatasetIds.size(); i < len; i++) {
    		param.put("datasetId", listDatasetIds.get(i));
    		param.put("preparationId", listPreparationIds.get(i));
    		param.put("exportParameters.fileName", ""); // export 파일명은 재정의 필요할 수 있음...
    		
    		uriBuilders = sJDprepHttpUtil.uriBuild(param);

    		String responseTxt = sJDprepHttpUtil.callHttp(uriBuilders, "GET", null);
    		
			if("0".equals(headerNbLines)) {
				stringBuffer = CommonUtil.readAndExcludeHeader(stringBuffer, responseTxt);    				
			}
			else {
				stringBuffer.append(responseTxt);
			}
    		
			if(i == len - 1) {
	    		//System.out.println("======================================");
	    		//System.out.println(stringBuffer.toString());
	    		//System.out.println("======================================");
	    		
				if(-1 == stepNo && -1 == nodeNo) {
					hadoopUtil.write(fs, stringBuffer.toString(), fileBasePath + "/" + expertBaseName + ".csv");
				}
				else {
					hadoopUtil.write(fs, stringBuffer.toString(), fileBasePath + "/" + expertBaseName + "_complete.csv");					
				}
			}    		
        }
		
        // preparation metadata
        JsonObject dataSetMetadata = sJDprepHttpUtil.getPreparationMetadata(listPreparationIds.get(0));

		hadoopUtil.write(fs, dataSetMetadata.toString(), fileBasePath + "/" + expertBaseName + "_metadata.json");
		hadoopUtil.write(fs, gsonArrayActions.toString(), fileBasePath + "/" + expertBaseName + "_actions.json");
        
        try { if(null != fs) fs.close(); } catch (IOException e) {}
        
		long end = System.currentTimeMillis();
		long elapsed = (end - start) / 1000;
		
		LOGGER.info("소요시간 : " + elapsed + "초");
		
		// 처리종료 알림 호출
	}	
}
