import { Component, OnInit, Input } from '@angular/core';
import { MenuController, Events, NavController } from '@ionic/angular';

import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() backArrow: any;
  @Input() preventAll: any;

  notificationCount = 0;
  hideAll = false;


  constructor(
    public menuCtrl: MenuController,
    private events: Events,
    public navCtrl: NavController,
    public controlPanel: ControlPanelService,
    private dataHolder: DataHolderService
  ) { }

  ngOnInit() {
    if (this.backArrow) {
      this.enableBackArrow();
    }
    this.hideAll = this.preventAll;
    this.eventListner();
  }

  toggleMenu() {
    let info = this.controlPanel.getLocalStorageData('isForcedRegulamento');
    if (info) {
      return false;
    }
    this.menuCtrl.enable(true);
    this.menuCtrl.toggle();
  }

  enableBackArrow() {

  }

  openDashboardPage() {
    if (!this.hideAll) {
      this.navCtrl.navigateRoot('dash-board');
    }
  }

  openNotificationPage() {
    let info = this.controlPanel.getLocalStorageData('isForcedRegulamento');
    if (info) {
      return false;
    }
    this.navCtrl.navigateForward('notification-page');
  }

  ngOnDestroy() {
    this.events.unsubscribe('notification:get');
  }

  eventListner() {
    this.handleNotificationData();
  }

  triggerAlert(alertData) {
    this.controlPanel.triggerAlert(AlertPopupComponent, alertData, 'small-alert');
  }

  toBack() {
    let tokens = this.backArrow.split(':');
    let key = tokens[0] + ':' + tokens[1];
    this.controlPanel.publishCustomEvent(key);
  }

  handleNotificationData() {
    this.events.subscribe('notification:get', (data) => {
      let notificationList = data;
      this.notificationCount = notificationList.notification_count;
    });
  }
}
