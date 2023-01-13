import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { Events, NavController } from '@ionic/angular';

import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { LoaderService } from '../../services/loader/loader.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';

@Component({
  selector: 'app-product-type-page',
  templateUrl: './product-type-page.page.html',
  styleUrls: ['./product-type-page.page.scss'],
})
export class ProductTypePagePage implements OnInit {
  hideHeader: Boolean = false;
  userPoints;
  archiveToBackEvent = 'archivePage:toBack';
  selectedMenu = {
    icon: 'assets/images/icons/shop-headphone-icon.png',
    title: 'PRODUTOS',
    url: '/product-type-page'
  };
  productList = [
    {
      id: '01',
      image_url: 'assets/images/icons/extra.png',
      post_title: 'Extra',
      title: 'extra',
      icon: 'assets/images/icons/shop-headphone-icon.png',
    },
    {
      id: '02',
      image_url: 'assets/images/icons/pontofrio.png',
      post_title: 'Ponto Frio',
      title: 'ponto',
      icon: 'assets/images/icons/shop-headphone-icon.png',
    },
    {
      id: '03',
      image_url: 'assets/images/icons/casa.png',
      post_title: 'Casas Bahia',
      title: 'casas',
      icon: 'assets/images/icons/shop-headphone-icon.png',
    },

  ];
  constructor(
    private activeRoute: ActivatedRoute,
    private events: Events,
    private navCtrl: NavController,
    private ctrlPanel: ControlPanelService,
    private apiCtrl: ApiHelperService,
    private dataProvider: DataHolderService,
    private loaderCtrl: LoaderService,
  ) { }

  ngOnInit() {
    this.handleBackButton();
  }

  ionViewDidEnter() {
    this.getuserPoints();
  }

  getuserPoints() {
    let points = this.ctrlPanel.getLocalStorageData('points');
    if (points) {
      this.userPoints = points;
    }
  }

  handleBackButton() {
    this.events.subscribe('archivePage:toBack', (type) => {
      this.navCtrl.pop();
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('archivePage:toBack');
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  toBack() {
    this.navCtrl.pop();
  }

  openPage(SelectedMenu) {
    console.log(SelectedMenu);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        selectedMenu: JSON.stringify(SelectedMenu),
      }
    };
    this.navCtrl.navigateForward(['archive-page'], navigationExtras);
  }
}
