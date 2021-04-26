// ============================================================================
// Copyright (C) 2006-2018 Talend Inc. - www.talend.com
//
// This source code is available under agreement available at
// https://github.com/Talend/data-prep/blob/master/LICENSE
//
// You should have received a copy of the agreement
// along with this program; if not, write to Talend SA
// 9 rue Pages 92150 Suresnes, France
//
// ============================================================================

package kr.co.digitalship.dprep;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.talend.dataprep.configuration.DataPrepComponentScanConfiguration;

import com.netflix.hystrix.Hystrix;

import kr.co.digitalship.dprep.custom.DirectoryWatcher;
import kr.co.digitalship.dprep.custom.PropertiesUtil;

@SpringBootApplication
@Configuration("kr.co.digitalship.dprep.Application")
@Profile("standalone")
@ComponentScan(basePackages = { 
        "org.talend.dataprep", 
        "org.talend.daikon.content", 
        "org.talend.daikon.security", 
        "org.talend.tenancy",
        "kr.co.digitalship.dprep.custom",
        "kr.co.digitalship.dprep.custom.controller",
        "kr.co.digitalship.dprep.custom.redis", 
        "kr.co.digitalship.dprep.custom.schedule", 
        "kr.co.digitalship.dprep.custom.schedule.job", 
        "kr.co.digitalship.dprep.custom.schedule.job.listener", 
        "kr.co.digitalship.dprep.custom.schedule.util" 
    }, excludeFilters={
        @ComponentScan.Filter(type=FilterType.REGEX, pattern = "org\\.springframework\\.boot\\.autoconfigure\\.websocket\\.WebSocketAutoConfiguration.*"),
		@ComponentScan.Filter(type=FilterType.ASSIGNABLE_TYPE, value=org.talend.daikon.documentation.DocumentationController.class)
	}
)
public class Application implements DisposableBean {
    //private static final Logger LOG = LoggerFactory.getLogger(Application.class);

    public static void main(String[] args) throws ClassNotFoundException {
    	ApplicationContext applicationContext = SpringApplication.run(Application.class, args);
    	
    	// DQ 에서 사전과 정규식을 변경할때 변경 반영하기 위해
		Properties properties = new PropertiesUtil().getProperties();
		String dataqualityIndexesLocation = properties.getProperty("dataquality.indexes.file.location");
		DirectoryWatcher[] directoryWatchers = new DirectoryWatcher[3];
		Path[] paths = new Path[3];
		
		paths[0] = Paths.get(new File(dataqualityIndexesLocation + "/t_default/prod/dictionary").toURI());
		paths[1] = Paths.get(new File(dataqualityIndexesLocation + "/t_default/prod/metadata").toURI());
		paths[2] = Paths.get(new File(dataqualityIndexesLocation + "/t_default/prod/regex").toURI());
		
		for(int i = 0, len = paths.length; i < len; i++) {
			if(Files.isDirectory(paths[i])) {
		    	try {
					directoryWatchers[i] = new DirectoryWatcher(paths[i], true);
					directoryWatchers[i].start();
				} 
		    	catch (IOException e) {
					e.printStackTrace();
				}    			
			}
		}
    }

    @Override
    public void destroy() throws Exception {
        //LOG.info("Shutting down Hystrix...");
        Hystrix.reset(1, TimeUnit.SECONDS);
        //LOG.info("Shut down Hystrix done.");
    }    
}


/*
@SpringBootApplication
@Configuration("kr.co.digitalship.dprep.Application")
//@Profile("standalone")
@ComponentScan(basePackages = { "org.talend.dataprep", "org.talend.daikon.content",  "org.talend.daikon.security", "org.talend.tenancy",  
		  "kr.co.digitalship.dprep.custom", "kr.co.digitalship.dprep.custom.redis", 
		  "kr.co.digitalship.dprep.custom.schedule", "kr.co.digitalship.dprep.custom.schedule.job", "kr.co.digitalship.dprep.custom.schedule.util" }
		, excludeFilters={
				 @ComponentScan.Filter(type=FilterType.REGEX, pattern = "org\\.springframework\\.boot\\.autoconfigure\\.websocket\\.WebSocketAutoConfiguration.*"),
				 @ComponentScan.Filter(type=FilterType.ASSIGNABLE_TYPE, value=org.talend.daikon.documentation.DocumentationController.class)
		}
)
//@Import(DataPrepComponentScanConfiguration.class)
public class Application extends SpringBootServletInitializer implements DisposableBean {

	DirectoryWatcher[] directoryWatchers = new DirectoryWatcher[3];
	
	//private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);
	
    public static void main(String[] args) {
    	SpringApplication.run(Application.class, args);
    	
		DirectoryWatcher[] directoryWatchers = new DirectoryWatcher[3];
		Path[] paths = new Path[3];
		
		try {
			paths[0] = Paths.get(DirectoryWatcher.class.getClassLoader().getResource("./semantic/dictionary").toURI());
			paths[1] = Paths.get(DirectoryWatcher.class.getClassLoader().getResource("./semantic/metadata").toURI());
			paths[2] = Paths.get(DirectoryWatcher.class.getClassLoader().getResource("./semantic/regex").toURI());
			
			for(int i = 0, len = paths.length; i < len; i++) {
				if(Files.isDirectory(paths[i])) {
			    	try {
						directoryWatchers[i] = new DirectoryWatcher(paths[i], true);
						directoryWatchers[i].start();
					} 
			    	catch (IOException e) {
						e.printStackTrace();
					}    			
				}
			}				
		} 
		catch (URISyntaxException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}    	
    }
    
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    	PropertiesUtil propertiesUtil = new PropertiesUtil();
    	Properties properties = propertiesUtil.getProperties();
    	application.application().setDefaultProperties(properties);
    	
	    //String configLocation = System.getProperty("global.appconf.dir"); //get the default config directory location
  	    ////set the configpath of this application instance exclusively
        //String configPath = configLocation + File.separator + "springApplication"  + File.separator + "application.yml";
        //LOGGER.info("Configpath: " + configPath);
        //LOGGER.info("Starting to run Spring boot app...");
        //
        //if(configLocation != null && !configLocation.isEmpty()) {
	    //    Properties props = new Properties();
	    //    props.setProperty("spring.config.location", configPath); //set the config file to use    
	    //    application.application().setDefaultProperties(props);
        //}
        //else {
        //	LOGGER.info("No global.appconf.dir property found, starting with default on classpath");
        //}

	    return application.sources(Application.class);
    }
    
    @Override
    public void destroy() throws Exception {
    	for(DirectoryWatcher directoryWatcher : directoryWatchers) {
    		if(null != directoryWatcher) {
    			directoryWatcher.stop();
    		}
    	}
        Hystrix.reset(1, TimeUnit.SECONDS);
    }
}
*/