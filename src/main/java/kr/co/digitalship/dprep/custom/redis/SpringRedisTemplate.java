package kr.co.digitalship.dprep.custom.redis;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import io.lettuce.core.ClientOptions;
import io.lettuce.core.resource.ClientResources;
import io.lettuce.core.resource.DefaultClientResources;
import kr.co.digitalship.dprep.custom.PropertiesUtil;
import kr.co.digitalship.dprep.custom.Singleton;

@Configuration
@PropertySource(value = {
		"classpath:/org/talend/dataprep/configuration/default.properties",
		"classpath:default.properties",
		"classpath:application.properties",
		"default.properties",
		"application.properties"
}, ignoreResourceNotFound = true)
@EnableRedisRepositories(basePackages = {"org.springframework.data.redis.connection.lettuce"})
public class SpringRedisTemplate {
	@Value("${spring.redis.enabled:false}")
	private boolean enabled;
	
	@Value("${spring.redis.transformation.enabled:false}")
	private boolean transfomationEnabled;
	
    @Value("${spring.redis.host:}")
    private String redisHost;

    @Value("${spring.redis.port:0}")
    private int redisPort;
    
    @Value("${spring.redis.password:}")
    private String redisPassword;
    
    @PostConstruct
    public void init() {
		PropertiesUtil properties = Singleton.getInstance().getPropertiesUtil();
		
		transfomationEnabled = Boolean.parseBoolean(properties.getProperty("spring.redis.transformation.enabled"));
		redisHost = properties.getProperty("spring.redis.host");
		redisPort = Integer.parseInt(properties.getProperty("spring.redis.port"));
		redisPassword = properties.getProperty("spring.redis.password");
    }    
/*
    @Bean
	public RedisConnectionFactory redisConnectionFactory() {
		RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
		redisStandaloneConfiguration.setHostName(redisHost);
		redisStandaloneConfiguration.setPort(redisPort);
		redisStandaloneConfiguration.setPassword(redisPassword);
		
    	LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory(redisStandaloneConfiguration);
    	lettuceConnectionFactory.afterPropertiesSet();    	
		
		return lettuceConnectionFactory;
	}

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        redisTemplate.setDefaultSerializer(new StringRedisSerializer());                // Defaults to JdkSerializationRedisSerializer.        
        //redisTemplate.setHashKeySerializer(new StringRedisSerializer());                // Defaults to getDefaultSerializer().
        redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer()); // Defaults to getDefaultSerializer().
        //redisTemplate.setKeySerializer(new StringRedisSerializer());                    // Defaults to getDefaultSerializer().
        //redisTemplate.setStringSerializer(new StringRedisSerializer());                 // Defaults to StringRedisSerializer.
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());     // Defaults to getDefaultSerializer().

        return redisTemplate;
    }
*/
    
    @Bean(destroyMethod = "shutdown")
    ClientResources clientResources() {
        return DefaultClientResources.create();
    }

    @Bean
    public RedisStandaloneConfiguration redisStandaloneConfiguration() {
		RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
		redisStandaloneConfiguration.setHostName(redisHost);
		redisStandaloneConfiguration.setPort(redisPort);
		
		if(StringUtils.isNotBlank(redisPassword)) {
			redisStandaloneConfiguration.setPassword(redisPassword);			
		}
		
		return redisStandaloneConfiguration;
    }

    @Bean
    public ClientOptions clientOptions(){
        return ClientOptions.builder()
                .disconnectedBehavior(ClientOptions.DisconnectedBehavior.REJECT_COMMANDS)
                .autoReconnect(true)
                .build();
    }
    
    @SuppressWarnings("rawtypes")
	@Bean
    LettucePoolingClientConfiguration lettucePoolConfig(ClientOptions options, ClientResources dcr) {
    	GenericObjectPoolConfig config = new GenericObjectPoolConfig();
    	config.setMaxTotal(10);
    	
        return LettucePoolingClientConfiguration.builder()
                .poolConfig(config)
                .clientOptions(options)
                .clientResources(dcr)
                .build();
    }

    @Bean
    public RedisConnectionFactory connectionFactory(RedisStandaloneConfiguration redisStandaloneConfiguration,
                                                    LettucePoolingClientConfiguration lettucePoolConfig) {
    	LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory(redisStandaloneConfiguration, lettucePoolConfig);
    	lettuceConnectionFactory.afterPropertiesSet();    	
    	lettuceConnectionFactory.setShareNativeConnection(false);
    	
        return lettuceConnectionFactory;
    }

    @Bean
    @ConditionalOnMissingBean(name = "redisTemplate")
    @Primary
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        template.setDefaultSerializer(new StringRedisSerializer());                // Defaults to JdkSerializationRedisSerializer.        
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer()); // Defaults to getDefaultSerializer().
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());     // Defaults to getDefaultSerializer().        
        
        return template;
    }        
}
