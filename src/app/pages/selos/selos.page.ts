import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-selos',
  templateUrl: './selos.page.html',
  styleUrls: ['./selos.page.scss'],
})
export class SelosPage implements OnInit {
  hideHeader: Boolean = false;
  pageTitle = 'Selos';
  constructor(
    private events: Events,
    private navCtrl: NavController,
  ) { 
  }

  ngOnInit() {
  }
  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

}
