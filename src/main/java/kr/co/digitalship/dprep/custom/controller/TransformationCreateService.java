package kr.co.digitalship.dprep.custom.controller;

import static java.util.Collections.emptyList;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.talend.daikon.exception.ExceptionContext.build;
//import static org.talend.dataprep.exception.error.DataSetErrorCodes.INVALID_DATASET_NAME;
import static org.talend.dataprep.exception.error.DataSetErrorCodes.MAX_STORAGE_MAY_BE_EXCEEDED;
import static org.talend.dataprep.exception.error.DataSetErrorCodes.UNABLE_CREATE_DATASET;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.apache.commons.compress.utils.IOUtils;
import org.apache.commons.io.output.NullOutputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
//import org.talend.daikon.exception.ExceptionContext;
import org.talend.dataprep.api.dataset.DataSetLocation;
import org.talend.dataprep.api.dataset.DataSetMetadata;
import org.talend.dataprep.api.dataset.location.locator.DataSetLocatorService;
import org.talend.dataprep.dataset.DataSetMetadataBuilder;
//import org.talend.dataprep.dataset.event.DatasetImportedEvent;
import org.talend.dataprep.dataset.service.BaseDataSetService;
import org.talend.dataprep.dataset.service.analysis.DataSetAnalyzer;
import org.talend.dataprep.dataset.service.analysis.asynchronous.BackgroundAnalysis;
import org.talend.dataprep.dataset.store.QuotaService;
import org.talend.dataprep.dataset.store.content.StrictlyBoundedInputStream;
import org.talend.dataprep.exception.TDPException;
import org.talend.dataprep.exception.error.DataSetErrorCodes;
import org.talend.dataprep.log.Markers;
import org.talend.dataprep.preparation.service.PreparationService;
import org.talend.dataprep.preparation.store.PreparationRepository;
import org.talend.dataprep.security.Security;
//import org.talend.dataprep.security.SecurityProxy;

import io.swagger.annotations.ApiOperation;
//import io.swagger.annotations.ApiParam;
//import kr.co.digitalship.dprep.api.service.export.FileExportStrategy;

@RestController
public class TransformationCreateService extends BaseDataSetService {

	private static final Logger LOG = LoggerFactory.getLogger(TransformationCreateService.class);
	
	@Autowired
	PreparationRepository preparationRepository;
	
	@Autowired
	PreparationService preparationService;
	
	@Autowired 
	DataSetLocatorService datasetLocator;

    @Autowired
    private QuotaService quotaService;
    
    @Value("${dataset.local.file.size.limit:20000000}")
    private long maximumInputStreamSize;
    
    /** DataSet metadata builder. */
    @Autowired
    protected DataSetMetadataBuilder metadataBuilder;
    
    @Autowired
    private BackgroundAnalysis backgroundAnalysis;
    
    //@Autowired
    //private SecurityProxy securityProxy;
    /**
     * DataPrep abstraction to the underlying security (whether it's enabled or not).
     */
    @Autowired
    private Security security;
    
