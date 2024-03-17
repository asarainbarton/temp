import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SleepService } from '../services/sleep.service';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonicModule, CommonModule, NgIf,
    NgForOf],
})
export class Tab3Page {
  selectedDate: string;
  selectedDateInfo: string | null = null;

  constructor(private sleepService: SleepService) 
  {
    this.selectedDate = "";
  }

  dateChanged(event: any) {
    this.selectedDate = event.detail.value;
    this.fetchDateInfo(this.selectedDate);
  }

  fetchDateInfo(date: string) 
  {
    const info = `Information for ${date}`;
    this.selectedDateInfo = info;
  }
}


