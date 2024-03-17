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

	setLoggedAtDate(actual_logged_at:Date)
	{
		this.loggedAt = actual_logged_at;
	}

	setID(actual_id:string)
	{
		this.id = actual_id;
	}
}
