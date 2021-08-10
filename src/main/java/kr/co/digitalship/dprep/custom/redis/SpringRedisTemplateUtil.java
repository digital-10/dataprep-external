package kr.co.digitalship.dprep.custom.redis;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;

@Component
public class SpringRedisTemplateUtil {
    /**
     * [ Redis 에 저장할 데이터의 key 정의 ]
     * preparationId : 
     *     datasetId : 
     *     uniqueId : 
     *     stepId : 
     *     
     * preparationId_datasetId : 캐시 ( transfomation_... )
     * preparationId_datasetId_head : 캐시 ( transfomation_..._HEAD... )
     */	

	// redis 사용 여부
	@Value("${spring.redis.enabled:false}")
    private boolean enabled;
	
	//@Value("${spring.redis.transformation.enabled:false}")
    //private boolean transfomationEnabled;
	
	@Value("${content-service.store.local.path:}")
    private String localPath;
	
	@Value("${dataset.metadata.store.file.location:}")
    private String metadataFileLocation;
	
	@Value("${preparation.store.file.location}")
    private String preparationFileLocation;

    public boolean getEnabled() {
		return enabled;
	}
/*    
    public boolean getTransfomationEnabled() {
		return transfomationEnabled;
	}    
*/    
    public String getLocalPath() {
		return localPath;
	}

	public String getMetadataFileLocation() {
		return metadataFileLocation;
	}

	public String getPreparationFileLocation() {
		return preparationFileLocation;
	}

	////////////////////////////////////////////////////////////////////////////	

    private RedisTemplate<String, Object> redisTemplate;

    @PostConstruct
    public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
        enabled = Boolean.parseBoolean(properties.getProperty("spring.redis.enabled"));
        //transfomationEnabled = Boolean.parseBoolean(properties.getProperty("spring.redis.transformation.enabled"));
        localPath = properties.getProperty("content-service.store.local.path");
        metadataFileLocation = properties.getProperty("dataset.metadata.store.file.location");
        preparationFileLocation = properties.getProperty("preparation.store.file.location");    		
    }
    
    @Autowired    
    public SpringRedisTemplateUtil(RedisTemplate<String, Object> redisTemplate) {
    	this.redisTemplate = redisTemplate;
    }    
    
    public SpringRedisTemplateUtil() {
    	init();
    }
    
	public SpringRedisTemplateUtil setRedisTemplate(RedisTemplate<String, Object> redisTemplate) {
		this.redisTemplate = redisTemplate;
		return this;
	}
/*    
    //@PreDestroy
    public void close() {
    	redisTemplate.execute(new RedisCallback<Void>() {
			@Override
			public Void doInRedis(RedisConnection connection) throws DataAccessException {
				return null;
			}
		});
    }
*/    
    public RedisTemplate<String, Object> getRedisTemplate() {
    	return redisTemplate;
    }
    
    public boolean delete(String key) {
    	return redisTemplate.delete(key);
    }
    
    public long delete(List<String> keys) {
    	return redisTemplate.delete(keys);
    }

    /**
     * ValueOperations
     */
    public void valueSet(String key, Object value) {
    	redisTemplate.opsForValue().set(key, value);
    }
    
    public Object valueGet(String key) {
    	return redisTemplate.opsForValue().get(key);
    }

    /**
     * SetOperations
     */    
    public void setAdd(String key, Object value) {
    	redisTemplate.opsForSet().add(key, value);
    }
    
    public List<Object> setRange(String key) {
    	return new ArrayList<Object>(redisTemplate.opsForSet().members(key));
    }
    
    public boolean setIsMember(String key, Object Value) {
    	return redisTemplate.opsForSet().isMember(key, Value);
    }
    
    /**
     * ZSetOperations
     */    
    public void setZSet(String key, Object value) {
    	ZSetOperations<String, Object> zSetOperations = redisTemplate.opsForZSet();
    	zSetOperations.add(key, value, zSetOperations.size(key));
    }
    
    public List<Object> getZsetAll(String key) {
    	return new ArrayList<Object>(redisTemplate.opsForZSet().reverseRange(key, 0, -1));
    }
}
