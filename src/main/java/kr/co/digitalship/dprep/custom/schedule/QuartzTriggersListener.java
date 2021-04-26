package kr.co.digitalship.dprep.custom.schedule;

import org.quartz.JobExecutionContext;
import org.quartz.JobKey;
import org.quartz.Trigger;
import org.quartz.Trigger.CompletedExecutionInstruction;
import org.quartz.TriggerListener;

public class QuartzTriggersListener implements TriggerListener {

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return getClass().getName();
	}

	@Override
	public void triggerFired(Trigger trigger, JobExecutionContext context) {
		// TODO Auto-generated method stub
		JobKey jobKey = trigger.getJobKey();
		System.out.println("QuartzTriggersListener - triggerFired :: " + jobKey + " / " + trigger.getKey());
	}

	@Override
	public boolean vetoJobExecution(Trigger trigger, JobExecutionContext context) {
		// TODO Auto-generated method stub
		JobKey jobKey = trigger.getJobKey();
		System.out.println("QuartzTriggersListener - vetoJobExecution :: " + jobKey + " / " + trigger.getKey());
		return false;
	}

	@Override
	public void triggerMisfired(Trigger trigger) {
		// TODO Auto-generated method stub
		JobKey jobKey = trigger.getJobKey();
		System.out.println("QuartzTriggersListener - triggerMisfired :: " + jobKey + " / " + trigger.getKey());
	}

	@Override
	public void triggerComplete(Trigger trigger, JobExecutionContext context,
			CompletedExecutionInstruction triggerInstructionCode) {
		// TODO Auto-generated method stub
		JobKey jobKey = trigger.getJobKey();
		System.out.println("QuartzTriggersListener - triggerComplete :: " + jobKey + " / " + trigger.getKey());
	}
}
