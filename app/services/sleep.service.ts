import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Injectable({
  	providedIn: 'root'
})
export class SleepService 
{
	// private static LoadDefaultData:boolean;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];
	public static sleepDateTime: Date;
	public static sleepMode:boolean = false;

	constructor() {}

	public addDefaultData() 
	{
		this.logOvernightData(new OvernightSleepData(new Date('February 18, 2021 01:03:00'), new Date('February 18, 2021 09:25:00')));
		this.logSleepinessData(new StanfordSleepinessData(4, new Date('February 19, 2021 14:38:00')));
		this.logOvernightData(new OvernightSleepData(new Date('February 20, 2021 23:11:00'), new Date('February 21, 2021 08:03:00')));
	}

	public logOvernightData(sleepData:OvernightSleepData) 
	{
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) 
	{
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);
	}

	public printAllSleepData()
	{
		console.log("All Sleep Data:");
		SleepService.AllSleepData.forEach((data) => {
		console.log(data.summaryString());
		});
	}

	public getCurrentSleepMode() 
	{
		return SleepService.sleepMode;
	}

	public getCurrentSleepDateTime()
	{
		return SleepService.sleepDateTime;
	}

	public setSleepDateTime(dateTime:Date)
	{
		SleepService.sleepDateTime = dateTime;
	}

	public setCurrentSleepMode(mode:boolean)
	{
		SleepService.sleepMode = mode;
	}
 }