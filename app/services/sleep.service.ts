import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Storage } from '@capacitor/storage';

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

	// constructor() 
	// {
	// 	this.loadData();
	// }

	public addDefaultData() 
	{
		this.logOvernightData(new OvernightSleepData(new Date('February 18, 2021 01:03:00'), new Date('February 18, 2021 09:25:00')));
		this.logSleepinessData(new StanfordSleepinessData(4, new Date('February 19, 2021 14:38:00')));
		this.logOvernightData(new OvernightSleepData(new Date('February 20, 2021 23:11:00'), new Date('February 21, 2021 08:03:00')));
	}

	async loadData() 
	{
		const { value } = await Storage.get({ key: 'sleepData' });
		if (value) 
		{
		  const data = JSON.parse(value);
		  SleepService.AllSleepData = data.allSleepData || [];
		  SleepService.sleepDateTime = data.sleepDateTime || null;
		  SleepService.sleepMode = data.sleepMode || null;
		}
	}

	async saveData() 
	{
		const dataToSave = {
		  allSleepData: SleepService.AllSleepData,
		  sleepDateTime: SleepService.sleepDateTime,
		  sleepMode: SleepService.sleepMode,
		};
		
		await Storage.set({
		  key: 'sleepData',
		  value: JSON.stringify(dataToSave),
		});
	}

	public printDataSummary() 
	{
		console.log(`Total Sleep Data Entries: ${SleepService.AllSleepData.length}`);
		
		// Check if sleepDateTime exists and is a Date object before calling toISOString
		const dateTimeString = SleepService.sleepDateTime instanceof Date ? 
							   SleepService.sleepDateTime.toISOString() : 
							   'Not set or not a Date object';
	  
		console.log(`Current Sleep DateTime: ${dateTimeString}`);
		console.log(`Current Sleep Mode: ${SleepService.sleepMode}`);
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

	public getTotalSleepDataSize()
	{
		return SleepService.AllSleepData.length;
	}
 }
