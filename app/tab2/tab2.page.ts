import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NgIf, NgForOf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';

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
  isLoggingBedtime: boolean = !this.sleepService.getCurrentSleepMode();
  randImageInt = Math.floor(Math.random() * 5) + 1;
  dayImagePath = `assets/images/day/sunrise${this.randImageInt}.jpg`;
  nightImagePath = `assets/images/night/sunset${this.randImageInt}.jpg`;
  private feedbackTimeout: any;

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

  handleLogBedtimeData() 
  {
    let message = '';
    let messageColor = '';

    // If true, then user pressed "log wakeup time" button
    if (this.sleepService.getCurrentSleepMode()) 
    {
      // Error
      if (this.sleepService.getCurrentSleepDateTime() === null)
      {
        message = "Error Extracting Bedtime Time";
        messageColor = "orange";
        this.showFeedback(message, messageColor);
      }
      else // We have a bedtime time
      {
        let currDate:Date = new Date();
        const overnightData = new OvernightSleepData(this.sleepService.getCurrentSleepDateTime(), currDate);
        this.sleepService.logOvernightData(overnightData);
        
        message = "Data successfully logged\n(" + this.getTimeSlept(this.sleepService.getCurrentSleepDateTime(), currDate) + ")";
        messageColor = 'green';

        // For testing/debugging purposes
        this.sleepService.printAllSleepData();

        this.showFeedback(message, messageColor);
      }

      this.sleepService.setCurrentSleepMode(false);
      this.isLoggingBedtime = true;
    } 
    else // In this case, user had just clicked "log bedtime" button
    {
      // This value will get stored and saved overnight
      this.sleepService.setSleepDateTime(new Date());
      this.sleepService.setCurrentSleepMode(true);
      this.isLoggingBedtime = false;
      this.cancel();

      message = "Bedtime Successfully Set";
      messageColor = 'green';

      this.showFeedback(message, messageColor);
    }

    this.randImageInt = Math.floor(Math.random() * 5) + 1;
    this.dayImagePath = `assets/images/day/sunrise${this.randImageInt}.jpg`;
    this.nightImagePath = `assets/images/night/sunset${this.randImageInt}.jpg`;

    console.log(this.dayImagePath);
  }

  getTimeSlept(start:Date, end:Date)
  {
    var sleepStart_ms = start.getTime();
		var sleepEnd_ms = end.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = sleepEnd_ms - sleepStart_ms;
		    
		// Convert to hours and minutes
		return Math.floor(difference_ms / (1000*60*60)) + " hours, " + Math.floor(difference_ms / (1000*60) % 60) + " minutes.";
  }
  
  submitNumber() {
    let message = '';
    let messageColor = '';
  
    if(this.selectedNumber !== undefined) {
      const sleepinessData = new StanfordSleepinessData(this.selectedNumber);
      this.sleepService.logSleepinessData(sleepinessData);
  
      // For testing/debugging purposes
      this.sleepService.printAllSleepData();
  
      message = 'Data Successfully Added';
      messageColor = 'green';
    } else {
      message = 'You must select a number';
      messageColor = 'orange';
    }
  
    this.showFeedback(message, messageColor);
  
    this.showNumbers = false;
    this.selectedNumber = undefined;
  }

  showFeedback(message: string, color: string) {
    // Clear any existing timeout to prevent overlap
    clearTimeout(this.feedbackTimeout);
  
    // Attempt to remove any existing feedback element first
    const existingFeedback = document.querySelector('.feedback-message');
    if (existingFeedback) {
      document.body.removeChild(existingFeedback);
    }
  
    const feedbackElement = document.createElement('div');
    feedbackElement.textContent = message;
    feedbackElement.style.color = color;
    feedbackElement.style.position = 'absolute';
    feedbackElement.style.bottom = '70%';
    feedbackElement.style.left = '50%';
    feedbackElement.style.transform = 'translateX(-50%)';
    feedbackElement.className = 'feedback-message'; // Assign a class for easy removal
    document.body.appendChild(feedbackElement);
  
    // Set a new timeout and store its reference
    this.feedbackTimeout = setTimeout(() => {
      if (document.body.contains(feedbackElement)) {
        document.body.removeChild(feedbackElement);
      }
    }, 2500); // Adjust timeout as needed
  }
  
}
