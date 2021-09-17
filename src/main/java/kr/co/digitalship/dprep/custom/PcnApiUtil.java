package kr.co.digitalship.dprep.custom;

import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutionException;

import javax.annotation.PostConstruct;

import org.apache.http.client.utils.URIBuilder;
import org.asynchttpclient.AsyncHttpClient;
import org.asynchttpclient.Dsl;
import org.asynchttpclient.ListenableFuture;
import org.asynchttpclient.Response;
import org.asynchttpclient.DefaultAsyncHttpClientConfig.Builder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

@Component
public class PcnApiUtil {
	@Value("${pcn.api.enabled:false}")
	private boolean pcnApiEnabled;	
	
	@Value("${pcn.api.host:}")
	private String pcnApiHost;
	
	@Value("${pcn.api.id:}")
	private String pcnApiId;
	
	@Value("${pcn.api.secret:}")
	private String pcnApiSecret;
	
	// workId 0, 1, 2, 3 순서
	private String[] work = {"수집", "전처리", "Meta 프로파일링", "시각화 프로파일링"};
	private String[] percent = {"25", "50", "75", "100"};
	private String worker = "디지탈쉽";
	//private String[] worker = {"PCN", "디지탈쉽", "디지탈쉽", "세종대"};
	//private String[] id = {"", pcnApiId, pcnApiId, ""};
	//private String[] secret = {"", pcnApiSecret, pcnApiSecret, ""};
	
	private Builder clientBuilder;
	
	@PostConstruct
	public PcnApiUtil init() {
        clientBuilder = Dsl.config();
        clientBuilder.setRequestTimeout(90000);

    	PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
    	
    	pcnApiEnabled = new Boolean(properties.getProperty("pcn.api.enabled")).booleanValue();
        pcnApiHost = properties.getProperty("pcn.api.host");
        pcnApiId = properties.getProperty("pcn.api.id");
        pcnApiSecret = properties.getProperty("pcn.api.secret");
       
        return this;
	}	
	
	// 토큰키
	public String getAuth() {
		return this.getAuth(false);
	}	
	
