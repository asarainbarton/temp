import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data'
import { NgIf, NgForOf } from '@angular/common';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [ExploreContainerComponent, IonicModule, CommonModule, NgIf,
    NgForOf],
})
export class Tab3Page {
  selectedDate: string;
  selectedDateInfo: string | null = null;
  wanted_sleepiness_data: StanfordSleepinessData[] = [];
  wanted_overnight_data:string = "";

  constructor(private sleepService: SleepService) 
  {
    this.selectedDate = new Date().toString();
  }

  async ngOnInit() 
  {
    await this.sleepService.loadData();
    this.selectedDate = new Date().toString();
    this.fetchDateInfo(this.selectedDate);
  }

  ionViewDidEnter() 
  {
    this.fetchDateInfo(this.selectedDate);
  }

  dateChanged(event: any) {
    this.selectedDate = event.detail.value;
    this.fetchDateInfo(this.selectedDate);
  }

  fetchDateInfo(date: string) 
  {
    // const info = `Information for ${date}`;
    // this.selectedDateInfo = info;
    this.wanted_sleepiness_data = this.getStanfordSleepinessDataFromSpecifiedDate(date);
    this.wanted_overnight_data = this.getOvernightDataFromSpecifiedDate(date);
  }

  getStanfordSleepinessDataFromSpecifiedDate(date: string)
  {
    var the_date:Date = new Date(date);
    var str_date = this.convertDateToDateString(the_date);
    var wanted_sleepiness_data:StanfordSleepinessData[] = [];

    for (let i = 0; i < SleepService.AllSleepinessData.length; i++) 
    {
      const data = SleepService.AllSleepinessData[i];
      if (this.convertDateToDateString(data.loggedAt) == str_date)
        wanted_sleepiness_data.push(data);
    }

    return wanted_sleepiness_data;
  }

  getOvernightDataFromSpecifiedDate(date: string)
  {
    var the_date:Date = new Date(date);
    var str_date = this.convertDateToDateString(the_date);

    var total_time = 0;
    for (let i = 0; i < SleepService.AllOvernightData.length; i++) 
    {
      const data = SleepService.AllOvernightData[i];
      if (this.convertDateToDateString(data.loggedAt) == str_date)
      {
        var total_ms = data.sleepEnd.getTime() - data.sleepStart.getTime();
        total_time += total_ms;
      }
    }

    return Math.floor(total_time / (1000*60*60)) + " hours, " + Math.floor(total_time / (1000*60) % 60) + " minutes.";
  }

  convertDateToDateString(date:Date)
  {
    var yearStr = date.getFullYear().toString();
    var monthStr = date.getMonth().toString();
    var dayStr = date.getDate().toString();

    return `${yearStr}-${monthStr}-${dayStr}`;
  }
}


