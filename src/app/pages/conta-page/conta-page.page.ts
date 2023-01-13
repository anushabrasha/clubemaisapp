import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';

import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import * as moment from 'moment';
@Component({
  selector: 'app-conta-page',
  templateUrl: './conta-page.page.html',
  styleUrls: ['./conta-page.page.scss'],
})
export class ContaPagePage implements OnInit {
  hideHeader: Boolean = false;
  firstStep: Boolean = true;
  secondStep: Boolean = false;
  userPoints;
  userPointFactor: any = 1;
  contaData: any = {};
  barCodeValue = '';
  disableBarCodeScaner = false;
  rules;

  constructor(
    private navCtrl: NavController,
    private ctrlPanel: ControlPanelService,
    private platform: Platform,
    private dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private barcodeScanner: BarcodeScanner,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.checkAvailability();

    /*let alertData = {
      isSuccess: 'pcontas-popup-alert',
      message: 'ATENÇÃO!! O serviço de pagamento sofreu uma alteração e a partir de hoje este benefício é exclusivo para pagamento de contas de concessionárias (água, luz, gás, telefone etc). Para identificar se o seu boleto é válido, confira se o código de barras começa com o número 8.',
    };
    this.triggerAlert(alertData, 'Error-Success');*/
  }

  ionViewDidEnter() {
    if (!this.platform.is("cordova")) {
      this.disableBarCodeScaner = true;
    }
    this.getuserPoints();
    this.getProductID();
  }


