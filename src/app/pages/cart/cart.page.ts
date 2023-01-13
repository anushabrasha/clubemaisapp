import { Component, OnInit } from '@angular/core';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { ShopControlService } from '../../services/shopControl/shop-control.service';
import { Events, NavController } from '@ionic/angular';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { LoaderService } from '../../services/loader/loader.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  hideHeader: Boolean = false;
  productlist = [];
  cartToBackEvent = 'cart:toBack';
  userPoints;
  totalDetail: any = {};
  userDetail;
  preventOrder = false;
  hidePointSlider = false;

  constructor(
    private controlPanel: ControlPanelService,
    private shopControl: ShopControlService,
    private events: Events,
    private navCtrl: NavController,
    private apiCtrl: ApiHelperService,
    private dataProvider: DataHolderService,
    private loaderCtrl: LoaderService,
  ) { }

  ngOnInit() {
    this.userDetail = this.controlPanel.getLocalStorageData('usermeta');
    this.handleBackButton();
  }

  handleBackButton() {
    this.events.subscribe('cart:toBack', (type) => {
      this.navCtrl.pop();
    });
    this.events.subscribe('cart:getCartData', (type) => {
      this.getCartTotal();
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('cart:toBack');
    this.events.unsubscribe('cart:getCartData');
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  ionViewDidEnter() {
    this.getuserPoints();
    this.getCartTotal();
    this.checkCEPUpdated();
  }

  checkCEPUpdated() {
    let updatedCEP = this.controlPanel.getLocalStorageData('updatedCPF');
    if (updatedCEP) {
      this.userDetail = this.controlPanel.getLocalStorageData('usermeta');
      this.userDetail.cep = updatedCEP;
      // this.controlPanel.updateLocalStorage('usermeta', this.userDetail);
    }
    this.getCartDetails();
  }

  getCartTotal() {
    this.totalDetail = this.shopControl.getCartTotal();
    if (this.preventOrder) {
      return false;
    }
    if (this.totalDetail.totalWithFrete > this.userPoints) {
      let alertData = {
        isSuccess: 'empty',
        message: 'Pontos insuficientes.',
      };
      this.triggerAlert(alertData, '');
      this.preventOrder = true;
      return false;
    }
    this.preventOrder = false;
  }

  getuserPoints() {
    let points = this.controlPanel.getLocalStorageData('points');
    if (points) {
      this.userPoints = points;
    }
  }

  toBack() {
    this.navCtrl.pop();
  }

  updateQuantity(product, action) {
    let previousQuantity = product.quantity;
    product.previousQuantity = previousQuantity
    if (action == '+') {
      let quantity = parseInt(product.quantity);
      quantity += 1;
      product.quantity = quantity;
    } else {
      if (product.quantity == 1) {
        this.removeProduct(product);
      } else {
        product.quantity -= 1;
      }
    }
    this.updateProductPrice(product);
  }

  updateProductPrice(product) {
    let singleProductPoint = product.selectedPoints / product.previousQuantity;
    let singleProductCurrency = product.currency / product.previousQuantity;

    let updatedPoint = singleProductPoint * product.quantity;
    let updatedCurrency = singleProductCurrency * product.quantity;

    if (updatedPoint > this.userPoints) {
      let alertData = {
        isSuccess: 'empty',
        message: 'Pontos insuficientes.',
      };
      this.triggerAlert(alertData, '');
      this.preventOrder = true;
      return false;
    }

    this.preventOrder = false;
    product.selectedPoints = updatedPoint;
    product.currency = updatedCurrency;
    this.shopControl.resetCart(this.productlist);
    this.getCartDetails();
  }

  removeProduct(product) {
    let selectedIndex;
    this.productlist.forEach((element, index) => {
      if (element.id == product.id) {
        selectedIndex = index;
      }
    });

    if (selectedIndex >= 0) {
      this.removeProductAction(selectedIndex);
    }
  }

  removeProductAction(index) {
    this.productlist.splice(index, 1);
    if (this.productlist.length) {
      this.shopControl.resetCart(this.productlist);
      this.getCartTotal();
    } else {
      this.shopControl.emptyCart();
      this.toBack();
    }
  }

  getCartDetails() {
    if (!this.productlist.length) {
      this.productlist = this.shopControl.getCartDetails();
    }
    let list = this.productlist;
    let result = list.find(fuel => fuel.slug === "vale-combustivel");
    if (result?.slug == "vale-combustivel") {
      this.hidePointSlider = true;
    }

    let isGifty = this.shopControl.checkIfGiffty(list);
    let isCnova = this.shopControl.checkIfCnova(list);
    if (isGifty) {
      this.getFreteDetails();
    } else if (isCnova) {
      this.getFreteCnovaDetails();
    } else {
      this.getCartTotal();
    }
  }

  getFreteDetails() {
    let data = { 'cart_items': [] };
    let product = this.productlist;
    let endPoint = this.dataProvider.endPoints.gifftyFrete;

    product.forEach(element => {
      let structure = {
        "product_id": element.id,
        "quantity": element.quantity,
        "variation_id": element.variationId ? element.variationId : ''
      };
      data.cart_items.push(structure);
    });
    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endPoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.code !== "get_giftty_cart_success") {
        let alertData = {
          isSuccess: 'empty',
          message: success.message ? success.message : 'PRODUTO INDISPONÍVEL NO MOMENTO',
        };
        this.triggerAlert(alertData, 'shop-popup');
        this.errorWithGiffty();
        return false;
      }
      this.shopControl.concatGiftyFrete(success.data, product);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      this.errorWithGiffty();
      console.log("getSelectedproduct error ", error);
    });
  }

  errorWithGiffty() {
    let latestList = this.productlist.pop();
    this.shopControl.resetCart(latestList);
    this.toBack();
  }

  getFreteCnovaDetails() {
    let data = {
      "cart_items": [],
      "cep": this.userDetail.cep
    };
    let product = this.productlist;
    let endPoint = this.dataProvider.endPoints.cnovaFrete;

    product.forEach(element => {
      let structure = {
        "product_id": element.id,
        "quantity": element.quantity,
        "points_to_redeem": "0",
        "cash_to_pay_in_points": "0"
      };
      data.cart_items.push(structure);
    });
    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endPoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.code !== "get_cnova_cart_success") {
        let alertData = {
          isSuccess: 'empty',
          message: success.message ? success.message : 'PRODUTO INDISPONÍVEL NO MOMENTO',
        };
        this.triggerAlert(alertData, 'shop-popup');
        this.errorWithConva();
        return false;
      }
      let conversionFactor = this.controlPanel.getLocalStorageData('conversionFactor');
      this.shopControl.concatCnovaFrete(success.data.ValorFrete, conversionFactor);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      this.errorWithConva();
      console.log("getSelectedproduct error ", error);
    });
  }

  errorWithConva() {
    let latestList = this.productlist.pop();
    this.shopControl.resetCart(latestList);
    this.toBack();
  }

  toCheckout() {
    this.navCtrl.navigateForward('/checkout');
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData);
    }
  }

}
