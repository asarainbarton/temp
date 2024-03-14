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
  feedbackMessage: string | null = null;
  feedbackMessageColor: string = 'black';

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
  
  submitNumber() {
    let message = '';
    let messageColor = '';
  
    if(this.selectedNumber !== undefined) {
      const sleepinessData = new StanfordSleepinessData(this.selectedNumber);
      this.sleepService.logSleepinessData(sleepinessData);
  
      // For testing/debugging purposes
      this.sleepService.printAllSleepData();
  
      message = 'Data successfully added';
      messageColor = 'green';
    } else {
      message = 'You must select a number';
      messageColor = 'orange';
    }
  
    this.showFeedback(message, messageColor);
  
    this.showNumbers = false;
    this.selectedNumber = undefined;
  }
  
  // Helper method to show feedback message
  showFeedback(message: string, color: string) {
    const feedbackElement = document.createElement('div');
    feedbackElement.textContent = message;
    feedbackElement.style.color = color;
    feedbackElement.style.position = 'absolute';
    feedbackElement.style.bottom = '7%'; // Adjust positioning as needed
    feedbackElement.style.left = '50%';
    feedbackElement.style.transform = 'translateX(-50%)';
    document.body.appendChild(feedbackElement);
  
    setTimeout(() => {
      document.body.removeChild(feedbackElement);
    }, 3000); // Remove the message after 3 seconds
  }
}
