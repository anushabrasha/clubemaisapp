import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-pre-login',
  templateUrl: './pre-login.page.html',
  styleUrls: ['./pre-login.page.scss'],
})
export class PreLoginPage implements OnInit {
  hideHeader: Boolean = false;

  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

  openPage(page) {
    this.navCtrl.navigateForward('/' + page);
  }

  openUrl() {
    this.iab.create('https://www.sky.com.br/credenciados', '_system');
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }
}
