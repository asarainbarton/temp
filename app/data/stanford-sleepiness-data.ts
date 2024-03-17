/* from the Stanford Sleepiness Scale */
/* https://web.stanford.edu/~dement/sss.html */

import { SleepData } from './sleep-data';

export class StanfordSleepinessData extends SleepData 
{
	public static ScaleValues = [undefined,//Sleepiness scale starts at 1
	'Feeling active, vital, alert, or wide awake', //1
	'Functioning at high levels, but not at peak; able to concentrate', //2
	'Awake, but relaxed; responsive but not fully alert', //3
	'Somewhat foggy, let down', //4
	'Foggy; losing interest in remaining awake; slowed down', //5
	'Sleepy, woozy, fighting sleep; prefer to lie down', //6
	'No longer fighting sleep, sleep onset soon; having dream-like thoughts']; //7

	public loggedValue:number;

	constructor(loggedValue:number, loggedAt:Date = new Date()) 
	{
		super();
		this.loggedValue = loggedValue;
		this.loggedAt = loggedAt;
	}
	
	override summaryString():string 
	{
		return "ID: " + this.id + "\nDate: " + this.loggedAt + "\nSleepiness: " + this.loggedValue + " - " + StanfordSleepinessData.ScaleValues[this.loggedValue];
	}

	summaryString1():string
	{
		return "ID: ";
	}

	summaryString1_5():string
	{
		return "" + this.id;
	}

	summaryString2():string
	{
		return "Date: ";
	}

	summaryString2_5():string
	{
		return "" + this.loggedAt;
	}

	summaryString3():string
	{
		return "Sleepiness: ";
	}

	summaryString3_5():string
	{
		return "" + this.loggedValue + " - " + StanfordSleepinessData.ScaleValues[this.loggedValue];
	}

	getTime():string
	{
		var am:boolean;
		var hours = this.loggedAt.getHours();
		const minutes = this.loggedAt.getMinutes();

		if (hours >= 0 && hours <= 11)
			am = true;
		else 
		{
			am = false;
			hours -= 12;
		}

		if (hours == 0)
			hours = 12;

		var am_str;
		if (am)
			am_str = " AM";
		else 
			am_str = " PM";

		const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

		return timeString + am_str;
	}

	

}
