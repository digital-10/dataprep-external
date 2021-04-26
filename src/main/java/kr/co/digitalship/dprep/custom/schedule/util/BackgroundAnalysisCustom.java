// ============================================================================
//
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

package kr.co.digitalship.dprep.custom.schedule.util;

import static org.talend.dataprep.exception.error.DataSetErrorCodes.UNABLE_TO_ANALYZE_DATASET_QUALITY;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Stream;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.fs.FileSystem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.talend.dataprep.api.dataset.ColumnMetadata;
import org.talend.dataprep.api.dataset.DataSetMetadata;
import org.talend.dataprep.api.dataset.row.DataSetRow;
import org.talend.dataprep.api.dataset.statistics.SemanticDomain;
import org.talend.dataprep.dataset.StatisticsAdapter;
import org.talend.dataprep.dataset.service.analysis.DataSetAnalyzer;
import org.talend.dataprep.dataset.store.content.ContentStoreRouter;
import org.talend.dataprep.dataset.store.metadata.DataSetMetadataRepository;
import org.talend.dataprep.exception.TDPException;
import org.talend.dataprep.quality.AnalyzerService;
import org.talend.dataquality.common.inference.Analyzer;
import org.talend.dataquality.common.inference.Analyzers;

import kr.co.digitalship.dprep.custom.redis.SpringRedisTemplateUtil;

import org.talend.dataquality.common.inference.ValueQualityStatistics;

/**
 * Compute statistics analysis on the full dataset.
 * /dataprep-dataset/src/main/java/org/talend/dataprep/dataset/service/analysis/asynchronous/BackgroundAnalysis.java 가 원본
 * 기존 프로세스에 영향을 주지 않기 위해 복제 수정 생성함.
 */
@Component
public class BackgroundAnalysisCustom {

    /** This class' logger. */
    private static final Logger LOGGER = LoggerFactory.getLogger(BackgroundAnalysisCustom.class);   
    
	//@Value("${hadoop.read.base.path:}")
    //private String hadoopReadBasePath;    
    
	@Value("${hadoop.write.base.path:}")
    private String hadoopWriteBasePath;
	
	@Value("${kweather.preparation.domain_change.idx:-1}")
	private int[] domainChangeIdx;
	
	@Value("${kweather.preparation.domain_change.value:}")
	private String[] domainChangeValue;
    
    /** Dataset metadata repository. */
    @Autowired
    private DataSetMetadataRepository repository;

    /** DataSet content store. */
    @Autowired
    private ContentStoreRouter store;

    /** Analyzer service */
    @Autowired
    private AnalyzerService analyzerService;

    /** Statistics adapter. */
    @Autowired
    private StatisticsAdapter adapter;

	@Autowired
	private SpringRedisTemplateUtil springRedisTemplateUtil;
	
	@Autowired
	private HadoopUtil hadoopUtil;
	
