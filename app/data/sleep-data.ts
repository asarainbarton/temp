import { nanoid } from 'nanoid';

export class SleepData 
{
	id:string;
	loggedAt:Date;

	constructor() 
	{
		this.id = nanoid();
		this.loggedAt = new Date();
	}

	summaryString():string 
	{
		return 'Unknown sleep data';
	}

	getID():string
	{
		return this.id;
	}

	dateString():string 
	{
		return this.loggedAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}
}
