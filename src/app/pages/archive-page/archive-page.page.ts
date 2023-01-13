import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { Events, NavController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';

import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { LoaderService } from '../../services/loader/loader.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';

@Component({
  selector: 'app-archive-page',
  templateUrl: './archive-page.page.html',
  styleUrls: ['./archive-page.page.scss'],
})
export class ArchivePagePage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  hideHeader: Boolean = false; isProduct = false; toHideProductInfo = false; isParaAjudar = false;
  selectedMenu; userPoints; searchString;

  infiniteScrollEvent: any;
  archiveToBackEvent = 'archivePage:toBack';
  hideSearchBar = false;

  userPointsFactor = 1; currentPage = 0;
  productList = [];


  constructor(
    private activeRoute: ActivatedRoute,
    private events: Events,
    private navCtrl: NavController,
    private ctrlPanel: ControlPanelService,
    private apiCtrl: ApiHelperService,
    private dataProvider: DataHolderService,
    private loaderCtrl: LoaderService,

  ) {
    let pointFactor = this.ctrlPanel.getLocalStorageData('conversionFactor');
    if (pointFactor) {
      this.userPointsFactor = pointFactor;
    }
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.selectedMenu = JSON.parse(params["selectedMenu"]);
      if (this.selectedMenu.hideSearch) {
        this.hideSearchBar = true;
      }
    });
    this.handleBackButton();
    this.getuserPoints();
    this.getProductList();
  }

  ionViewDidEnter() {
    this.getuserPoints();
    // this.getProductList();
  }

  eventHandler() {
    this.selectedEvent();
  }

  unSubscribeEvents() {
    this.events.unsubscribe('selected:category');
  }

  selectedEvent() {
    this.events.subscribe('selected:category', (selected) => {
      this.productList = [];
      this.openPage(selected);
    });
  }

  search() {
    this.currentPage = 0;
    this.getProductList();
  }

  listCnovaProduct() {
    this.toHideProductInfo = true;
    this.productList = [
      {
        category: 'extra',
        image_url: 'assets/images/icons/extra.png',
        post_title: 'Extra',
        key: '',
        title: '',
        icon: 'assets/images/icons/shop-headphone-icon.png',
        parentTitle: 'PRODUTOS',
        iscnova: true,
      },
      // ponto  catergory removed
      {
        category: 'casa bahia',
        image_url: 'assets/images/icons/casa.png',
        post_title: 'Casas Bahia',
        title: '',
        icon: 'assets/images/icons/shop-headphone-icon.png',
        parentTitle: 'PRODUTOS',
        key: '',
        iscnova: true,
      }];
    this.toggleInfiniteScroll();
  }

  getProductList() {
    let endPoint = '';
    let method = '';
    let code = '';
    this.isProduct = false;
    let data: any = {};

    if (this.selectedMenu.title.toLowerCase() == 'produtos') {
      this.listCnovaProduct();
      return false;
    }

    if (this.currentPage >= 1) {
      data.page = this.currentPage + 1;
    }
    this.toHideProductInfo = false;

    if (this.selectedMenu.title.toLowerCase() == 'destaques') {
      endPoint = this.dataProvider.endPoints.featuredProduct;
      method = 'get';
      code = 'get_featured_products_success';
    } else if (this.selectedMenu.title.toLowerCase() == 'alimentação') {
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.category = 'food';
    } else if (this.selectedMenu.title.toLowerCase() == 'crédito para combustível') {
      this.toHideProductInfo = false;
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.category = 'crédito para combustível';
    } else if (this.selectedMenu.title.toLowerCase() == 'para ajudar') {
      this.isParaAjudar = true;
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.category = 'para ajudar';
    } else if (this.selectedMenu.category && this.selectedMenu.category.toLowerCase() == 'extra') {
      this.toHideProductInfo = false;
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.store = 'extrahlg';
    } else if (this.selectedMenu.category && this.selectedMenu.category.toLowerCase() == 'ponto') {
      this.toHideProductInfo = false;
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.store = 'pontofriohlg';
    } else if (this.selectedMenu.category && this.selectedMenu.category.toLowerCase() == 'casa bahia') {
      this.toHideProductInfo = false;
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.store = 'casasbahiahlg';
    }
    else if (this.selectedMenu.title.toLowerCase() == 'produtos') {
      // else if (this.selectedMenu.category && this.selectedMenu.category.toLowerCase() == 'extra') {
      this.toHideProductInfo = false;
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.store = 'extrahlg';
      // data.category = 'extrahlg';
    } else if (this.selectedMenu.title.toLowerCase() == 'ferramentas para técnicos') {
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.category = 'ferramentas-sky';
      // data.category = 'extrahlg';
    } else if (this.selectedMenu.title.toLowerCase() == 'transporte') {
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.category = 'transporte';
    } else if (this.selectedMenu.title.toLowerCase() == 'descontos para você') {
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.category = 'descontos-para-voce';
    } else if (this.selectedMenu.title.toLowerCase() == 'produtos sky') {
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.category = 'produtos-sky';
    } else if (this.selectedMenu.title.toLowerCase() == 'vale compras') {
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.category = 'vale compras';
    } else if (this.selectedMenu.title.toLowerCase() == 'créditos para celular') {
      endPoint = this.dataProvider.endPoints.productList;
      method = 'post';
      data.category = 'créditos para celular';
      this.toHideProductInfo = true;
    } else {
      endPoint = '';
    }

    if (!endPoint) {
      return false;
    }

    if (this.searchString) {
      data.search_string = this.searchString;
    }
    this.loaderCtrl.showLoader();

    this.apiCtrl[method](endPoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (!success.data.products || !success.data.products.length) {
        let alertData = {
          isSuccess: 'shop-popup-error',
          message: success.message,
        };
        this.triggerAlert(alertData, 'shop-popup');
        this.toggleInfiniteScroll();
        return false;
      }
      // if (!success.data.products || !success.data.products.length) {
      //   return false;
      // }
      success.data.products.forEach(v => {
        v.price *= this.userPointsFactor;
      });
      if (this.currentPage > 1) {
        this.productList = this.productList.concat(success.data.products);
      } else {
        this.productList = success.data.products;
      }
      this.currentPage = this.currentPage + 1;

      if (success.data.products.length < 10) {
        this.toggleInfiniteScroll();
      } else {
        this.completeInfiniteScrollEvent();
      }

      console.log(this.productList);
      // if (success.data.max_num_pages && success.data.max_num_pages > 1) {
      //   if (this.currentPage < success.data.max_num_pages) {
      //     this.completeInfiniteScrollEvent();
      //   } else {
      //     this.toggleInfiniteScroll();
      //   }
      // } else {
      //   this.toggleInfiniteScroll();
      // }
    }, (error) => {
      this.loaderCtrl.stopLoader();
      this.toggleInfiniteScroll();
      console.log("getProductList error ", error);
    });
  }

  loadMoreData(event) {
    this.infiniteScrollEvent = event;
    this.getProductList();
  }

  completeInfiniteScrollEvent() {
    if (this.infiniteScrollEvent) {
      this.infiniteScrollEvent.target.complete();
    }
  }

  toggleInfiniteScroll() {
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = true;
    }
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

  openPage(SelectedMenu) {
    if (SelectedMenu.url) {
      this.navCtrl.navigateForward(SelectedMenu.url);
    } else {
      this.currentPage = 1;
      this.selectedMenu = SelectedMenu;
      this.toHideProductInfo = false;
      this.searchString = '';
      this.productList = [];
      this.getProductList();
    }
  }


  openProduct(selectedProduct) {
    if (selectedProduct.iscnova) {
      this.selectedMenu = selectedProduct;
      this.currentPage = 1;
      this.getProductList();
      this.hideSearchBar = false;
      return false;
    }
    var data = {
      'selectedMenu': this.selectedMenu,
      'selectedProduct': selectedProduct['id']
    };
    let navigationExtras: NavigationExtras = {
      queryParams: {
        selectedProduct: JSON.stringify(data),
      }
    };
    this.navCtrl.navigateForward(['single-product'], navigationExtras);
  }

  toBack() {
    this.navCtrl.pop();
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.ctrlPanel.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.ctrlPanel.triggerAlert(AlertPopupComponent, alertData);
    }
  }

}
