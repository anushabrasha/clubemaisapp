import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { FormControlService } from '../../services/formControl/form-control.service';
import { ShopControlService } from '../../services/shopControl/shop-control.service';


import { LoaderService } from '../../services/loader/loader.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  hideHeader: Boolean = false;
  checkoutForm;
  stateList = [];
  errorClass = 'error';
  userPoints;
  initialCEP;
  cepDetails = {
    cep: "",
    cidade: "",
    bairro: "",
    rua: "",
    estado: "",
  };
  payment_link = "https://skydev.scit.pt/checkout/order-pay/21771/?pay_for_order=true&iframe=true&key=wc_order_eswZN4655wpfZ";
  userToken;
  productList;
  orderSuccessView: Boolean = false;

  constructor(
    private controlPanelService: ControlPanelService,
    private events: Events,
    private navCtrl: NavController,
    public dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private formCtrl: FormControlService,
    private shopCtrl: ShopControlService,
    private iab: InAppBrowser,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.getuserDetail();
    this.getStatelist();
    this.getuserPoints();
    this.getUserToken();
    this.eventHandler();
    this.getProductDetail();
    // this.openInApp(this.payment_link);
  }

  ngOnDestroy() {
    this.events.unsubscribe('userDetail:get');
    this.events.unsubscribe('checkout-doubleCheckPassword');
  }

  eventHandler() {
    this.events.subscribe('checkout-doubleCheckPassword', (otp) => {
      this.placeOrder(otp);
    });
  }

  getUserToken() {
    let token = this.controlPanelService.getLocalStorageData('x-auth-sb');
    this.userToken = token;
  }

  getuserPoints() {
    let points = this.controlPanelService.getLocalStorageData('points');
    if (points) {
      this.userPoints = points;
    }
  }

  getProductDetail() {
    this.productList = this.shopCtrl.getCartDetails();
    console.log(this.productList)
  }

  toBack() {
    this.navCtrl.pop();
  }

  getStatelist() {
    let state = this.dataProvider.state;
    let keys = Object.keys(state);
    keys.forEach(element => {
      let data: any = {};
      data.key = element;
      data.text = state[element];
      this.stateList.push(data);
    });
  }

  getuserDetail() {
    this.controlPanelService.getUserDetailsServer('userDetail:get');
    this.initilizeGetUserEvent();
  }

  initilizeGetUserEvent() {
    this.events.subscribe('userDetail:get', (userData) => {
      console.log(userData);
      userData.meta.Nome = userData.sky.Nome;
      this.initialCEP = userData.meta.billing_postcode;
      this.cepDetails.cidade = userData.meta.billing_city;
      this.cepDetails.bairro = userData.meta.billing_neighbor;
      this.cepDetails.rua = userData.meta.billing_address_1;
      this.cepDetails.estado = userData.meta.billing_state;
      let updatedCep = this.controlPanelService.getLocalStorageData('updatedCPF');
      if (updatedCep) {
        userData.meta.billing_postcode = updatedCep;
      } else {
        this.cepDetails.cep = this.initialCEP;
      }
      this.checkoutForm = this.formCtrl.checkOutForm(userData.meta);
      if (updatedCep) {
        this.cepDetails.cep = updatedCep;
        this.initialCEP = updatedCep;
        this.getLocationDetail();
      }
    });
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  getLocationDetail() {
    let cep = this.checkoutForm.controls.cep.value;
    this.loaderCtrl.showLoader();
    this.apiCtrl.getCepDetail(cep).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      this.controlPanelService.updateLocalStorage('updatedCPF', this.checkoutForm.controls.cep.value);
      let data = success;
      this.cepDetails.cidade = data.localidade;
      this.cepDetails.bairro = data.bairro;
      this.cepDetails.rua = data.logradouro;
      this.cepDetails.estado = data.uf;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      this.cepDetails = {
        cep: '',
        cidade: "",
        bairro: "",
        rua: "",
        estado: "",
      };
      console.log("getLocationDetail error ", error);
    });
  }

  async placeOrder(otp) {
    let userData = this.checkoutForm.value;

    if (userData.cep.replace(/\D+/g, '') != this.initialCEP.replace(/\D+/g, '')) {
      let alertData = {
        isSuccess: 'empty',
        message: 'CEP trocado, você foi redirecionado ao carrinho para recalcular o frete.',
      };
      this.triggerAlert(alertData, 'small-alert');
      this.toBack();
      return false;
    }

    let cartDetail = await this.shopCtrl.getCartDetails();
    let orderDetails = [];
    let paymentMethod = "Paypal";

    cartDetail.forEach(element => {
      let data: any = {
        'product_id': element.id.toString(),
        'quantity': element.quantity.toString(),
        'points_to_redeem': element.selectedPoints.toString(),
        'cash_to_pay_in_points': 0
      };

      if (element.rechargeNumber) {
        data.card_number = element.rechargeNumber;
      }
      if (element.mothername) {
        data.social_bank_mother_name = element.mothername;
      }

      if (element.variationId) {
        data.variation_id = element.variationId;
      }
      orderDetails.push(data);
    });

    if (!orderDetails.length) {
      this.toBack();
      let alertData = {
        isSuccess: 'empty',
        message: 'Você não pode fazer um pedido se o carrinho estiver vazio.',
      };
      this.triggerAlert(alertData, 'small-alert');
      return false;
    }

    let data = {
      "order_otp": otp,
      "order": {
        "line_items": orderDetails,
        "payment_method": paymentMethod,
        "checkout_billing": [
          {
            "billing_first_name": userData.firstName,
            "billing_last_name": '-',
            "billing_email": userData.email,
            "billing_phone": userData.telefone.replace(/\D+/g, ''),
            "billing_address_1": userData.endereco,
            "billing_address_2": userData.complemento,
            "billing_city": userData.cidade,
            "billing_state": userData.estado,
            "billing_postcode": userData.cep.replace(/\D+/g, ''),
            "billing_number": userData.number,
            "billing_neighbor": userData.bairro,
            "billing_referencia": userData.pontoDeReference,
          }
        ],
        "checkout_shipping": [
          {
            "shipping_first_name": userData.firstName,
            "shipping_last_name": '-',
            "shipping_email": userData.email,
            "shipping_phone": userData.telefone.replace(/\D+/g, ''),
            "shipping_address_1": userData.endereco,
            "shipping_address_2": userData.complemento,
            "shipping_city": userData.cidade,
            "shipping_state": userData.estado,
            "shipping_postcode": userData.cep.replace(/\D+/g, ''),
            "shipping_number": userData.number,
            "shipping_neighbor": userData.bairro,
            "shipping_referencia": userData.pontoDeReference,
          }
        ],
      }
    };

    console.log(data);

    let endpoint = this.dataProvider.endPoints.order;
    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let successMessage = ['create_ecom_order_success'];

      if (success && !successMessage.includes(success.code)) {
        if (success.message.includes('atualização pelo parceiro') && success.message.includes('refaça')) {
          let alertData = {
            isSuccess: 'empty',
            message: success.message,
          };
          this.triggerAlert(alertData, 'small-alert');
          this.navCtrl.navigateRoot('/shop');
          return false;
        }
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.triggerAlert(alertData, 'small-alert');
        return false;
      }
      this.shopCtrl.emptyCart();

      let orderDetail = success.data;

      if (!orderDetail.payment_link) {
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.triggerAlert(alertData, 'small-alert');
        this.orderSuccessView = true;
        return false;
      }

      let paymentLink = orderDetail.payment_link;
      this.openInApp(paymentLink);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
      this.shopCtrl.emptyCart();
      let alertData = {
        isSuccess: 'empty',
        message: 'Erro ao fazer o pedido, tente novamente mais tarde',
      };
      this.triggerAlert(alertData, 'small-alert');
      this.navCtrl.navigateRoot('/shop');
    });
  }

  openInApp(paymentLink) {
    let options: InAppBrowserOptions = {
      'location': 'yes',
      'fullscreen': 'yes',
    };
    let token = encodeURIComponent(this.userToken);
    let url = paymentLink + "&checkout_token=" + token;
    console.log(url);

    const browser = this.iab.create(url, '_blank', options);

    browser.on('loadstart').subscribe(event => {
      var eventURL = event.url;
      var checkMobileUrl = eventURL.includes("/checkout/order-received/");
      if (checkMobileUrl) {
        this.navCtrl.navigateRoot('/order-list');
        browser.close();
      }
    });

    browser.on('exit').subscribe(event => {
      this.navCtrl.navigateRoot('/order-list');
    });
  }

  generateOtp() {
    this.controlPanelService.generateOtp('checkout', AlertPopupComponent);
  }
}
