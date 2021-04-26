package kr.co.digitalship.dprep.custom;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class Singleton {
	private JsonArray wsIds = null;
	
    private Singleton() {}
    
    public static Singleton getInstance() { 
        return LazyHolder.INSTANCE; 
    } 

    private static class LazyHolder { 
        private static final Singleton INSTANCE = new Singleton(); 
    }

    public JsonArray getWsIds() {
    	if(null == this.wsIds) {
    		this.wsIds = new JsonArray();
    	}
    	return this.wsIds;
    }
    
    public JsonArray setWsIds(JsonArray wsIds) {
    	this.wsIds = wsIds;
    	
    	return this.wsIds; 
    }
    
    public void addWsId(String wsId) {
    	if(null == this.wsIds) {
    		this.wsIds = new JsonArray();
    	}
    	
    	boolean flag = true;
    	for(int i = 0, len = this.wsIds.size(); i < len; i++) {
    		if(wsId.equals(this.wsIds.get(i).getAsJsonObject().get("wsId").getAsString())) {
    			flag = false;
    			break;
    		}
    	}
    	
    	if(flag) {
    		JsonObject gsonObject = new JsonObject();
    		gsonObject.addProperty("wsId", wsId);
    		gsonObject.addProperty("percent", "25");
    		this.wsIds.add(gsonObject);    		
    	}    
    }    
}
