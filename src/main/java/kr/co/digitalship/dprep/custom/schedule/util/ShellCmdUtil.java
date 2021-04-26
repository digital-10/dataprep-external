package kr.co.digitalship.dprep.custom.schedule.util;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.concurrent.Executors;

import javax.annotation.PostConstruct;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import kr.co.digitalship.dprep.custom.PropertiesUtil;

@Component
public class ShellCmdUtil {
	private static final Logger LOGGER = LoggerFactory.getLogger(ShellCmdUtil.class);
	
	@Value("${pipeline.run.script.path:}")
    private String runScriptPath; // 실행경로
	
	@Value("${pipeline.run.script.name:}")
    private String runScriptName; // sh 파일명
	
	@Value("${pipeline.run.script.wait:false}")
    private boolean runScriptWait; // wait 여부	
	
    private class Gobbler implements Runnable {
        private InputStream inputStream;
		private byte[] result;

        public Gobbler(InputStream inputStream) {
            this.inputStream = inputStream;
        }
        
        @Override
        public void run() {        	
            try {
            	result = IOUtils.toByteArray(inputStream);
			} 
            catch (IOException e) {
				e.printStackTrace();
			}
        }
        
        @SuppressWarnings("unused")
		public String getResult() {
        	try {
				return IOUtils.toString(this.result, "UTF-8");
			} catch (IOException e) {
				e.printStackTrace();
			}
        	return null;
        }
    }
    
	@PostConstruct
	public void init() {
		if(StringUtils.isBlank(this.runScriptPath) || StringUtils.isBlank(this.runScriptName)) {
			Properties properties = new PropertiesUtil().getProperties();
			
			this.runScriptPath = properties.getProperty("pipeline.run.script.path");
			this.runScriptName = properties.getProperty("pipeline.run.script.name");
		}
	}
    
    public void execute(String wsId) throws IOException, InterruptedException {
        init();
        
    	if(StringUtils.isBlank(runScriptPath) || StringUtils.isBlank(runScriptName) || StringUtils.isBlank(wsId)) {
    		return;
    	}
    	
        //boolean isWindows = System.getProperty("os.name").toLowerCase().startsWith("windows");

        ProcessBuilder builder = new ProcessBuilder();
        StringBuilder sbuilderCommand = new StringBuilder();
        sbuilderCommand.append("sh -c './");
        sbuilderCommand.append(runScriptName);
        sbuilderCommand.append(" ");
        sbuilderCommand.append(wsId);
        sbuilderCommand.append("'");
/*        
        if (isWindows) {
        	// 현재 사용 필요 없음
            //builder.command("cmd.exe", "/c", "dir");
        } 
        else {
            //builder.command("/bin/sh", "-c", "pwd");
        	//builder.command(runScriptName, wsId);
        	builder.command("/bin/sh", "-c", sbuilderCommand.toString());
        }
*/
        builder.command("/bin/sh", "-c", sbuilderCommand.toString());        
        
        builder.directory(new File(runScriptPath));
        Process process = builder.start();
        
        Gobbler gobbler = new Gobbler(process.getInputStream());
        Executors.newSingleThreadExecutor().submit(gobbler);
/*        
        // 종료까지 기다려야 할 경우
        if(runScriptWait) {
            process.waitFor(); // 0 정상        	
        }
*/
/*        
        process.getErrorStream().close();
        process.getInputStream().close();
        process.getOutputStream().close();
        process.waitFor();
*/
        LOGGER.info("ShellCmdUtil - sh Execute Done");
    }    
}