    //@Autowired
    //private FileExportStrategy fileExportStrategy;

    
    /**
     * Get all the possible actions for a given column.
     *
     * Although not rest compliant, this is done via a post in order to pass all the column metadata in the request body
     * without risking breaking the url size limit if GET would be used.
     *
     * @param body the column description (json encoded) in the request body.
     */
    @RequestMapping(value = "/api/test/create", method = {RequestMethod.GET, RequestMethod.POST} , produces = APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Get all actions for a data set column.", notes = "Returns all actions for the given column.")
    @ResponseBody
    public String create(@RequestParam String fileName) {
    	//TODO variable
    	String NL = System.getProperty("line.separator");
    	String BR = "<br>";
    	String log = new String(); 
    	log += "파일명 : " + fileName + NL;
    	//LOG.info(log);
    	File inputFile = new File(fileName);
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
    	long start = System.currentTimeMillis();
    	log += "분석 시작 시간: " + sdf.format(new Date(start)) + ", " + start + "ms" + NL;
    	//LOG.info(log);
        String newDatasetId = createDataset(inputFile);
        long end = System.currentTimeMillis();
        DataSetMetadata metadata = dataSetMetadataRepository.get(newDatasetId);
        long elapsed = (end - start) / 1000;        
        long recordCnt = metadata.getContent().getNbRecords();

        log += "분석 종료 시간: " + sdf.format(new Date(end)) + ", " + end + "ms" + NL;
        log += "분석 총건수: " + recordCnt + " 건" + NL;
        log += "분석 처리시간 : " + elapsed + " 초" + NL;
        log += "분석 초당처리량 : " +  recordCnt / elapsed + " 건/초" + NL;
        LOG.info(log);
        log = log.replaceAll(NL, BR);
        log = log.replaceAll("\\\\", "/");
        return "{\"datasetId\":\"" + newDatasetId + "\",\"log\":\"" + log + "\"}";
    }
    
    private String createDataset(File file) {
    	
        String contentType = null;

        String name = file.getName();
        String tag = "";

    	FileInputStream content = null;
		try {
			content = new FileInputStream(file);
		} catch (FileNotFoundException e1) {
			// TODO Auto-generated catch block
			new TDPException(DataSetErrorCodes.UNABLE_TO_READ_DATASET_CONTENT, e1);
		}
        //checkDataSetName(name);

        final String id = UUID.randomUUID().toString();
        final Marker marker = Markers.dataset(id);
        LOG.debug(marker, "Creating...");


        // check that the name is not already taken
        //checkIfNameIsAvailable(name);

        // get the location out of the content type and the request body
        final DataSetLocation location;
        try {
            location = datasetLocator.getDataSetLocation(contentType, content);
        } catch (IOException e) {
            throw new TDPException(DataSetErrorCodes.UNABLE_TO_READ_DATASET_LOCATION, e);
        }
        Long size = file.length();
        DataSetMetadata dataSetMetadata = null;
        TDPException hypotheticalException;
        try {

            // if the size is provided, let's check if the quota will not be exceeded
            if (size != null && size > 0) {
                quotaService.checkIfAddingSizeExceedsAvailableStorage(size);
            }

            dataSetMetadata = metadataBuilder //
                    .metadata() //
                    .id(id) //
                    .name(name) //
                    .author(security.getUserId()) //
                    .location(location) //
                    .created(System.currentTimeMillis()) //
                    .tag(tag) //
                    .build();

            
            // Save data set content
            LOG.debug(marker, "Storing content...");
            final long maxDataSetSizeAllowed = getMaxDataSetSizeAllowed();
            final StrictlyBoundedInputStream sizeCalculator =
                    new StrictlyBoundedInputStream(content, maxDataSetSizeAllowed);
            contentStore.storeAsRaw(dataSetMetadata, sizeCalculator);
            dataSetMetadata.setDataSetSize(sizeCalculator.getTotal());
            LOG.debug(marker, "Content stored.");

            // Create the new data set
            dataSetMetadataRepository.save(dataSetMetadata);
            LOG.debug(marker, "dataset metadata stored {}", dataSetMetadata);

            // Queue events (format analysis, content indexing for search...)
            analyzeDataSet(id, emptyList());
            analyzeStatisticsDataSet(id, emptyList());

            dataSetMetadata.getLifecycle().setImporting(true); // Indicate data set is being imported


            LOG.debug(marker, "Created!");

            //publisher.publishEvent(new DatasetImportedEvent(id));
            return id;
        } catch (StrictlyBoundedInputStream.InputStreamTooLargeException e) {
            hypotheticalException =
                    new TDPException(MAX_STORAGE_MAY_BE_EXCEEDED, e, build().put("limit", e.getMaxSize()));
        } catch (TDPException e) {
            hypotheticalException = e;
        } catch (Exception e) {
            hypotheticalException = new TDPException(UNABLE_CREATE_DATASET, e);
        } finally {
            // because the client might still be writing the request content, closing the connexion right now
            // might end up in a 'connection reset' or a 'broken pipe' error in API.
            //
            // So, let's read fully the request content before closing the connection.
            dataSetContentToNull(content);
        }
        dataSetMetadataRepository.remove(id);
        if (dataSetMetadata != null) {
            try {
                contentStore.delete(dataSetMetadata);
            } catch (Exception e) {
                LOG.error("Unable to delete uploaded data.", e);
            }
        }
        throw hypotheticalException;
    }

	/**
	 * Verify validity of the supplied name for a data set. This check will fail if the supplied name is null or only
	 * containing
	 * whitespaces characters. It will also throw an exception if a quote is in the name as it is an illegal TQL chars
	 * for searches.
	 *
	 * @param dataSetName the data set name to validate
	 */
//	private void checkDataSetName(String dataSetName) {
//	    if (dataSetName == null || dataSetName.contains("'")) {
//	        throw new TDPException(INVALID_DATASET_NAME,
//	                ExceptionContext.withBuilder().put("name", dataSetName).build());
//	    }
//	}
	
	/**
	 * @return What is the maximum dataset size allowed.
	 */
	private long getMaxDataSetSizeAllowed() {
	    final long availableSpace = quotaService.getAvailableSpace();
	    return maximumInputStreamSize > availableSpace ? availableSpace : maximumInputStreamSize;
	}

    /**
     * Fully read the given input stream to /dev/null.
     *
     * @param content some content
     */
    private void dataSetContentToNull(InputStream content) {
        try {
            IOUtils.copy(content, new NullOutputStream());
        } catch (IOException ioe) {
            // no op
        }
    }
    
    private void analyzeStatisticsDataSet(String id, List<Class<? extends DataSetAnalyzer>> analysersToSkip) {
    	
        backgroundAnalysis.analyze(id);

        // important log here (TDP-4137)
        final DataSetMetadata metadata = dataSetMetadataRepository.get(id);
        
        if (metadata != null) {
            LOG.info("New DataSet #{}, name: {}, type: {}, from: {}", metadata.getId(), metadata.getName(),
                    metadata.getContent().getMediaType(), metadata.getLocation().getStoreName());
        } else {
            LOG.error("Dataset #{} does not exist (but was expected to)", id);
        }
    }
}
