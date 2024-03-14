import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonButton]
})

export class Tab2Page {
  numbers = [1, 2, 3, 4, 5, 6, 7];
  selectedNumber: number | undefined;
  showNumbers: boolean = false;

  constructor() {}

  addSleepiness() {
    // Logic to add sleepiness
    this.showNumbers = true;
  }

  selectNumber(number: number) {
    this.selectedNumber = number;
  }

  submitNumber() {
    console.log(this.selectedNumber);
    this.showNumbers = false;
    this.selectedNumber = undefined;
  }
}
