import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NgIf, NgForOf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    IonButton,
    NgIf,
    NgForOf,
    CommonModule
  ]
})
export class Tab2Page {
  numbers = [1, 2, 3, 4, 5, 6, 7];
  selectedNumber: number | undefined;
  showNumbers: boolean = false;

  constructor(private sleepService: SleepService) {}

  addSleepiness() {
    // Logic to add sleepiness
    this.showNumbers = true;
  }

  selectNumber(number: number) {
    this.selectedNumber = number;
  }

  cancel() {
    this.selectedNumber = undefined;
    this.showNumbers = false;
  }

  getButtonColor(number: number): string {
    const greenToRedRatio = number / 7;
    return `hsl(${120 - greenToRedRatio * 120}, 60%, 50%)`; // HSL from green to red
  }
  
  submitNumber() 
  {
    if(this.selectedNumber !== undefined) 
    {
      const sleepinessData = new StanfordSleepinessData(this.selectedNumber);
      this.sleepService.logSleepinessData(sleepinessData);

      // For testing/debigging purposes
      this.sleepService.printAllSleepData();
    }
    this.showNumbers = false;
    this.selectedNumber = undefined;
  }
}
