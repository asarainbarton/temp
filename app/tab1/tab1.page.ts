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

  private myChart: Chart | null = null;

  constructor(private sleepService: SleepService) {}

  async ngOnInit() 
  {
    await this.sleepService.loadData();
    this.populateTimesSlept();
    this.populateAvgSleepiness();
    this.plotData();
  }

  ionViewDidEnter() 
  {
    this.populateTimesSlept();
    this.populateAvgSleepiness();
    this.plotData();
  }

  plotData() 
  {
    if (this.myChart)
      this.myChart.destroy();
    
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'line',
      data: 
      {
        labels: this.timesSleptDates.map(date => date.toDateString()),
        datasets: [{
          label: 'Times Slept',
          data: this.timesSlept,
          borderColor: 'blue',
          backgroundColor: 'transparent',
        }, 
        {
          label: 'Average Sleepiness',
          data: this.avgSleepiness,
          borderColor: 'red',
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
          this.timesSlept.push(current_total_log_val);
        }
        
        current_total_log_val = data.sleepEnd.getTime() - data.sleepStart.getTime();
        lastDateStr = this.convertDateToDateString(data.loggedAt);
        lastDate = data.loggedAt;
      }
    }

    if (current_total_log_val > 0)
    {
      this.timesSleptDates.push(lastDate);
      this.timesSlept.push(current_total_log_val);
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
