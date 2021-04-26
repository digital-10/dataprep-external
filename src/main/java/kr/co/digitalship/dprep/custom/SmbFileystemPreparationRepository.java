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

package kr.co.digitalship.dprep.custom;

import static org.apache.commons.lang.StringUtils.startsWith;

import java.io.IOException;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.util.Arrays;
import java.util.Objects;
import java.util.Properties;
import java.util.stream.Stream;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import javax.annotation.PostConstruct;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.talend.daikon.exception.ExceptionContext;
import org.talend.dataprep.api.preparation.Identifiable;
import org.talend.dataprep.exception.TDPException;
import org.talend.dataprep.exception.error.CommonErrorCodes;
import org.talend.dataprep.preparation.store.ObjectPreparationRepository;
import org.talend.dataprep.preparation.store.PreparationRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

import jcifs.smb1.smb1.NtlmPasswordAuthentication;
import jcifs.smb1.smb1.SmbException;
import jcifs.smb1.smb1.SmbFile;
import jcifs.smb1.smb1.SmbFileInputStream;
import jcifs.smb1.smb1.SmbFileOutputStream;


/**
 * File system implementation of preparation repository.
 */
@Component
@ConditionalOnProperty(name = "preparation.store", havingValue = "smbfile")
public class SmbFileystemPreparationRepository extends ObjectPreparationRepository {

    /** This class' logger. */
    private static final Logger LOG = LoggerFactory.getLogger(SmbFileystemPreparationRepository.class);

    /** The dataprep ready jackson builder. */
    @Autowired
    private ObjectMapper mapper;

    /** Where to store the dataset metadata */
    @Value("${preparation.store.file.location:}")
    private String preparationsLocation;

    @Value("${smb.host:}")
    private String smbHost;
    
    @Value("${smb.user:}")
    private String smbUser;
    
    @Value("${smb.password:}")
    private String smbPassword;
    
    @Value("${smb.sharedDir:}")
    private String smbSharedDir;    
    
    private NtlmPasswordAuthentication ntlmPasswordAuthentication;
    
    private String smbPreparationsLocation;
    /**
     * Make sure the root folder is there.
     */
    @PostConstruct
    private void init() {
        if(StringUtils.isBlank(preparationsLocation)) {
        	Properties properties = new PropertiesUtil().getProperties();
        	
        	preparationsLocation = properties.getProperty("preparation.store.file.location");
        	smbHost = properties.getProperty("smb.host");
        	smbUser = properties.getProperty("smb.user");
        	smbPassword = properties.getProperty("smb.password");
        	smbSharedDir = properties.getProperty("smb.sharedDir");
        }    	
    	
        try {
			getRootFolder().mkdirs();
		} catch (SmbException e) {
			e.printStackTrace();
		}
    }

    /**
     * @see PreparationRepository#add(Identifiable)
     */
    @Override
    public void add(Identifiable object) {

        // defensive programming
        if (object == null) {
            LOG.warn("cannot save null...");
            return;
        }

        final SmbFile outputFile = getIdentifiableFile(object);
        
        try {
        	if(!outputFile.exists()) {
            	final OutputStream out = outputFile.getOutputStream();  
            	IOUtils.closeQuietly(out);
        	}
        	outputFile.setLastModified(System.currentTimeMillis());
        } 
        catch (IOException e) {
            LOG.error("Unable to prepare file for {}.", object, e);
        }

        try (GZIPOutputStream output = new GZIPOutputStream(new SmbFileOutputStream(outputFile))) {
            mapper.writer().writeValue(output, object);
        } 
        catch (IOException e) {
            LOG.error("Error saving {}", object, e);
            throw new TDPException(CommonErrorCodes.UNABLE_TO_SAVE_PREPARATION, e,
                    ExceptionContext.build().put("id", object.id()));
        }
        LOG.debug("{} #{} saved", object.getClass().getSimpleName(), object.id());
    }

    @Override
    public <T extends Identifiable> Stream<T> source(Class<T> clazz) {
        SmbFile[] files;
		try {
			files = getRootFolder().listFiles();
	        if (files == null) {
	            LOG.error("error listing preparations");
	            files = new SmbFile[0];
	        }
	        final Stream<SmbFile> stream = Arrays.stream(files);
	        return stream.filter(file -> startsWith(file.getName(), clazz.getSimpleName())) //
	                .map(file -> read(file.getName(), clazz)) // read all files
	                .filter(Objects::nonNull) // filter out null entries
	                .filter(entry -> clazz.isAssignableFrom(entry.getClass())) // filter out the unwanted objects (should not be
	                                                                           // necessary but you never know)
	                .onClose(stream::close);			
		} catch (SmbException e) {
			e.printStackTrace();
		}
		return null;
    }

