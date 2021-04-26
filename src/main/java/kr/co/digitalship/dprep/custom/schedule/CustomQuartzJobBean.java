package kr.co.digitalship.dprep.custom.schedule;

import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;
import org.quartz.TriggerKey;
import org.springframework.scheduling.quartz.QuartzJobBean;

public abstract class CustomQuartzJobBean extends QuartzJobBean {
	private String jobName;                         // Job name
	private String triggerName;                     // trigger name
	private String group;                           // Group
	private String cronExp;                         // Cron 식 :: 실행주기
	private JobDataMap jobDataMap;                  // JobDataMap :: JobDetail.getJobDataMap() 과 동일 - 그대로 전달하기 위해
	private boolean isUseJobListener = false;       // JobListener 사용 여부 :: 일단은...쓸 수 있을까 하고 넣어 봄
	private boolean isUseTriggerListener = false;   // TriggerListener 사용 여부 :: 일단은...쓸 수 있을까 하고 넣어 봄
	private boolean isUseSchedulerListener = false; // SchedulerListener 사용 여부 :: 일단은...쓸 수 있을까 하고 넣어 봄

	public String getJobName() {
		return jobName;
	}

	public void setJobName(String jobName) {
		this.jobName = jobName;
	}

	public String getTriggerName() {
		return triggerName;
	}

	public void setTriggerName(String triggerName) {
		this.triggerName = triggerName;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getCronExp() {
		return cronExp;
	}

	public void setCronExp(String cronExp) {
		this.cronExp = cronExp;
	}

	public JobDataMap getJobDataMap() {
		return jobDataMap;
	}

	public void setJobDataMap(JobDataMap jobDataMap) {
		this.jobDataMap = jobDataMap;
	}	
	
	public boolean isUseJobListener() {
		return isUseJobListener;
	}

	public void setUseJobListener(boolean isUseJobListener) {
		this.isUseJobListener = isUseJobListener;
	}	
	
	public boolean isUseTriggerListener() {
		return isUseTriggerListener;
	}

	public void setUseTriggerListener(boolean isUseTriggerListener) {
		this.isUseTriggerListener = isUseTriggerListener;
	}
	
	public boolean isUseSchedulerListener() {
		return isUseSchedulerListener;
	}

	public void setUseSchedulerListener(boolean isUseSchedulerListener) {
		this.isUseSchedulerListener = isUseSchedulerListener;
	}

	// JobDetail 식별을 위한 KEY 생성
    public JobKey getJobKey() {
        return JobKey.jobKey(getJobName(), getGroup());
    }

    // Trigger 식별을 위해 사한 KEY 생성
    public TriggerKey getTriggerKey() {
        return TriggerKey.triggerKey(getTriggerName(), getGroup());
    } 	

	protected abstract void executeInternal(JobExecutionContext context) throws JobExecutionException;
}
