package kr.co.digitalship.dprep.custom.schedule.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.annotation.PostConstruct;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.FileUtil;
import org.apache.hadoop.fs.LocatedFileStatus;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.fs.RemoteIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import kr.co.digitalship.dprep.custom.PropertiesUtil;

@Component
public class HadoopUtil {
	private static final Logger LOGGER = LoggerFactory.getLogger(HadoopUtil.class);
	
	@Value("${hadoop.fs.defaultFS:}")
    private String defaultFS;
	
	@Value("${hadoop.user:}")
    private String user;	
	
	@Value("${dataprep.node.count:0}")
    private int nodeCount;     
    
    private Configuration conf;
    
	public String getDefaultFS() {
		return defaultFS;
	}

	public Configuration getConf() {
		return this.conf;
	}
	
	@PostConstruct
	public HadoopUtil init() {
		// 그럴리 없겠지만 값이 주입되지 않았다면...
		if(0 == nodeCount) {
			Properties properties = new PropertiesUtil().getProperties();
			
			defaultFS = properties.getProperty("hadoop.fs.defaultFS");
			user = properties.getProperty("hadoop.user");
			nodeCount = Integer.parseInt(properties.getProperty("dataprep.node.count"));
		}
		
		if(null == conf) {
			configuration();			
		}
		return this;
	}

	private void configuration() {
		conf = new Configuration();
		conf.set(FileSystem.FS_DEFAULT_NAME_KEY, defaultFS);
		conf.set("fs.hdfs.impl", org.apache.hadoop.hdfs.DistributedFileSystem.class.getName()); // 
		conf.set("fs.file.impl", org.apache.hadoop.fs.LocalFileSystem.class.getName());         // 
		conf.set("dfs.client.use.datanode.hostname", "true");       // Client 에서 호스트네임 사용 여부
		conf.setBoolean("fs.hdfs.impl.disable.cache", true);
		System.setProperty("HADOOP_USER_NAME", user);		        // User

		if(System.getProperty("os.name").toLowerCase().contains("win")) {
			System.setProperty("hadoop.home.dir", "C:\\hadoop"); // home :: windows			
		}
		else {
			//System.setProperty("hadoop.home.dir", "/usr/local/hadoop"); // home
			System.setProperty("hadoop.home.dir", "/"); // home
		}	
	}
	
	public FileSystem getFs() {
		FileSystem fs = null;
		try {
			fs = FileSystem.newInstance(URI.create(defaultFS), conf); // 항상 새로운 파일시스템 객체
		} catch (IOException e) {
			e.printStackTrace();
		}
		return fs;
	}		
	