  getProductID() {
    let endPoint = this.dataProvider.endPoints.product;
    let data = {
      'product_id': '2019'
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
      this.rules = success.data.product_page_content;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log("getSelectedproduct error ", error);
    });
  }

  submitConta() {
    let alertData = {
      isSuccess: 'empty',
      message: '',
    };

    let valor = parseFloat(this.contaData.boleto ? this.contaData.boleto.replace('.', '').replace(',', '.') : '');
    let discount = parseFloat(this.contaData.discount ? this.contaData.discount.replace('.', '').replace(',', '.') : '');
    let points = parseFloat(this.contaData.pontos || 0);
    let barcode = this.barCodeValue ? this.barCodeValue.replace('-', '') : '';

    if (!barcode) {
      alertData.message = "Código de barras inválido";
    } else if (!this.contaData.vencimento) {
      alertData.message = "Data de vencimento inválida";
    } else if (!valor) {
      alertData.message = "Valor do boleto inválido";
    } else if (!points) {
      alertData.message = "Pontos inválidos";
    } else {

    }

    if (alertData.message) {
      this.triggerAlert(alertData, 'small-alert');
      return false;
    }

    alertData.message = '';
    if ((barcode.length < 40 || !(valor > 0 && valor < 250000))) {
      alertData.message = 'Preencha todos os campos corretamente';
    }

    if (alertData.message) {
      this.triggerAlert(alertData, 'small-alert');
      return false;
    }
    this.contaData.vencimento = moment(this.contaData.vencimento).format('YYYY-MM-DD');

    let data = {
      expiration: this.contaData.vencimento,
      barcode: barcode,
      value: valor,
      points: points,
      discount: discount
    }
    let endpoint = this.dataProvider.endPoints.barcodeCreate;
    this.loaderCtrl.showLoader();

    this.apiCtrl.post(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      try {
        success = JSON.parse(success);
      } catch (e) {
        this.barCodeValue = '';
        this.contaData.vencimento = '';
        this.contaData.boleto = '';
        this.contaData.totalValue = '';
        this.contaData.pontos = '';
        console.log('Nao convertei');
      }
      let msg = '';
      let isSuccess;
      if (typeof success === 'object') {
        if (success.data && success.data.Id) {
          msg = "Conta registrado com sucesso.";
          isSuccess = true;
        } else if (typeof success.data === 'string') {
          msg = success.data;
        } else {
          for (var i in success.data) {
            if (success.data[i]) {
              //msg += success.data[i] + "<br>";
            } else {
              msg = "Boleto não encontrado na base centralizada, verifique com o emissor. Não foi possível realizar o pagamento, tente mais tarde.";
              isSuccess = false;
            }
          }
        }
      } else {
        msg = success.data ? success.data : success;
        isSuccess = true;
      }
      if (!msg) {
        msg = "NÃO FOI POSSÍVEL COMPLETAR A TRANSAÇÃO, TENTE MAIS TARDE.<br>" +
          "Verifique na tela 'Seus Pedidos' se a transação não foi mesmo realizada antes de tentar novamente";
        isSuccess = false;
      }
      let alertData = {
        isSuccess: isSuccess ? 'shop-popup-success' : 'shop-popup-error',
        message: msg,
      };
      this.triggerAlert(alertData, '');
      if (isSuccess) {
        this.contaData = {};
      }
      return false;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });
  }

  openBarcode() {
    let options: BarcodeScannerOptions = {
      preferFrontCamera: false, // iOS and Android
      showFlipCameraButton: false, // iOS and Android
      showTorchButton: true, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      prompt: "Posicione a linha vermelha no código de barras", // Android
      resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      // formats: "EAN_13,EAN_8,CODE_39,CODE_93,CODE_128,ITF", // default: all but PDF_417 and RSS_EXPANDED
      orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: true, // iOS
      disableSuccessBeep: true // iOS and Android
    };

    this.barcodeScanner.scan(options).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if (barcodeData.text) {
        this.generateCheckSum(barcodeData.text)
      } else {
        this.barCodeValue = '';
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  generateCheckSum(code) {
    if (code.length != 44) {
      this.barCodeValue = code;
      this.checkBarcode();
      return false;
    }
    let list = code.match(/.{1,11}/g);
    let holder = '';
    list.forEach(element => {
      holder = holder + element.toString() + this.ctrlPanel.getCheckSum(element);
    });
    this.barCodeValue = holder;
    this.checkBarcode();
  }

  checkBarcode() {
    let endpoint = this.dataProvider.endPoints.checkBarcode;
    let data = {
      'barcode': this.barCodeValue,
    };
    this.loaderCtrl.showLoader();
    this.apiCtrl.get(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.data) {
        success.data = JSON.parse(success.data);
      }
      if (!success.status || !success.data || !success.data.Valor) {
        this.barCodeValue = '';
        let alertData = {
          isSuccess: 'empty',
          message: success.data ? success.data : 'Código de barras ou linha digitável inválidos.',
        };
        this.triggerAlert(alertData, 'small-alert');
        return false;
      }
      if (success.data.Vencimento) {
        if (success.data.Vencimento.indexOf('/')) {
          success.data.Vencimento = success.data.Vencimento.split('/');
          success.data.Vencimento.reverse();
          success.data.Vencimento = success.data.Vencimento.join('-');
        }
        this.contaData.vencimento = success.data.Vencimento;
      }
      var valor = parseFloat(success.data.Valor);
      this.contaData.boleto = this.ctrlPanel.ptBrNumberFormat(valor, true);

      this.maskMoney(this.contaData.boleto);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      this.barCodeValue = '';
      console.log("openBarcode error ", error);
    });
  }

  getuserPoints() {
    let points = this.ctrlPanel.getLocalStorageData('points');
    let pointFactor = this.ctrlPanel.getLocalStorageData('conversionFactor');

    if (points) {
      this.userPoints = points;
    }

    if (pointFactor) {
      this.userPointFactor = pointFactor;
    }
  }

  maskMoney(event, delay?) {
    if (!delay) {
      setTimeout(() => { this.maskMoney(event, true) }, 100);
      return;
    }
    let value;
    if (event.target && event.target.value) {
      value = new String(event.target.value);
    } else {
      value = new String(event);
    }

    let boleto: any = this.contaData.boleto ? this.contaData.boleto.replace(/[\D]+/g, '') + '' : '0';
    let discount: any = this.contaData.discount ? this.contaData.discount.replace(/[\D]+/g, '') + '' : '0';

    if (boleto.length < 3) {
      boleto = this.lpad(boleto, 3);
    }
    if (discount.length < 3) {
      discount = this.lpad(discount, 3);
    }
    boleto = parseFloat(boleto) / 100;
    discount = parseFloat(discount) / 100;

    boleto = boleto.toFixed(2);
    discount = discount.toFixed(2);

    boleto = boleto.replace(/([0-9]+).([0-9]{2})$/g, "$1.$2");
    discount = discount.replace(/([0-9]+).([0-9]{2})$/g, "$1.$2");

    boleto = parseFloat(boleto);
    discount = parseFloat(discount);

    let total = boleto - discount;

    this.contaData.boleto = this.numberformat(boleto, 2, 3, '.', ',');
    this.contaData.discount = this.numberformat(discount, 2, 3, '.', ',');
    this.contaData.totalValue = this.numberformat(total, 2, 3, '.', ',');
    this.contaData.pontos = this.calculatePoints(total);
    this.cdRef.detectChanges();
  }

  calculatePoints(real) {
    var calc = real * this.userPointFactor * 1.04;
    return isNaN(calc) ? 0 : calc.toFixed(2);
  }

  lpad(n, width, z?) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  numberformat(a, n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
      num = a.toFixed(Math.max(0, ~~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
  }

  acceptTerms() {
    this.firstStep = false;
    this.secondStep = true;
    this.ctrlPanel.scrollToTop();
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.ctrlPanel.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.ctrlPanel.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  toBack() {
    this.navCtrl.pop();
  }

  checkAvailability() {
    let enablePopup = this.ctrlPanel.getLocalStorageData('enablePopup');
    let descPopup = this.ctrlPanel.getLocalStorageData('descriptionPopup');
    descPopup = descPopup ? descPopup : 'Parceiro com serviço temporariamente indisponível.';

    if (enablePopup) {
      let alertData = {
        isSuccess: 'pcontas-popup-error',
        message: descPopup,
      };
      this.triggerAlert(alertData, 'shop-popup');
      return false;
    }


  }
}
