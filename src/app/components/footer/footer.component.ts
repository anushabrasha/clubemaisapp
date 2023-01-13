import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { ShopControlService } from '../../services/shopControl/shop-control.service';
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  CartCount = 0;
  notificationCount;

  constructor(
    private navCtrl: NavController,
    private controlPanel: ControlPanelService,
    private events: Events,
    private shopControl: ShopControlService,
  ) { }

  public footerAccessPage = [
    {
      title: 'Início',
      img: 'assets/images/icons/home-red-icon.png',
      url: '/dash-board',
    },
    {
      title: 'Notificações',
      img: 'assets/images/icons/notification-red-icon.png',
      url: '/notification-page',
    },
    {
      title: 'Carrinho',
      img: 'assets/images/icons/cart-new-red-icon.png',
      url: '/cart',
    },
  ];

  ngOnInit() {
    this.checkCartCount();
    this.eventListner();
  }

  ionViewDidEnter() {
    this.checkCartCount();
    this.handleCartCount();
  }

  ngOnDestroy() {
    this.events.unsubscribe('footer:updateCart');
    this.events.unsubscribe('notification:get');
  }

  eventListner() {
    this.handleNotificationData();
  }

  handleCartCount() {
    this.events.subscribe('footer:updateCart', (type) => {
      this.checkCartCount();
    });
  }

  handleNotificationData() {
    this.events.subscribe('notification:get', (data) => {
      let notificationList = data;
      this.notificationCount = notificationList.notification_count;
      this.controlPanel.updateLocalStorage('notificationCount', this.notificationCount)
    });
  }

  checkCartCount() {
    this.CartCount = this.shopControl.getCartCount();
  }

  openPage(page) {
    this.navCtrl.navigateForward(page.url);
  }

  triggerAlert(alertData) {
    this.controlPanel.triggerAlert(AlertPopupComponent, alertData, 'small-alert');
  }
}
