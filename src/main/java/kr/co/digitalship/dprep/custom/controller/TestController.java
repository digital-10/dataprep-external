package kr.co.digitalship.dprep.custom.controller;

import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.TEXT_PLAIN_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.util.Enumeration;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.http.client.utils.URIBuilder;
import org.asynchttpclient.AsyncHttpClient;
import org.asynchttpclient.Dsl;
import org.asynchttpclient.ListenableFuture;
import org.asynchttpclient.Response;
import org.asynchttpclient.DefaultAsyncHttpClientConfig.Builder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

import kr.co.digitalship.dprep.custom.PcnApiUtil;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.SJDprepHttpUtil;
import kr.co.digitalship.dprep.custom.Singleton;
import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;
import kr.co.digitalship.dprep.custom.schedule.util.HadoopUtil;
import kr.co.digitalship.dprep.custom.tests.TestVo;

@Controller
public class TestController {
	private static final Logger LOGGER = LoggerFactory.getLogger(TestController.class);
	
	@Autowired
	HadoopUtil hadoopUtil;
	
	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private PcnApiUtil pcnApiUtil;	
	
	/**
	 * Hadoop Write 테스트
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/test/connect/hadoop", method = GET, produces = APPLICATION_JSON_VALUE)
	public String testConnectHadoop() {
		String content = "Hadoop Write Disable";
		
		FileSystem fs = hadoopUtil.getFs();
		try {
			hadoopUtil.write(fs, "Hadoop Write Enable", "", "", "HADOOP_WRITE.TEST");
			
			FSDataInputStream FSDataInputStream = fs.open(new Path("/HADOOP_WRITE.TEST"));
			content = IOUtils.toString(FSDataInputStream, "UTF-8");
			
			fs.delete(new Path("/HADOOP_WRITE.TEST"), false);
		} 
		catch (Exception e) {
			e.printStackTrace();
			LOGGER.debug(String.format("testConnectHadoop Error %s", e.getMessage()));
		}
		finally {
			if(fs != null) try { fs.close(); } catch (IOException e) {}
		}
		
		return content;
	}

	/**
	 * Redis Write 테스트
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@RequestMapping(value = "/test/connect/redis", method = GET, produces = APPLICATION_JSON_VALUE)
	public String testConnectRedis() {
		String result = "Redis Connect Disable";
		
		try {
			springRedisTemplateUtil.valueSet("REDIS_CONNECT_TEST", "Redis Connect Enable");
			
			result = (String)springRedisTemplateUtil.valueGet("REDIS_CONNECT_TEST");
			springRedisTemplateUtil.delete("REDIS_CONNECT_TEST");
		} 
		catch (Exception e) {
			e.printStackTrace();
			LOGGER.debug(String.format("testConnectRedis Error %s", e.getMessage()));
		}
		
		return result;
	}
	
	/**
	 * Pcn Api 테스트
	 * @return
	 * @throws Exception
	 * 
	 * step은 1 - 전처리완료, 2 - 메타프로파일링 완료
	 */
	@ResponseBody
	@RequestMapping(value = "/test/connect/pcnApi", method = GET, produces = APPLICATION_JSON_VALUE)
	public String testPcnApi(@RequestParam(defaultValue = "", required = false) String step, @RequestParam(defaultValue = "", required = false) String wsId) {
		String result = "Pcn Api Connect Disable";
		
		try {
			String token = pcnApiUtil.getAuth(true);
			if(StringUtils.isNotBlank(token)) {
				if(StringUtils.isNotBlank(step) && StringUtils.isNotBlank(wsId)) {
					result = pcnApiUtil.updateWorkStatus(token, Integer.parseInt(wsId), Integer.parseInt(step), ""); // 경로를 넣어줘야 할지도.
					if("success".equals(result)) {
						result = pcnApiUtil.updateWorkspaceWorkStatus(token, Integer.parseInt(wsId), Integer.parseInt(step));
						if(!"success".equals(result)) {
							result = String.format("Pcn Api updateWorkspaceWorkStatus fail (%s)", token);
						}
					}
					else {
						result = String.format("Pcn Api updateWorkStatus fail (%s)", token);
					}					
				}
				else {
					result = String.format("Pcn Api Connect Enable (%s)", token);
				}
			}
		} 
		catch (Exception e) {
			e.printStackTrace();
			LOGGER.debug(String.format("testPcnApi Error %s", e.getMessage()));
		}
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping(value = "/test/connect/checkIp", method = GET, produces = TEXT_PLAIN_VALUE)
	public String testCheckIp() {
	    String ip = null;
	    HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.currentRequestAttributes()).getRequest();

        ip = request.getHeader("X-Forwarded-For");
        
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
            ip = request.getHeader("Proxy-Client-IP"); 
        } 
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
            ip = request.getHeader("WL-Proxy-Client-IP"); 
        } 
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
            ip = request.getHeader("HTTP_CLIENT_IP"); 
        } 
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
            ip = request.getHeader("HTTP_X_FORWARDED_FOR"); 
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
            ip = request.getHeader("X-Real-IP"); 
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
            ip = request.getHeader("X-RealIP"); 
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
            ip = request.getHeader("REMOTE_ADDR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
            ip = request.getRemoteAddr(); 
        }
        if ("127.0.0.1".equals(ip) || "0:0:0:0:0:0:0:1".equals(ip)) { 
            Enumeration netInterfaces = null;
            try {
                netInterfaces = NetworkInterface.getNetworkInterfaces();
            } catch (SocketException e) {
                return getLocalIp();
            }

            while (netInterfaces.hasMoreElements()) {
                NetworkInterface ni = (NetworkInterface)netInterfaces.nextElement();
                Enumeration address = ni.getInetAddresses();
                if (address == null) {
                    return getLocalIp();
                }
                while (address.hasMoreElements()) {
                    InetAddress addr = (InetAddress)address.nextElement();
                    //if (!addr.isLoopbackAddress() && !addr.isSiteLocalAddress() && !addr.isAnyLocalAddress() ) {
                    if (addr.isSiteLocalAddress()) {
                        ip = addr.getHostAddress();
                        if( ip.indexOf(".") != -1 && ip.indexOf(":") == -1 ){
                            return ip;
                        }
                    }
                }
            }
            return getLocalIp();
        }
		
		return ip;
	}
	
    private String getLocalIp() {
        try {
            return InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            return null;
        }
    }
	
	@ResponseBody
	@RequestMapping(value = "/test/connect/checkIp2", method = GET, produces = TEXT_PLAIN_VALUE)
	public String testCheckIp2() {
		Builder clientBuilder  = Dsl.config();
        clientBuilder.setRequestTimeout(600000); // default 60000
        clientBuilder.setReadTimeout(600000); // default 60000
        clientBuilder.setConnectTimeout(50000); // default 5000
        clientBuilder.setPooledConnectionIdleTimeout(600000); // default 60000
		
	    String ip = null;

		AsyncHttpClient asyncHttpClient = Dsl.asyncHttpClient(clientBuilder);
		
    	try {
			URIBuilder uriBuilder = new URIBuilder("http://bot.whatismyipaddress.com");
			
			ListenableFuture<Response> future = asyncHttpClient.prepareGet(uriBuilder.toString()).execute(); 			
			Response response = future.get();
			
			if(HttpStatus.OK == HttpStatus.valueOf(response.getStatusCode())) {
				return response.getResponseBody();					
			}
		} 
    	catch (JsonSyntaxException | URISyntaxException | InterruptedException | ExecutionException e) {
			e.printStackTrace();
		}
    	finally {
    		if(null != asyncHttpClient) {
    			try { asyncHttpClient.close(); } catch (IOException e) {}    			
    		}
    	}
		
		return ip;
	}	
	
	@RequestMapping(value = "/thymeleafTest", method = GET, produces = TEXT_PLAIN_VALUE) 
	public String thymeleafTest(@RequestParam(defaultValue = "", required = false) String aaa, Model model) {
		System.out.println("=============================");
		System.out.println(System.getProperty("java.class.path"));
		
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		System.out.println(properties.getProperty("spring.thymeleaf.enabled"));
		System.out.println(properties.getProperty("spring.thymeleaf.view-names"));
		System.out.println(properties.getProperty("spring.thymeleaf.prefix"));
		System.out.println(properties.getProperty("spring.thymeleaf.suffix"));
		System.out.println(properties.getProperty("spring.thymeleaf.cache"));
		System.out.println(properties.getProperty("spring.thymeleaf.check-template-location"));
		System.out.println("=============================");
		
		TestVo testModel = new TestVo("view", "thymeleaf") ;
		model.addAttribute("testModel", testModel);
		model.addAttribute("aaa", aaa); 
		
		return "thymeleaf/thymeleafTest"; 
	}

	// 
	@RequestMapping(value = "/meta/view/{wsId}", method = GET, produces = TEXT_PLAIN_VALUE) 
	public String viewMeta(@PathVariable(value = "wsId") String wsId, Model model) {		
		model.addAttribute("wsId", wsId); 
		
		return "thymeleaf/metaProfiling"; 
	}
}