	public List<List<String>> getFileList(FileSystem fs, String basePath, List<String> prevFileLists) {
		List<List<String>> fileLists = new ArrayList<>();
		
		Path readPath = new Path(basePath);
		
		try {
			// TODO :: 디렉토리가 나눠져 있는 경우 어떻게 해야할까? 원본 파일의 삭제는 불가하다...(기처리건과 중복문제, 처리 목록을 하나의 파일에 계속 쓸 수 는 없다...)
			RemoteIterator<LocatedFileStatus> remoteIterators = fs.listFiles(readPath, true); // 하부 디렉토리의 파일을 전부 읽어야 할 경우에...true
			List<String> remoteListsStr = new ArrayList<>();			
			while(remoteIterators.hasNext()) {
				LocatedFileStatus locatedFileStatus = remoteIterators.next();
				if(locatedFileStatus.isFile()) {
					String filePath = Path.getPathWithoutSchemeAndAuthority(locatedFileStatus.getPath()).toString();
					// 기처리 목록에 포함되지 않으면 처리대상으로 추가
					if(null == prevFileLists || !prevFileLists.contains(filePath)) {
						remoteListsStr.add(filePath);
					}					
				}
			}
			
			if(0 < remoteListsStr.size()) {
				BigDecimal totRow = new BigDecimal(remoteListsStr.size());
				BigDecimal eachCnt = totRow.divide(new BigDecimal(nodeCount), 0,  BigDecimal.ROUND_UP);

				for(int i = 0; i < nodeCount; i++) {
					int fromIndex = i * eachCnt.intValue();
					int toIndex = (i + 1) * eachCnt.intValue();

					if(totRow.intValue() <= fromIndex) {
						break;
					}
					else if(totRow.intValue() < toIndex) {
						toIndex = totRow.intValue();
					}
					
					fileLists.add(new ArrayList<String>(remoteListsStr.subList(fromIndex, toIndex)));
				}				
			}
			return fileLists; 
		} 
		catch (FileNotFoundException e) {
			LOGGER.info("HadoopUtil.getFileList - No files to be processed");
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public List<String> getFileList(FileSystem fs, String basePath) {
		List<String> fileLists = new ArrayList<>();
		
		Path readPath = new Path(basePath);
		
		try {
			// TODO :: 디렉토리가 나눠져 있는 경우 어떻게 해야할까? 원본 파일의 삭제는 불가하다...(기처리건과 중복문제, 처리 목록을 하나의 파일에 계속 쓸 수 는 없다...)
			RemoteIterator<LocatedFileStatus> remoteIterators = fs.listFiles(readPath, true); // 하부 디렉토리의 파일을 전부 읽어야 할 경우에...true
						
			while(remoteIterators.hasNext()) {
				LocatedFileStatus locatedFileStatus = remoteIterators.next();
				if(locatedFileStatus.isFile()) {
					String filePath = Path.getPathWithoutSchemeAndAuthority(locatedFileStatus.getPath()).toString();
					// 기처리 목록에 포함되지 않으면 처리대상으로 추가
					fileLists.add(filePath);
				}
			}
			return fileLists; 
		} 
		catch (FileNotFoundException e) {
			e.printStackTrace();
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public String getStr(String filePath) {
		return this.getStr(filePath, "UTF-8");
	}
	
	public String getStr(String filePath, String encoding) {
		FileSystem fs = getFs();
		
		Path path = new Path(filePath);
		FSDataInputStream fSDataInputStream = null;
		String str = null;
		
		try {
			fSDataInputStream = fs.open(path);
			str = IOUtils.toString(fSDataInputStream, encoding);
		} 
		catch (Exception e) {
		}
		finally {
			if(null != fSDataInputStream) {
				try { fSDataInputStream.close(); } catch (IOException e) {}
			}
			if(null != fs) {
				try { fs.close(); } catch (IOException e) {}				
			}
		}
		return str;
	}	

	public byte[] getByte(String filePath) {
		return this.getByte(filePath, "UTF-8");
	}
	
	public byte[] getByte(String filePath, String encoding) {
		String str = this.getStr(filePath, encoding);
		byte[] bytes = null;
		
		try {
			bytes = str.getBytes(encoding);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		return bytes;
	}
	
	public InputStream getInputStream(FileSystem fs, String filePath) {
		return this.getInputStream(fs, filePath, "UTF-8");
	}
	
	public InputStream getInputStream(FileSystem fs, String filePath, String encoding) {
		Path path = new Path(filePath);
		FSDataInputStream fSDataInputStream = null;
		
		try {
			fSDataInputStream = fs.open(path);
		} 
		catch (Exception e) {
			
		}
		return fSDataInputStream.getWrappedStream();
	}	
	
	public void write(FileSystem fs, String content, String basePath, String subPath, String filename) {
		this.write(fs, content, basePath, subPath, filename, "UTF-8");
	}
	
	public void write(FileSystem fs, String content, String basePath, String subPath, String filename, String encoding) {
		String fullPath = "";
		if(StringUtils.isEmpty(subPath)) {			
			fullPath = basePath + "/" + filename;
		}
		else {
			fullPath = basePath + "/" + subPath + "/" + filename;
		}
		this.write(fs, content, fullPath, encoding);
	}
	
	public void write(FileSystem fs, String content, String fullPath) {
		this.write(fs, content, fullPath, "UTF-8");
	}
	
	public void write(FileSystem fs, String content, String fullPath, String encoding) {
		FSDataOutputStream outputStream = null;
		
		Path path = new Path(fullPath);
		
		try {
			if(fs.exists(path.getParent())) {
				fs.mkdirs(path.getParent());
			}
		} catch (IOException e) {
		}
		
		try {
			byte[] bytes = content.getBytes(encoding);
			
			outputStream = fs.create(path, true);
			outputStream.write(bytes);
		} 
		catch (IllegalArgumentException | IOException e) {
			e.printStackTrace();
		}
		finally {
			if(null != outputStream) {
				try { outputStream.close(); } catch (IOException e) {}			
			}
		}		
	}	
	
	public void copy(String srcPath, String dstPath) {
		FileSystem srcFS = getFs();
		Path src = new Path(srcPath);
		
		FileSystem dstFS = getFs();
		Path dst = new Path(dstPath);
		
		try {
			FileUtil.copy(srcFS, src, dstFS, dst, false, conf);
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
		finally {
			if(null != dstFS) {
				try { dstFS.close(); } catch (IOException e) {}				
			}
			
			if(null != srcFS) {
				try { srcFS.close(); } catch (IOException e) {}				
			}
		}
	}
	
	public void delete(FileSystem fs, String path) {
		try {
			fs.delete(new Path(path), true);
		} catch (IllegalArgumentException | IOException e) {
			e.printStackTrace();
		}
	}
}
