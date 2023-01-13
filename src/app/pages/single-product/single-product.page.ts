import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ɵangular_packages_router_router_h } from "@angular/router";
import { Events, NavController } from '@ionic/angular';

import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { ShopControlService } from '../../services/shopControl/shop-control.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { LoaderService } from '../../services/loader/loader.service';
import { FormControlService } from "../../services/formControl/form-control.service";

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.page.html',
  styleUrls: ['./single-product.page.scss'],
})
export class SingleProductPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    autoplay: true
  };
  sliderImage = [];

  hideHeader: Boolean = false; disableAddToCart = false; rechargeStepOne = true; rechargeStepTwo = false;
  validRechargeNumber = false; hidePointSlider = false; isCnova = false;

  selectedProduct: any = {}; selectedMenu: any = {}; chartPrice: any; is_fuel: any = ''; is_ambPDV: any = '';

  userPoints; userPointFactor; productPrice;
  rechargeTelefoneForm; rechargeTelefoneFormTwo;
  toShowRangeValue; currency; variationId;

  variationList = [];

  rechargeNumber = ''; variationValue: any = ''; productType = ''; productVariationLabel = ''; mothername = ''; validMothername = false;
  rangeValue = 45; minFactor = 10; minRangeValue = 0;
  currencyToView = "0,00"; gateway_tax = "0.945";
  singleProductToBackEvent = 'singleProductPage:toBack';

  constructor(
    private activeRoute: ActivatedRoute,
    private events: Events,
    private navCtrl: NavController,
    private controlPanel: ControlPanelService,
    private shopControl: ShopControlService,
    private apiCtrl: ApiHelperService,
    private dataProvider: DataHolderService,
    private loaderCtrl: LoaderService,
    private formCtrl: FormControlService,
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.selectedMenu = JSON.parse(params["selectedProduct"]).selectedMenu;
      this.selectedProduct.id = JSON.parse(params["selectedProduct"]).selectedProduct;
      console.log(params["selectedProduct"]);
      this.checkProduct();
    });
    this.getUserPointFactor();
    this.handleBackButton();
  }

  getUserPointFactor() {
    let pointFactor = this.controlPanel.getLocalStorageData('conversionFactor');
    if (pointFactor) {
      this.userPointFactor = pointFactor;
    } else {
      this.userPointFactor = 1;
    }
  }

  checkProduct() {
    if (this.selectedProduct.id) {
      this.getSelectedproduct();
    } else {
      let alertData = {
        isSuccess: 'empty',
        message: 'Produto não encontrado.',
      };
      this.triggerAlert(alertData, 'small-alert');
      this.toBack();
    }
  }

  rechargeToNext() {
    this.rechargeUpdatePrice();
    if (this.productPrice > this.userPoints) {
      let alertData = {
        isSuccess: 'empty',
        message: 'Pontos insuficientes.',
      };
      this.triggerAlert(alertData, '');
      return false;
    }
    let selectedVairation = this.variationValue;

    this.variationList.forEach(element => {
      if (element.displayPrice == selectedVairation) {
        this.variationId = element.variationId;
      }
    });
    this.rechargeStepOne = false;
    this.rechargeStepTwo = true;
  }

  rechargeUpdatePrice() {
    if (this.variationValue) {
      let updatedPrice = this.variationValue * this.userPointFactor;
      this.productPrice = updatedPrice;
    }
  }

  submitRecharge() {
    let mobileNumber = this.rechargeTelefoneFormTwo.value.telefone;
    mobileNumber = mobileNumber.replace('-', '');
    mobileNumber = mobileNumber.replace(' ', '-');

    let data = {
      "ope": this.selectedProduct.post_title,
      "val": this.variationValue,
      "cell": mobileNumber,
      "product_id": this.variationId
    };


    let endPoint = this.dataProvider.endPoints.recharge;
    this.loaderCtrl.showLoader();

    this.apiCtrl.post(endPoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.code != "recharge_service_order_success") {
        let alertData = {
          isSuccess: 'shop-popup-error',
          message: success.message,
        };
        this.triggerAlert(alertData, 'shop-popup');
        return false;
      }

      let alertData = {
        isSuccess: 'shop-popup-success',
        message: success.message,
      };
      this.triggerAlert(alertData, 'shop-popup');
      this.navCtrl.navigateRoot('/order-list');
      return false;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log("submitRecharge error ", error);
      let alertData = {
        isSuccess: 'shop-popup-error',
        message: 'OCOREEU UM ERRO',
      };
      this.triggerAlert(alertData, 'shop-popup');
      return false;
    });
  }

  getSelectedproduct() {
    let endPoint = this.dataProvider.endPoints.product;
    let data = {
      'product_id': this.selectedProduct.id
    };
    this.loaderCtrl.showLoader();

    this.apiCtrl.post(endPoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.error) {
        let alertData = {
          isSuccess: 'shop-popup-error',
          message: success.message,
        };
        this.triggerAlert(alertData, 'shop-popup');
        return false;
      }
      this.selectedProduct = success.data;
      if (this.selectedProduct.slug == "kit-pre-pago-flex-hd-com-instalacao" || this.selectedProduct.slug == "kit-pre-pago-flex-hd-sem-instalacao" || this.selectedProduct.slug == "kit-pre-pago-conforto-hd-com-instalacao" || this.selectedProduct.slug == "kit-pre-pago-conforto-hd-sem-instalacao" || this.selectedProduct.slug == "kit-pre-pago-flex-hd" || this.selectedProduct.slug == "kit-pre-pago-conforto-hd-c-recarga-smart") {
        this.productVariationLabel = "SELECIONE O TAMANHO DA ANTENA";
      } else {
        this.productVariationLabel = "SELECIONE A QUANTIDADE DE CRÉDITOS";
      }
      this.selectedProduct.quantity = 1;
      this.productPrice = this.selectedProduct.price;
      this.chartPrice = this.selectedProduct.price;
      this.minRangeValue = this.selectedProduct.price / this.minFactor;
      let updatedValue = this.controlPanel.ptBrNumberFormat(this.chartPrice.toFixed(2), true)
      this.toShowRangeValue = updatedValue;
      this.sliderImage = success.data.product_gallery;
      this.is_fuel = this.selectedProduct.slug == "vale-combustivel" ? this.selectedProduct.slug : '';
      this.is_ambPDV = this.selectedProduct.slug == "ambientacao-pdv" ? this.selectedProduct.slug : '';
      if (this.selectedProduct.sku.includes('recharge')) {
        this.productType = 'recharge';
        this.selectedProduct.sbProductType = 'recharge';
        let variation = this.selectedProduct.variations;
        let totalVariation = variation.length;

        this.simplifyVariationList(variation[totalVariation - 1], variation);
        this.rechargeTelefoneForm = this.formCtrl.rechargeShopFormOneTelefone();
        this.rechargeTelefoneFormTwo = this.formCtrl.rechargeShopFormTwoTelefone();
      } else if (this.selectedProduct.slug.includes('multicash') || this.selectedProduct.slug.includes('vale-presente-cartao')) {
        this.productType = 'multicash';
        let variation = this.selectedProduct.variations;
        let totalVariation = variation.length;

        this.simplifyVariationList(variation[totalVariation - 1], variation);
        if (this.selectedProduct.slug.includes('multicash')) {
          this.selectedProduct.sbProductType = 'multicash';
        } else {
          this.selectedProduct.sbProductType = 'vale-presente';
        }
      } else if (this.selectedProduct.slug.includes('vale-presente-recarga')) {
        this.selectedProduct.sbProductType = 'vale-presente';
        this.productType = 'vale-presente-recarga';

        let variation = this.selectedProduct.variations;
        let totalVariation = variation.length;

        this.simplifyVariationList(variation[totalVariation - 1], variation);

      } else if (this.selectedProduct.slug.includes('cartao-pre-pago-socialbank')) {
        this.selectedProduct.sbProductType = 'vale-presente';
        this.productType = 'social-bank-prepaid';

        let variation = this.selectedProduct.variations;
        let totalVariation = variation.length;

        this.simplifyVariationList(variation[totalVariation - 1], variation);

      } else if (this.selectedProduct.variations && this.selectedProduct.variations.length) {

        if (this.selectedProduct.product_type == 'para-ajudar' || this.is_fuel) {
          this.hidePointSlider = true;
          console.log('in');

        }
        this.productType = 'multicash';
        let variation = this.selectedProduct.variations;
        let totalVariation = variation.length;
        this.selectedProduct.sbProductType = this.selectedProduct.product_type;

        this.simplifyVariationList(variation[totalVariation - 1], variation);
      } else {
        this.selectedProduct.sbProductType = this.selectedProduct.product_type;
        if (this.selectedProduct.product_type == "cnova") {
          // this.isCnova = true;
          this.selectedProduct.notAvailable = true;
          this.checkAvailability();
        }
        this.productType = 'normal';
        let updatedPrice = this.productPrice * this.userPointFactor;
        this.productPrice = updatedPrice;
        this.selectedProduct.price = this.productPrice;
      }

      this.triggerQuantityUpdate(this.selectedProduct);
      if (!this.sliderImage[0]) {
        this.sliderImage[0] = this.selectedProduct.image_url;
      }
      this.variationUpdate();
      console.log(this.productType);

    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log("getSelectedproduct error ", error);
    });
  }

  checkAvailability() {
    let endPoint = this.dataProvider.endPoints.productAvalibility;
    let data = {
      'product_id': this.selectedProduct.id
    };
    this.apiCtrl.post(endPoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.code !== "check_product_availability_success") {
        let alertData = {
          isSuccess: 'empty',
          message: success.message ? success.message : 'PRODUTO INDISPONÍVEL NO MOMENTO',
        };
        this.triggerAlert(alertData, 'shop-popup');
        this.selectedProduct.notAvailable = true;
        return false;
      }
      this.selectedProduct.notAvailable = false;
      // if (success.data.shipping_rate) {
      //   this.selectedProduct.frete = parseFloat(success.data.shipping_rate) * this.userPointFactor;
      // }
      console.log(this.selectedProduct);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log("getSelectedproduct error ", error);
    });
  }

  simplifyVariationList(list, variation) {
    let dataList = [];
    variation.forEach(element => {
      let data: any = {};
      data.displayPrice = element.variation.display_price;
      data.variationId = element.variation.variation_id;
      dataList.push(data);
    });
    let attr = list.attributes || list.attibutes; //In prod, property name is wrong
    attr.forEach((element, index) => {
      let tempData = dataList[index];
      tempData.variantPrice = element.name;
      tempData.slug = element.slug;
    });
    this.variationList = dataList;
    console.log(dataList);

  }

  handleBackButton() {
    this.events.subscribe('singleProductPage:toBack', (type) => {
      this.navCtrl.pop();
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('singleProductPage:toBack');
  }

  ionViewDidEnter() {
    this.getuserPoints();
  }

  getuserPoints() {
    let points = this.controlPanel.getLocalStorageData('points');
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

  addToCart(product) {
    product.points = this.productPrice;
    product.currency = this.currency;
    product.selectedPoints = this.rangeValue.toFixed(2);
    if (this.variationValue) {
      product.varaitionSelected = this.variationValue;
      product.variationId = this.variationId;
    }
    if (this.rechargeNumber) {
      product.rechargeNumber = this.rechargeNumber;
    }
    if (this.mothername) {
      product.mothername = this.mothername;
    }
    let canProcedeToCart = this.shopControl.updateCart(product);
    if (canProcedeToCart.isAllowed) {
      this.navCtrl.navigateForward(['cart']);
    } else {
      this.controlPanel.presentToast(canProcedeToCart.message);
    }
  }

  triggerQuantityUpdate(product) {
    let quantity = parseInt(product.quantity);
    if (quantity == 0 || isNaN(quantity)) {
      product.quantity = 1;
    } else {
      product.quantity = quantity;
    }
    this.updateProductPrice(product.quantity);
  }

  updateQuantity(product, action) {
    if (action == '+') {
      product.quantity = parseInt(product.quantity) + 1;
    } else {
      if (product.quantity == 1) {
        return false;
      } else {
        product.quantity = parseInt(product.quantity) - 1;
      }
    }
    this.updateProductPrice(product.quantity);
  }

  updateProductPrice(quantity) {
    let updatedPrice = this.selectedProduct.price * quantity;

    if (updatedPrice > this.userPoints) {
      let alertData = {
        isSuccess: 'empty',
        message: 'Pontos insuficientes',
      };
      this.triggerAlert(alertData, '');
      this.disableAddToCart = true;
      return false;
    }
    this.disableAddToCart = false;
    this.productPrice = updatedPrice;
    this.chartPrice = updatedPrice;
    this.rangeValue = updatedPrice;
    this.minRangeValue = updatedPrice / this.minFactor;
    let updatedValue = this.controlPanel.ptBrNumberFormat(this.chartPrice.toFixed(2), true);
    this.toShowRangeValue = updatedValue;
  }

  toBack() {
    this.navCtrl.pop();
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  rangeSlider(value) {
    let currency = (this.chartPrice - value) / this.userPointFactor;

    currency = currency / parseFloat(this.gateway_tax);
    let updatedValue = this.controlPanel.ptBrNumberFormat(value.toFixed(2), true);
    this.toShowRangeValue = updatedValue;
    if (this.chartPrice == value) {
      this.currencyToView = '0,00';
      this.currency = '0';
    } else {
      this.currencyToView = this.controlPanel.ptBrNumberFormat(currency.toFixed(2), true);
      this.currency = currency.toFixed(2);
    }
  }

  variationUpdate() {
    console.log('load variation', this.variationValue);
    if (this.variationValue) {
      let updatedPrice = this.variationValue * this.userPointFactor;
      console.log('pontos ', this.variationValue, this.userPoints, updatedPrice);
      this.productPrice = updatedPrice;
      this.chartPrice = updatedPrice;
      this.rangeValue = updatedPrice;
      this.minRangeValue = updatedPrice / this.minFactor;
      let updatedValue = this.controlPanel.ptBrNumberFormat(this.chartPrice.toFixed(2), true);
      this.toShowRangeValue = updatedValue;
      this.selectedProduct.price = this.productPrice;
      this.selectedProduct.quantity = 1;

      let selectedVairation = this.variationValue;
      if (updatedPrice > this.userPoints) {
        let alertData = {
          isSuccess: 'empty',
          message: 'Pontos insuficientes',
        };
        this.triggerAlert(alertData, '');
        this.disableAddToCart = true;
        return false;
      }

      this.variationList.forEach(element => {
        if (element.displayPrice == selectedVairation) {
          this.variationId = element.variationId;
        }
      });
    }
  }

  decreaseSlider() {
    let updatedRange = this.rangeValue - parseFloat('0.01');
    this.rangeValue = updatedRange;
    let updatedValue = this.controlPanel.ptBrNumberFormat(updatedRange.toFixed(2), true);
    this.toShowRangeValue = updatedValue;
  }

  increaseSlider() {
    let updatedRange = this.rangeValue + parseFloat('0.01');
    this.rangeValue = updatedRange;
    let updatedValue = this.controlPanel.ptBrNumberFormat(updatedRange.toFixed(2), true);
    this.toShowRangeValue = updatedValue;
  }

  rechargeMask(event) {
    if (event.target && event.target.value) {
      let number = event.target.value;
      if (number.slice(0, 1) == '8') {
      } else {
        this.rechargeNumber = '8';
      }

      if (number.length >= 16) {
        this.validRechargeNumber = true;
      } else {
        this.validRechargeNumber = false;
      }
    }
  }
  changeMothername(event) {
    let mothername = event.target.value;
    if (mothername !== '') {
      this.validMothername = true;
    } else {
      this.validMothername = false;
    }
  }

}