    private <T extends Identifiable> T read(String id, Class<T> clazz) {

        final SmbFile from = getIdentifiableFile(clazz, id);
        if (from.getName().startsWith(".")) {
            LOG.info("Ignore hidden file {}", from.getName());
            return null;
        }
        
        try {
			if (!from.exists()) {
			    LOG.debug("{} #{} not found in file system", clazz.getSimpleName(), id);
			    return null;
			}
		} catch (SmbException e) {
			e.printStackTrace();
		}

        T result;
        try (GZIPInputStream input = new GZIPInputStream(new SmbFileInputStream(from))) {
            result = mapper.readerFor(clazz).readValue(input);
        } catch (IOException e) {
            LOG.error("error reading preparation file {}", from.getUncPath(), e);
            return null;
        }

        return result;
    }

    /**
     * @see PreparationRepository#clear()
     */
    @Override
    public void clear() {
        // clear all files
		try {
			SmbFile[] preparations = getRootFolder().listFiles();
	        if (preparations != null) {
	            for (SmbFile file : preparations) {
	                file.delete();
	            }
	        }			
		} catch (SmbException e) {
			e.printStackTrace();
		}
        LOG.debug("preparation repository cleared");
    }

    /**
     * @see PreparationRepository#remove(Identifiable)
     */
    @Override
    public void remove(Identifiable object) {
        if (object == null) {
            return;
        }
        final SmbFile smbFile = getIdentifiableFile(object);
        try {
			smbFile.delete();
		} catch (SmbException e) {
			e.printStackTrace();
		}
        
        LOG.debug("identifiable {} #{} removed", object.getClass().getSimpleName(), object.id());
    }

    private SmbFile getIdentifiableFile(Identifiable object) {
        return getIdentifiableFile(object.getClass(), object.id());
    }

    /**
     * Return the file that matches the given identifiable id.
     *
     * @param clazz the identifiable class.
     * @param id the identifiable... id !
     * @return the file where to read/write the identifiable object.
     */
    @SuppressWarnings("rawtypes")
	private SmbFile getIdentifiableFile(Class clazz, String id) {
        try {
			return new SmbFile(smbPreparationsLocation + '/' + clazz.getSimpleName() + '-' + stripOptionalPrefix(clazz, id), getNtlmPasswordAuthentication());
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
        return null;
    }

    /**
     * Remove the optional classname prefix if the given id already has it.
     *
     * For instance : "Preparation-a99a05a862c6a220d7977f97cd9cb3f71d640592" returns
     * "a99a05a862c6a220d7977f97cd9cb3f71d640592" "a99a05a862c6a220d7977f97cd9cb3f71d640592" returns
     * "a99a05a862c6a220d7977f97cd9cb3f71d640592"
     *
     * @param clazz the class of the wanted object.
     * @param id the object id.
     * @return the id striped of the classname prefix if needed.
     */
    @SuppressWarnings("rawtypes")
	private String stripOptionalPrefix(Class clazz, String id) {

        if (StringUtils.isBlank(id)) {
            return null;
        }

        final String className = clazz.getSimpleName();
        if (id.startsWith(className)) {
            return id.substring(className.length() + 1);
        }
        return id;
    }
    /**
     * Return the root folder where the preparations are stored.
     *
     * @return the root folder.
     */
    private NtlmPasswordAuthentication getNtlmPasswordAuthentication() {
    	if(null == ntlmPasswordAuthentication) {
    		ntlmPasswordAuthentication = new NtlmPasswordAuthentication(null, smbUser, smbPassword);
    	}
    	return ntlmPasswordAuthentication;
    }
    
    private SmbFile getRootFolder() {
    	if(null == smbPreparationsLocation) {
    		smbPreparationsLocation = "smb://" + smbHost + "/" + smbSharedDir + preparationsLocation + "/";    		
    	}
    	
        try {
        	return new SmbFile(smbPreparationsLocation, getNtlmPasswordAuthentication());
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		return null;
    }
}
