package kr.co.digitalship.dprep.custom.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.talend.dataprep.api.dataset.DataSetMetadata;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;

@RestController
public class MetaProfilingController {
	
	@Value("${hadoop.result.reg.base.path:}")
	private String hadoopResultRegBasePath;	
	
	@Autowired
	private HadoopUtil hadoopUtil;
	
    @Autowired
    private ObjectMapper mapper;
	
    @PostConstruct
    public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();

		hadoopResultRegBasePath = properties.getProperty("hadoop.result.reg.base.path");
    }  	    
    
	@RequestMapping(value = "/view/meta", method = GET, produces = APPLICATION_JSON_VALUE)
	public DataSetMetadata getMeta(@RequestParam String wsId) throws Exception {
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
	
	@RequestMapping(value = "/view/{wsId}/meta", method = GET, produces = APPLICATION_JSON_VALUE)
	public DataSetMetadata getMetadata(@PathVariable(value = "wsId") String wsId) {
		String jsonStr = hadoopUtil.getStr(hadoopResultRegBasePath + "/" + wsId + "/metadata.json");
		DataSetMetadata dataSetMetadata = null;
		
		try {
			dataSetMetadata = mapper.readValue(jsonStr, DataSetMetadata.class);
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
		
		return dataSetMetadata;
	}
}
