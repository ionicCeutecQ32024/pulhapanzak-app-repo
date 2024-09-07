import { Component} from '@angular/core';
import { IonIcon, IonLabel, IonTabs, IonTabBar, IonTabButton, IonHeader, IonToolbar, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline, imageOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonContent, IonToolbar, IonHeader, IonIcon, IonLabel, IonTabs, IonTabBar, IonTabButton]
})
export class TabsPage {

  constructor() {
    addIcons({
      homeOutline,
      personOutline,
      imageOutline
    })
   }

}