	public String getAuth(boolean isTest) {
		if(!isTest && !pcnApiEnabled) {
			return "";
		}
		
		AsyncHttpClient asyncHttpClient = Dsl.asyncHttpClient(clientBuilder);
		
    	try {
			URIBuilder uriBuilder = new URIBuilder(pcnApiHost);
			uriBuilder.setPath("/api/auth/login");
			
			JsonObject gsonObject = new JsonObject();
			gsonObject.addProperty("id", pcnApiId);
			gsonObject.addProperty("secret", pcnApiSecret);
			
			ListenableFuture<Response> future = asyncHttpClient.preparePost(uriBuilder.toString())
			        .setHeader(CONTENT_TYPE, "application/json;charset=UTF-8")
			        .addHeader(ACCEPT, "application/json")
			        .setBody(gsonObject.toString())
			        .execute(); 
			
			Response response = future.get();
			
			if(HttpStatus.OK == HttpStatus.valueOf(response.getStatusCode())) {
				gsonObject = new JsonParser().parse(response.getResponseBody()).getAsJsonObject();
				
				if("success".equals(gsonObject.get("result").getAsString())) {
					return gsonObject.get("body").getAsJsonObject().get("token").getAsString();					
				}
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
    	return "";		
	}
	
	public String getWsId(String token) {
		Singleton singleton = Singleton.getInstance();
		JsonArray gsonArray = singleton.getWsIds();
		
		if(null == gsonArray || 0 == gsonArray.size()) {
			if(pcnApiEnabled) {
		    	AsyncHttpClient asyncHttpClient = Dsl.asyncHttpClient(clientBuilder);
		    	
		    	try {    		
					URIBuilder uriBuilder = new URIBuilder(pcnApiHost);
					uriBuilder.setPath("/api/wss/incom");
					
					ListenableFuture<Response> future = asyncHttpClient.prepareGet(uriBuilder.toString())
					        .setHeader(CONTENT_TYPE, "application/json;charset=UTF-8")
					        .addHeader(ACCEPT, "application/json")
					        .setHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", token))
					        .execute();
					
					Response response = future.get();

					JsonObject gsonObject = new JsonParser().parse(response.getResponseBody()).getAsJsonObject();
					
					if("success".equals(gsonObject.get("result").getAsString())) {
						gsonArray = singleton.setWsIds(this.sorted(gsonObject.get("body").getAsJsonArray(), "wsId", "asc"));
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
			}			
		}
		else {
			gsonArray = singleton.setWsIds(this.sorted(gsonArray, "wsId", "asc"));
		}
		
		return this.extractWsId(gsonArray);
	}
	
	public String getWsId() {
		JsonArray gsonArray = Singleton.getInstance().getWsIds();
		
		if(null == gsonArray || 0 == gsonArray.size()) {
			return "";
		}
		else {
			return this.extractWsId(gsonArray);
		}
	}
	
	public String getNextWsId(String token) {
		JsonArray gsonArray = Singleton.getInstance().getWsIds();
		
		if(null == gsonArray || 0 == gsonArray.size()) {
			return this.getWsId(token);
		}
		else {
			gsonArray.remove(0);
			if(0 == gsonArray.size()) {
				return this.getWsId(token);
			}
			else {
				return this.extractWsId(gsonArray);				
			}
		}
	}	
	
	private JsonArray sorted(JsonArray gsonArray, String key, String sortType) {
		JsonArray sortedJsonArray = new JsonArray();
	    List<JsonObject> jsonValues = new ArrayList<JsonObject>();
	    
	    for(int i = 0; i < gsonArray.size(); i++) {
	    	JsonObject gsonObject = gsonArray.get(i).getAsJsonObject();
	    	
			if(25 != gsonObject.get("percent").getAsInt()) {
				continue;
			}
	    	
	        jsonValues.add(gsonArray.get(i).getAsJsonObject());
	    }
	    
	    if(1 < jsonValues.size()) {
		    Collections.sort(jsonValues, new Comparator<JsonObject>() {
		        @Override
		        public int compare(JsonObject a, JsonObject b) {
		            String valA = new String();
		            String valB = new String();

		            valA = (String) a.get(key).getAsString();
		            valB = (String) b.get(key).getAsString();

		            if("desc".equals(sortType.toLowerCase())) {
		            	return -valA.compareTo(valB);
		            }
		            else {
		            	return valA.compareTo(valB);	            	
		            }
		        }
		    });
	    }
	    
	    if(0 < jsonValues.size()) {
		    for(int i = 0; i < jsonValues.size(); i++) {
		        sortedJsonArray.add(jsonValues.get(i));
		    }	    	
	    }
	    
	    return sortedJsonArray;
	}
	
	private String extractWsId(JsonArray gsonArray) {
		String wsId = "";
		if(null != gsonArray && 0 < gsonArray.size()) {
			wsId = gsonArray.get(0).getAsJsonObject().get("wsId").getAsString();
		}
		return wsId;
	}	
	
	public JsonObject getWorkspace(String token, int wsId) {
		if(!pcnApiEnabled) {
			return null;
		}
		
    	AsyncHttpClient asyncHttpClient = Dsl.asyncHttpClient(clientBuilder);
    	
    	try {
			URIBuilder uriBuilder = new URIBuilder(pcnApiHost);
			uriBuilder.setPath(String.format("/api/wss/%s", wsId));
			
			ListenableFuture<Response> future = asyncHttpClient.prepareGet(uriBuilder.toString())
			        .setHeader(CONTENT_TYPE, "application/json;charset=UTF-8")
			        .addHeader(ACCEPT, "application/json")
			        .setHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", token))
			        .execute();
			
			Response response = future.get();
			
			if(HttpStatus.OK == HttpStatus.valueOf(response.getStatusCode())) {
				JsonObject gsonObject = new JsonParser().parse(response.getResponseBody()).getAsJsonObject();
				
				if("success".equals(gsonObject.get("result").getAsString())) {
					return gsonObject;					
				}
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
    	return null;
	}
	
	// 작업 상태 업데이트 
	public String updateWorkStatus(String token, int wsId, int workId, String filePath) {
		if(!pcnApiEnabled) {
			return "";
		}
		
    	AsyncHttpClient asyncHttpClient = Dsl.asyncHttpClient(clientBuilder);
    	
    	try {
			URIBuilder uriBuilder = new URIBuilder(pcnApiHost);
			uriBuilder.setPath("/api/wss/works");
			
			JsonObject gsonObject = new JsonObject();
			
			JsonObject gsonObjectSub1 = new JsonObject();
			gsonObjectSub1.addProperty("workId", workId); // 작업 아이디 (required) (0 수집, 1 전처리, 2 Meta 프로파일링, 3 시각화 프로파일링)
			gsonObjectSub1.addProperty("wsId", wsId);     // 워크스페이스 아이디 (required)
			
			gsonObject.add("worksMultiId", gsonObjectSub1);
			
			JsonObject gsonObjectSub2 = new JsonObject();
			gsonObjectSub2.addProperty("userId", pcnApiId);       // Lock 활성화 사용자 아이디
			gsonObjectSub2.addProperty("userName", worker);     // Lock 활성화 사용자
			//gsonObjectSub2.addProperty("userPwd", secret[workId]);  // Lock 활성화 사용자 패스워드
			//gsonObjectSub2.addProperty("company", worker[workId]);  // Lock 활성화 사용자 소속
			//gsonObjectSub2.addProperty("position", "");             // Lock 활성화 사용자 직책
			
			gsonObject.add("lockActiveUser", gsonObjectSub2);
			
			gsonObject.addProperty("filePath", filePath);     // 파일 위치
			//gsonObject.addProperty("thput", thput);         // 데이터 처리량
			gsonObject.addProperty("worker", worker);       // 작업자
			gsonObject.addProperty("workerCmt", String.format("%s 작업 완료", work[workId])); // 작업 코멘트
			//gsonObject.addProperty("crtDt", "");            // 작업 생성 날짜
			gsonObject.addProperty("modDt", getNow());        // 작업 수정 날짜
			gsonObject.addProperty("finishYn", "Y");          // 작업 완료 여부 (required) (Default Value : N)    	
			    	
			ListenableFuture<Response> future = asyncHttpClient.preparePost(uriBuilder.toString())
			        .setHeader(CONTENT_TYPE, "application/json;charset=UTF-8")
			        .addHeader(ACCEPT, "application/json")
			        .setHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", token))
			        .setBody(gsonObject.toString())
			        .execute();
			
			Response response = future.get();
			
			if(HttpStatus.OK == HttpStatus.valueOf(response.getStatusCode())) {
				return "success";
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
    	return "";
	}
	
	// 워크스페이스 상태 업데이트
	public String updateWorkspaceWorkStatus(String token, int wsId, int workId) {
		if(!pcnApiEnabled) {
			return "";
		}
		
    	AsyncHttpClient asyncHttpClient = Dsl.asyncHttpClient(clientBuilder);
    	
    	JsonObject gsonObject;
		try {
			URIBuilder uriBuilder = new URIBuilder(pcnApiHost);
			uriBuilder.setPath(String.format("/api/wss/%s/stats", wsId));
			
			gsonObject = new JsonObject();
			gsonObject.addProperty("wsId", wsId);                                        // 워크스페이스 아이디
			//gsonObject.addProperty("wsName", "");                                        // 워크스페이스 이름
			//gsonObject.addProperty("wsDs", "");                                          // 워크스페이스 설명
			gsonObject.addProperty("lastWork", String.format("%s 작업", work[workId]));  // 마지막 작업 (required)
			gsonObject.addProperty("lastWorkComt", String.format("%s 작업 완료", work[workId])); // 마지막 작업 코멘트
			//gsonObject.addProperty("wsCrtDt", "");                                       // 워크스페이스 생성 날짜 (형태 : 2020-09-29 17:54:39)
			gsonObject.addProperty("wsModDt", getNow());                                 // 워크스페이스 수정 날짜 (형태 : 2020-09-29 17:54:39)
			gsonObject.addProperty("percent", percent[workId]);                          // 진철률 (required) (Default Value : 0)
			gsonObject.addProperty("userLockYn", "\u0000");                                   // 사용자 Lock 여부 (Default Value : N)
			//gsonObject.addProperty("logFilePath", "");                                   // 로그 파일 경로
			//gsonObject.addProperty("lastWorker", worker[workId]);                        // 마지막 작업자
			
			ListenableFuture<Response> future = asyncHttpClient.preparePut(uriBuilder.toString())
			        .setHeader(CONTENT_TYPE, "application/json;charset=UTF-8")
			        .addHeader(ACCEPT, "application/json")
			        .setHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", token))
			        .setBody(gsonObject.toString())
			        .execute();
			
			Response response = future.get();
			
			if(HttpStatus.OK == HttpStatus.valueOf(response.getStatusCode())) {
				return "success";
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
		return "";
	}	
	
	public static String getNow() {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.KOREA);
		return simpleDateFormat.format(new Date());
	}	
}
