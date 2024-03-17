import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data'
import { NgIf, NgForOf } from '@angular/common';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [ExploreContainerComponent, IonicModule, CommonModule, NgIf,
    NgForOf],
})
export class Tab1Page 
{
  timesSlept:number[] = [];
  timesSleptDates:Date[] = [];

  avgSleepiness:number[] = [];
  avgSleepinessDates:Date[] = [];

  week_timesSlept:number[] = [];
  week_timesSleptDates:Date[] = [];

  week_avgSleepiness:number[] = [];
  week_avgSleepinessDates:Date[] = [];

  avgSleepDuration:number = 0;
  avgSleepinessVal:number = 0;

  week_avgSleepDuration:number = 0;
  week_avgSleepinessVal:number = 0;

  myChart?: Chart;
  myChart2?: Chart;

  constructor(private sleepService: SleepService) {}

  async ngOnInit() 
  {
    await this.sleepService.loadData();
    this.populateTimesSlept();
    this.populateAvgSleepiness();
    this.calculateAllAverages();
    await this.plotData();
    await this.plotData2();
  }

  ionViewDidEnter() 
  {
    this.populateTimesSlept();
    this.populateAvgSleepiness();
    this.calculateAllAverages();
    this.plotData();
    this.plotData2();
  }

  calculateAllAverages()
  {
    var total = 0;
    for (let i = 0; i < this.timesSlept.length; i++) 
      total += this.timesSlept[i];

    this.avgSleepDuration = total / this.timesSlept.length;

    total = 0;

    for (let i = 0; i < this.avgSleepiness.length; i++) 
      total += this.avgSleepiness[i];

    this.avgSleepinessVal = total / this.avgSleepiness.length;

    total = 0;

    for (let i = 0; i < this.week_timesSlept.length; i++) 
      total += this.week_timesSlept[i];

    this.week_avgSleepDuration = total / this.week_timesSlept.length;

    total = 0;

    for (let i = 0; i < this.week_avgSleepiness.length; i++) 
      total += this.week_avgSleepiness[i];

    this.week_avgSleepinessVal = total / this.week_avgSleepiness.length;
  }

  plotData() 
  {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (this.myChart) 
    {
      this.myChart.destroy();
      this.myChart = undefined;
    }

    this.myChart = new Chart(ctx, {
      type: 'line',
      data: 
      {
        labels: this.timesSleptDates.map(date => date.toISOString()),
        datasets: [{
          label: 'Times Slept',
          data: this.timesSlept,
          borderColor: 'blue',
          backgroundColor: 'transparent',
        }, 
        {
          label: 'Average Sleepiness',
          data: this.avgSleepiness,
          borderColor: 'green',
          backgroundColor: 'transparent',
        }]
      },
      options: 
      {
        scales: 
        {
          x: 
          {
            type: 'time',
            time: 
            {
              unit: 'day'
            }
          },
          y: 
          {
            beginAtZero: true
          }
        }
      }
    });
  }

  plotData2() 
  {
    const ctx = document.getElementById('myChart2') as HTMLCanvasElement;

    if (this.myChart2) 
    {
      this.myChart2.destroy();
      this.myChart2 = undefined;
    }

    this.myChart2 = new Chart(ctx, {
      type: 'line',
      data: 
      {
        labels: this.week_timesSleptDates.map(date => date.toISOString()),
        datasets: [{
          label: 'Times Slept',
          data: this.week_timesSlept,
          borderColor: 'blue',
          backgroundColor: 'transparent',
        }, 
        {
          label: 'Average Sleepiness',
          data: this.week_avgSleepiness,
          borderColor: 'green',
          backgroundColor: 'transparent',
        }]
      },
      options: 
      {
        scales: 
        {
          x: 
          {
            type: 'time',
            time: 
            {
              unit: 'day'
            }
          },
          y: 
          {
            beginAtZero: true
          }
        }
      }
    });
  }

  isDateInCurrentWeek(givenDate: Date): boolean 
  {
    const currentDate = new Date();
    
    const startOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay())
    );
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(
      startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000
    );
    endOfWeek.setHours(23, 59, 59, 999);
    
    return givenDate >= startOfWeek && givenDate <= endOfWeek;
  }

  populateTimesSlept()
  {
    var current_total_log_val = 0;
    var lastDateStr = "";
    var lastDate = new Date();

    for (let i = 0; i < SleepService.AllOvernightData.length; i++) 
    {
      const data = SleepService.AllOvernightData[i];

      if (this.convertDateToDateString(data.loggedAt) == lastDateStr)
      {
        current_total_log_val += data.sleepEnd.getTime() - data.sleepStart.getTime();
      }
      else 
      {
        if (current_total_log_val > 0)
        {
          this.timesSleptDates.push(lastDate);
          this.timesSlept.push(current_total_log_val / (1000 * 60 * 60));

          if (this.isDateInCurrentWeek(lastDate))
          {
            this.week_timesSleptDates.push(lastDate);
            this.week_timesSlept.push(current_total_log_val / (1000 * 60 * 60));
          }
        }
        
        current_total_log_val = data.sleepEnd.getTime() - data.sleepStart.getTime();
        lastDateStr = this.convertDateToDateString(data.loggedAt);
        lastDate = data.loggedAt;
      }
    }

    if (current_total_log_val > 0)
    {
      this.timesSleptDates.push(lastDate);
      this.timesSlept.push(current_total_log_val / (1000 * 60 * 60));

      if (this.isDateInCurrentWeek(lastDate))
      {
        this.week_timesSleptDates.push(lastDate);
        this.week_timesSlept.push(current_total_log_val / (1000 * 60 * 60));
      }
    }
  }

  populateAvgSleepiness()
  {
    var current_total_log_val = 0;
    var count = 0;
    var lastDateStr = "";
    var lastDate = new Date();

    for (let i = 0; i < SleepService.AllSleepinessData.length; i++)
    {
      const data = SleepService.AllSleepinessData[i];

      if (this.convertDateToDateString(data.loggedAt) == lastDateStr)
      {
        count += 1;
        current_total_log_val += data.loggedValue;
      }
      else 
      {
        if (count > 0)
        {
          this.avgSleepinessDates.push(lastDate);
          this.avgSleepiness.push(current_total_log_val / count);

          if (this.isDateInCurrentWeek(lastDate))
          {
            this.week_avgSleepinessDates.push(lastDate);
            this.week_avgSleepiness.push(current_total_log_val / count);
          }
        }
        
        count = 1;

        current_total_log_val = data.loggedValue;
        lastDateStr = this.convertDateToDateString(data.loggedAt);
        lastDate = data.loggedAt;
      }
    }

    if (count > 0)
    {
      this.avgSleepinessDates.push(lastDate);
      this.avgSleepiness.push(current_total_log_val / count);

      if (this.isDateInCurrentWeek(lastDate))
      {
        this.week_avgSleepinessDates.push(lastDate);
        this.week_avgSleepiness.push(current_total_log_val / count);
      }
    }
  }

  convertDateToDateString(date:Date)
  {
    var yearStr = date.getFullYear().toString();
    var monthStr = date.getMonth().toString();
    var dayStr = date.getDate().toString();

    return `${yearStr}-${monthStr}-${dayStr}`;
  }
}
