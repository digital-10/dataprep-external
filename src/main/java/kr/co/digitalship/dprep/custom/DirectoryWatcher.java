package kr.co.digitalship.dprep.custom;

import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_DELETE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;
import static java.nio.file.StandardWatchEventKinds.OVERFLOW;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.talend.dataquality.semantic.api.CategoryRegistryManager;

public class DirectoryWatcher implements Runnable {
	private static final Logger LOGGER = LoggerFactory.getLogger(DirectoryWatcher.class);
	
    @SuppressWarnings("unchecked")
    static <T> WatchEvent<T> cast(WatchEvent<?> event) {
        return (WatchEvent<T>)event;
    }

    /*
     * Wait this long after an event before processing the files.
     */
    private final int DELAY = 500;

    /*
     * Use a SET to prevent duplicates from being added when multiple events on the 
     * same file arrive in quick succession.
     */
    HashSet<String> filesToReload = new HashSet<String>();

    /*
     * Keep a map that will be used to resolve WatchKeys to the parent directory
     * so that we can resolve the full path to an event file. 
     */
    private final Map<WatchKey,Path> keys;

    Timer processDelayTimer = null;

    private volatile Thread server;

    private boolean trace = false;

    private WatchService watcher = null;
    
    public DirectoryWatcher(Path path, boolean recursive) throws IOException {
        this.watcher = FileSystems.getDefault().newWatchService();
        this.keys = new HashMap<WatchKey, Path>();

        if (recursive) {
            registerAll(path);
        } 
        else {
            register(path);
        }

        // enable trace after initial registration
        this.trace = true;
    }

    private synchronized void addFileToProcess(String filename, WatchEvent.Kind<?> kind) {
        boolean alreadyAdded = filesToReload.add(filename) == false;
        LOGGER.info("Queuing file for processing: '{}'", filename + (alreadyAdded?"(already queued)":""));
        
        if (processDelayTimer != null) {
            processDelayTimer.cancel();
        }
        processDelayTimer = new Timer();
        processDelayTimer.schedule(new TimerTask() {

            @Override
            public void run() {
                processFiles(kind);
            }
        }, DELAY);
    }

    private synchronized void processFiles(WatchEvent.Kind<?> kind) {
        /*
         * Iterate over the set of file to be processed
         */
        for (Iterator<String> it = filesToReload.iterator(); it.hasNext();) {
            String filename = it.next();

            /*
             * Sometimes you just have to do what you have to do...
             */
            LOGGER.info("Processing file: '{}'", filename);

            /*
             * Remove this file from the set.
             */
            it.remove();
            
            if (kind == ENTRY_MODIFY && (-1 < filename.indexOf("categorizer.json") || -1 < filename.indexOf("segments.gen"))) {
/*            	
            	String parent = new File(filename).getParent();
            	parent = parent.substring(parent.lastIndexOf(File.separator) + 1);
            	
            	SemanticCopy semanticCopy = new SemanticCopy().init();
            	semanticCopy.fromClassesSemantic(parent);
*/            	
            	//CategoryRegistryManager.getInstance().getCustomDictionaryHolder().reloadCategoryMetadata();
            	CategoryRegistryManager.getInstance().reloadCategoriesFromRegistry();
            }
        }
    }

    /**
     * Register the given directory with the WatchService
     */
    private void register(Path dir) throws IOException {
        WatchKey key = dir.register(watcher, ENTRY_CREATE, ENTRY_DELETE, ENTRY_MODIFY);
        if (trace) {
            Path prev = keys.get(key);
            if (prev == null) {
                System.out.format("register: %s\n", dir);
            } 
            else {
                if (!dir.equals(prev)) {
                    System.out.format("update: %s -> %s\n", prev, dir);
                }
            }
        }
        keys.put(key, dir);
    }

    /**
     * Register the given directory, and all its sub-directories, with the
     * WatchService.
     */
    private void registerAll(final Path start) throws IOException {
        // register directory and sub-directories
        Files.walkFileTree(start, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                if (dir.getFileName().toString().startsWith(".")) {
                    return FileVisitResult.SKIP_SUBTREE;
                }

                register(dir);
                return FileVisitResult.CONTINUE;
            }
        });
    }

    @SuppressWarnings("unchecked")
    @Override
    public void run() {
        Thread thisThread = Thread.currentThread();

        while (server == thisThread) {
            try {
                // wait for key to be signaled
                WatchKey key;
                try {
                    key = watcher.take();
                } 
                catch (InterruptedException x) {
                    return;
                }

                Path dir = keys.get(key);
                if (dir == null) {
                    continue;
                }

                for (WatchEvent<?> event: key.pollEvents()) {
                    WatchEvent.Kind<?> kind = event.kind();

                    if (kind == OVERFLOW) {
                        continue;
                    }

                    if (kind == ENTRY_MODIFY) {
                        WatchEvent<Path> ev = (WatchEvent<Path>)event;
                        Path name = ev.context();
                        Path child = dir.resolve(name);

                        String filename = child.toAbsolutePath().toString();

                        addFileToProcess(filename, kind);
                    }
                }

                key.reset();
            } 
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void start() {
        server = new Thread(this);
        server.setName("Directory Watcher Service");
        server.start();
    }


    public void stop() {
        Thread moribund = server;
        server = null;
        if (moribund != null) {
            moribund.interrupt();
        }
    }
    
    public Map<WatchKey,Path> getKeys() {
    	return this.keys;
    }
/*
	public void start(String strPath) {
    	//strPath = localRegistryPath + "/shared/prod/regex";
    	Path path = Paths.get(strPath);
    	
        if (!Files.isDirectory(path)) {
            System.err.println(path + " is not a directory!");
        }
        
        DirectoryWatcher directoryWatcher;
        try {
        	directoryWatcher = new DirectoryWatcher(path, true);
        	directoryWatcher.start();
        }
        catch (IOException e) {
            System.err.println(e.getMessage());
        }        
    }

    public static void main(String[] args) {
		DirectoryWatcher[] directoryWatchers = new DirectoryWatcher[3];
		Path[] paths = new Path[3];
		
		try {
			paths[0] = Paths.get(DirectoryWatcher.class.getClassLoader().getResource("./semantic/dictionary").toURI());
			paths[1] = Paths.get(DirectoryWatcher.class.getClassLoader().getResource("./semantic/metadata").toURI());
			paths[2] = Paths.get(DirectoryWatcher.class.getClassLoader().getResource("./semantic/regex").toURI());
			
			for(int i = 0, len = paths.length; i < len; i++) {
				System.out.println(paths[i].toString());
				
				if(Files.isDirectory(paths[i])) {
			    	try {
						directoryWatchers[i] = new DirectoryWatcher(paths[i], true);
						directoryWatchers[i].start();
					} 
			    	catch (IOException e) {
						e.printStackTrace();
					}    			
				}
			}				
		} 
		catch (URISyntaxException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}			
    }
*/    
}
