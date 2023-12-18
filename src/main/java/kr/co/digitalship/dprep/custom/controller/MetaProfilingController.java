;spackage kr.co.digit;sship.dprep.custom.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.TEXT_PLAIN_VALUE;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.hadoop.fs.FileSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.talend.dataprep.api.dataset.ColumnMetadata;
import org.talend.dataprep.api.dataset.DataSetMetadata;
import org.talend.dataprep.api.dataset.RowMetadata;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;
import kr.co.digitalship.dprep.custom.tests.TestVo;

@RestController
public class MetaProfilingController {
	
	@Value("${hadoop.write.base.path:}")
	private String hadoopWriteBasePath;	
			
	@Value("${hadoop.result.reg.base.path:}")
	private String hadoopResultRegBasePath;	
	
	@Autowired
	private HadoopUtil hadoopUtil;
	
    @Autowired
    private ObjectMapper mapper;
	
    @PostConstruct
    public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();

		hadoopWriteBasePath = properties.getProperty("hadoop.write.base.path");
		hadoopResultRegBasePath = properties.getProperty("hadoop.result.reg.base.path");
    }  	    
/*  
  	// RestController 라...사용 않음
	@RequestMapping(value = "/meta/view/{wsId}", method = GET, produces = TEXT_PLAIN_VALUE) 
	public String viewMeta(@PathVariable(value = "wsId") String wsId, Model model) {		
		model.addAttribute("wsId", wsId); 
		
		return "thymeleaf/metaProfiling"; 
	}    
*/    
	@RequestMapping(value = "/meta/{wsId}", method = GET, produces = APPLICATION_JSON_VALUE)
	public DataSetMetadata getMeta(@PathVariable(value = "wsId") String wsId) throws Exception {
		String jsonStr = hadoopUtil.getStr(hadoopResultRegBasePath + "/" + wsId + "/metadata.json");
		DataSetMetadata dataSetMetadata = null;
		
		if(StringUtils.isBlank(jsonStr)) {
			throw new Exception("Not Complete");
		}
		
		try {
			dataSetMetadata = mapper.readValue(jsonStr, DataSetMetadata.class);
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
		
		return dataSetMetadata;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/meta/compare/{wsId}", method = GET, produces = APPLICATION_JSON_VALUE)
	public Map getEachCompare(@PathVariable(value = "wsId") String wsId) {
		//JsonObject result = new JsonObject();
	    Map result = new HashMap();
	    result.put("result", "fail");
		
	    FileSystem fs = hadoopUtil.getFs();
		try {
		    List<String> fileLists = hadoopUtil.getFileList(fs, String.format("%s/%s", hadoopWriteBasePath, wsId));
    
			List<Long> beforeValid = new ArrayList<>();
			List<Long> beforeInvalid = new ArrayList<>();
			List<Long> beforeEmpty = new ArrayList<>();
		    
			List<Long> afterValid = new ArrayList<>();
			List<Long> afterInvalid = new ArrayList<>();
			List<Long> afterEmpty = new ArrayList<>();
			
			List<String> domain = new ArrayList<>();
			List<String> type = new ArrayList<>();
			List<String> name = new ArrayList<>();			
			
		    for(int i = 0, len = fileLists.size(); i < len; i++) {
		    	String filepath = fileLists.get(i);
		    	String filename = filepath.substring(filepath.lastIndexOf("/") + 1, filepath.lastIndexOf("."));
		    	
				// 전처리 전
		    	{
					String beforeJsonStr = hadoopUtil.getStr(String.format("%s/%s/%s_before_metadata.json", hadoopResultRegBasePath, wsId, filename));
					
					DataSetMetadata beforeMetadata = mapper.readValue(beforeJsonStr, DataSetMetadata.class);
					List<ColumnMetadata> beforeRowMetadata = beforeMetadata.getRowMetadata().getColumns();
					
					for(int j = 0, jlen = beforeRowMetadata.size(); j < jlen; j++) {
						try {
							beforeValid.set(j, beforeValid.get(j) + beforeRowMetadata.get(j).getStatistics().getValid());
							beforeInvalid.set(j, beforeInvalid.get(j) + beforeRowMetadata.get(j).getStatistics().getInvalid());
							beforeEmpty.set(j, beforeEmpty.get(j) + beforeRowMetadata.get(j).getStatistics().getEmpty());							
						}
						catch(IndexOutOfBoundsException e) {
							beforeValid.add(beforeRowMetadata.get(j).getStatistics().getValid());
							beforeInvalid.add(beforeRowMetadata.get(j).getStatistics().getInvalid());
							beforeEmpty.add(beforeRowMetadata.get(j).getStatistics().getEmpty());							
						}
					}
		    	}
		    	
				// 전처리 후
				{
					String afterJsonStr = hadoopUtil.getStr(String.format("%s/%s/%s_after_metadata.json", hadoopResultRegBasePath, wsId, filename));
	
					DataSetMetadata afterMetadata = mapper.readValue(afterJsonStr, DataSetMetadata.class);
					List<ColumnMetadata> afterRowMetadata = afterMetadata.getRowMetadata().getColumns();
					
					for(int j = 0, jlen = afterRowMetadata.size(); j < jlen; j++) {
						try {
							afterValid.set(j, afterValid.get(j) + afterRowMetadata.get(j).getStatistics().getValid());
							afterInvalid.set(j, afterInvalid.get(j) + afterRowMetadata.get(j).getStatistics().getInvalid());
							afterEmpty.set(j, afterEmpty.get(j) + afterRowMetadata.get(j).getStatistics().getEmpty());					
						}
						catch(IndexOutOfBoundsException e) {
							afterValid.add(afterRowMetadata.get(j).getStatistics().getValid());
							afterInvalid.add(afterRowMetadata.get(j).getStatistics().getInvalid());
							afterEmpty.add(afterRowMetadata.get(j).getStatistics().getEmpty());							
						}						
						
						if(0 == i) {
							domain.add(afterRowMetadata.get(j).getDomainLabel());
							type.add(afterRowMetadata.get(j).getType());
							name.add(afterRowMetadata.get(j).getName());
							
							if(0 ==j) {
								result.put("result", "success");
							}
						}
					}
				}
		    }

			Map before = new HashMap();
			before.put("valid", beforeValid);
			before.put("invalid", beforeInvalid);
			before.put("empty", beforeEmpty);
			
			Map after = new HashMap();
			after.put("valid", afterValid);
			after.put("invalid", afterInvalid);
			after.put("empty", afterEmpty);			

			result.put("before", before);
			result.put("after", after);			
			result.put("domain", domain);
			result.put("type", type);
			result.put("name", name);		
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
        finally {
            if(null != fs) {
                try { fs.close(); } catch (IOException e) {}                                
            }
        }
		return result;		
	}
}