    /**
     * 기본적으로 하나의 데이터 형태에 대한 처리임.
     * 이종의 데이터셋의 형태에 대한 것은 현재 고려 대상이 아니며...
     * 이후로도 불가할 것 같아 보임. 
     * @see DataSetAnalyzer#analyze
     */
    public DataSetMetadata analyze(String dataSetId) {
        if (StringUtils.isEmpty(dataSetId)) {
            throw new IllegalArgumentException("Data set id cannot be null or empty.");
        }

		String wsId = (String)springRedisTemplateUtil.valueGet("WS_ID");
		
        LOGGER.debug("Integrated Statistics analysis starts ({} / {})", wsId, dataSetId);

        DataSetMetadata metadata = repository.get(dataSetId);
        if (metadata != null) {
            if (!metadata.getLifecycle().schemaAnalyzed()) {
                LOGGER.debug("[ Integrated Statistics ] Schema information must be computed before quality analysis can be performed. ({} / {})", wsId, dataSetId);
                return null; // no acknowledge to allow re-poll.
            }

            final List<ColumnMetadata> columns = metadata.getRowMetadata().getColumns();
            if (columns.isEmpty()) {
                LOGGER.debug("[ Integrated Statistics ] No column information. ({} / {})", wsId, dataSetId);
                return null;
            } 
            else {
				FileSystem fs = hadoopUtil.getFs();
        		//String strWritePath = hadoopWriteBasePath + "/" + wsId;
				String writePath = hadoopWriteBasePath + "/" + wsId;
        		List<String> fileList = hadoopUtil.getFileList(fs, writePath);

        		if(null == fileList || 0 == fileList.size()) {
        			LOGGER.debug("[ Integrated Statistics ] No aggregate target file. ({} / {})", wsId, dataSetId);
        			return null;
        		}
        		else {
        			try(Analyzer<Analyzers.Result> advancedAnalyzer = analyzerService.full(columns)) {
        				for(int i = 0, len = fileList.size(); i < len; i++) {
        					byte[] bytes = hadoopUtil.getByte(fileList.get(i));
        					InputStream is = new BufferedInputStream(new ByteArrayInputStream(bytes));
        					
        					if(0 == i) {
        						try(final Stream<DataSetRow> stream = store.streamCustom(metadata, 1000, is)) {
        							try(Analyzer<Analyzers.Result> baseAnalyzer = analyzerService.schemaAnalysis(columns)) {
                	                    computeStatistics(baseAnalyzer, columns, stream);
                	                    metadata = saveAnalyzerResults(dataSetId, baseAnalyzer, metadata);
                	                    
                	                    LOGGER.debug("[ Integrated Statistics ] Base statistics analysis done. ({} / {})", wsId, dataSetId);        								
        							}
        						}
        						catch(Exception e) {
        		                    LOGGER.warn("[ Integrated Statistics ] Base statistics analysis, ({} / {}) generates an error", wsId, dataSetId, e);
        		                    throw new TDPException(UNABLE_TO_ANALYZE_DATASET_QUALITY, e);        							
        						}
        						finally {
        							is = new BufferedInputStream(new ByteArrayInputStream(bytes));        							
        						}
        					}
        					
        					try(final Stream<DataSetRow> stream = store.streamCustom(metadata, -1, is)) {
        	                    computeStatistics(advancedAnalyzer, columns, stream);
        	                    updateNbRecords(metadata, advancedAnalyzer.getResult());
        	                    metadata = saveAnalyzerResults(dataSetId, advancedAnalyzer, metadata);

        	                    if(i == len - 1) {
        	                    	LOGGER.debug("[ Integrated Statistics ] Advanced statistics analysis done. ({} / {})", wsId, dataSetId);
        	                    }
        					}
        					catch(Exception e) {
        		                LOGGER.warn("[ Integrated Statistics ] Advanced statistics analysis, ({} / {}) generates an error", wsId, dataSetId, e);
        		                throw new TDPException(UNABLE_TO_ANALYZE_DATASET_QUALITY, e);
        		            }
        				}
        			}
        			catch(Exception e) {
	                    LOGGER.warn("[ Integrated Statistics ] Base statistics analysis, ({} / {}) generates an error", wsId, dataSetId, e);
	                    throw new TDPException(UNABLE_TO_ANALYZE_DATASET_QUALITY, e);        				
        			}
        			LOGGER.info("[ Integrated Statistics ] Statistics analysis done for ({} / {})", wsId, dataSetId);
        		}
            }
        } 
        else {
            LOGGER.info("[ Integrated Statistics ] Unable to analyze quality. ({} / {})", wsId, dataSetId);
        }
        //mapper.writeValueAsString(metadata);

        // 도메인 변환 ( 정규식으로 도메인을 판별하기 때문에 유사한 형태인 경우 ㄱ-ㅎA-Z 순이기 때문에 ) 
		for(int i = 0, len = domainChangeIdx.length; i < len; i++) {
			ColumnMetadata column = metadata.getRowMetadata().getColumns().get(domainChangeIdx[i]);
			List<SemanticDomain> semanticDomains = column.getSemanticDomains();
	
			for(int j = 0, jLen = semanticDomains.size(); j < jLen; j++) {
				SemanticDomain semanticDomain = semanticDomains.get(j);
				
				if(domainChangeValue[i].equals(semanticDomain.getId()) && !domainChangeValue[i].equals(column.getDomain())) {
					column.setDomain(semanticDomain.getId());
					column.setDomainLabel(semanticDomain.getLabel());
					column.setDomainFrequency(semanticDomain.getScore());
					
					break;
				}
			}
		}        
        
        return metadata;
    }

    private DataSetMetadata saveAnalyzerResults(String id, Analyzer<Analyzers.Result> analyzer, DataSetMetadata dataSetMetadata) {
        if (dataSetMetadata != null) {
            adapter.adapt(dataSetMetadata.getRowMetadata().getColumns(), analyzer.getResult());
        }

        return dataSetMetadata;
    }

    /**
     * Update the number of records for the dataset.
     *
     * @param metadata the dataset metadata to update.
     * @param results the
     */
    private void updateNbRecords(DataSetMetadata metadata, List<Analyzers.Result> results) {
        if (results.isEmpty()) {
            return;
        }
        // get the analyzer of the first column
        final Analyzers.Result result = results.get(0);
        if (result.exist(ValueQualityStatistics.class)) {
            final ValueQualityStatistics valueQualityStatistics = result.get(ValueQualityStatistics.class);
            metadata.getContent().setNbRecords(valueQualityStatistics.getCount());
        }
    }

    /**
     * Compute the statistics for the given dataset metadata and content.
     *
     * @param analyzer the analyzer to perform.
     * @param columns the columns metadata.
     * @param stream the content to compute the statistics from.
     */
    private void computeStatistics(final Analyzer<Analyzers.Result> analyzer, final List<ColumnMetadata> columns,
            final Stream<DataSetRow> stream) {
        // Create a content with the expected format for the StatisticsClientJson class
        stream.map(row -> row.toArray(DataSetRow.SKIP_TDP_ID)).forEach(analyzer::analyze);
        analyzer.end();

        // Store results back in data set
        adapter.adapt(columns, analyzer.getResult());
    }
}
