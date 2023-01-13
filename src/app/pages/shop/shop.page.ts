import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Events, NavController } from '@ionic/angular';

import { ControlPanelService } from '../../services/controlPanel/control-panel.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  hideHeader: Boolean = false;
  userPoints;
  filterMenuList;

  allMenuList = [
    {
      icon: 'assets/images/icons/shop-star-icon.png',
      title: 'DESTAQUES',
    },
    {
      icon: 'assets/images/icons/shop-spoon-icon.png',
      title: 'ALIMENTAÇÃO',
    },
    {
      icon: 'assets/images/icons/shop-petrol-icon.png',
      title: 'CRÉDITO PARA COMBUSTÍVEL',
    },
    {
      icon: 'assets/images/icons/shop-phone-icon.png',
      title: 'CRÉDITOS PARA CELULAR',
    },
    {
      icon: 'assets/images/icons/shop-list-icon.png',
      title: 'PAGAMENTO DE CONTAS',
      url: '/conta-page'
    },
    {
      icon: 'assets/images/icons/shop-heart-icon.png',
      title: 'PARA AJUDAR',
    },
    {
      icon: 'assets/images/icons/shop-headphone-icon.png',
      title: 'PRODUTOS',
      hideSearch: true
      // url: '/product-type-page'
    },
    // {
    //   icon: 'assets/images/icons/shop-car-icon.png',
    //   title: 'TRANSPORTE',
    // },
    {
      icon: 'assets/images/icons/shop-cart-icon.png',
      title: 'VALE COMPRAS',
    },
  ]

  constructor(
    private events: Events,
    private ctrlPanel: ControlPanelService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.filterMenuList = this.allMenuList;
  }

  ionViewDidEnter() {
    this.getuserPoints();
    this.checkIsDesconto();
    this.produtosSkyVisibility();
  }

  checkIsDesconto() {

    let isDesconto = this.ctrlPanel.getLocalStorageData('is_desconto_visible');
    if (!isDesconto) {
      return false;
    }
    let descontoMenu = {
      icon: 'assets/images/icons/discount-icon.png',
      title: 'DESCONTOS PARA VOCÊ',
    };
    let isMenuPresent = false;
    this.allMenuList.forEach(menu => {
      if (menu.title == 'DESCONTOS PARA VOCÊ') {
        isMenuPresent = true;
      }
    });
    if (!isMenuPresent) {
      this.allMenuList.unshift(descontoMenu);
    }
  }

  produtosSkyVisibility() {

    let produtoVisible = this.ctrlPanel.getLocalStorageData('produtos_sky_category_visiblility');
    if (!produtoVisible) {
      return false;
    }
    let produtosSkyMenu = {
      icon: 'assets/images/icons/shop-sky-icon.png',
      title: 'PRODUTOS SKY',
    };
    let isMenuPresent = false;
    this.allMenuList.forEach(menu => {
      if (menu.title == 'PRODUTOS SKY') {
        isMenuPresent = true;
      }
    });
    if (!isMenuPresent) {
      this.allMenuList.unshift(produtosSkyMenu);
    }
  }

  getuserPoints() {
    let points = this.ctrlPanel.getLocalStorageData('points');
    if (points) {
      this.userPoints = points;
    }
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  openPage(SelectedMenu) {
    console.log(SelectedMenu);
    if (SelectedMenu.url) {
      this.navCtrl.navigateForward(SelectedMenu.url);
    } else {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          selectedMenu: JSON.stringify(SelectedMenu),
        }
      };
      this.navCtrl.navigateForward(['archive-page'], navigationExtras);
    }
  }

  toBack() {
    this.navCtrl.pop();
  }

  searchCategory(event) {
    let value = event.target.value;
    let filteredMenu = [];
    if (value && value.trim() !== '') {
      this.filterMenuList = this.filterMenuList.filter((menu) => {
        if (menu.title.toLowerCase().indexOf(value.toLowerCase()) > -1) {
          filteredMenu.push(menu);
        }
      })
      this.filterMenuList = filteredMenu;
    }
  }

  onCancel() {
    this.filterMenuList = this.allMenuList;
  }
}
