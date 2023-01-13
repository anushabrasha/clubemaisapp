import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, Events } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';
import { FormControlService } from '../../services/formControl/form-control.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

  userData = {
    cpf: '',
    password: ''
  };
  loginPageForm;
  errorClass = 'error';

  constructor(
    public menuCtrl: MenuController,
    private events: Events,
    private navCtrl: NavController,
    private dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private formCtrl: FormControlService,
    private controlPanelService: ControlPanelService,
    private iab: InAppBrowser,
  ) {
    this.eventHandlers();
    this.menuCtrl.enable(false);
    this.loginPageForm = this.formCtrl.loginForm();
  }

  ngOnInit() {
    if (this.controlPanelService.getLocalStorageData('triggerUserRatingOnLogin')) {
      this.controlPanelService.updateLocalStorage('isUserRating', false);
    }
    this.checkUserLogined();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {

  }

  ngOnDestroy() {
    this.events.unsubscribe('login-get');
  }

  eventHandlers() {
    this.events.subscribe('login-get', (data) => {
      this.navCtrl.navigateRoot('/dash-board');
    });
  }

  checkUserLogined() {
    let token = this.controlPanelService.getLocalStorageData('x-auth-sb');
    if (token) {
      this.controlPanelService.getUserDetailsServer('login-get');
    }
  }

  validateLogin() {
    let endpoint = this.dataProvider.endPoints.login;
    let data = this.loginPageForm.value;
    data.user = data.user.replace(/\D+/g, '');
    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();

      if (success && !success.status) {
        let alertData = {
          isSuccess: false,
          message: success.message ? success.message : 'Erro no login',
        };
        this.triggerAlert(alertData);
        return false;
      }
      this.updateUserData(success);
    }, (errorResponse) => {
      this.loaderCtrl.stopLoader();
      let errorMessage;
      console.log(endpoint, errorResponse);
      if (errorResponse.error && !errorResponse.error.status) {
        errorMessage = errorResponse.error.message ? errorResponse.error.message : 'Erro no login';
      }
      let alertData = {
        isSuccess: 'empty',
        message: errorMessage,
      };
      this.triggerAlert(alertData);
    });
  }

  updateUserData(callBack) {
    if (callBack.token) {
      this.controlPanelService.updateLocalStorage('x-auth-sb', callBack.token);
      this.controlPanelService.getUserDetailsServer('login-get');
    }
  }


  openAccessPage() {
    this.navCtrl.navigateForward('/access-page');
  }

  openForgetPasswordPage() {
    this.navCtrl.navigateForward(['forget-password-page']);
  }

  triggerAlert(alertData) {
    this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, 'small-alert');
  }

  openUrl() {
    this.iab.create('https://www.sky.com.br/credenciados', '_system');
  }

  openPolitica() {
    let url = this.dataProvider.urlHolder.politica;
    this.controlPanelService.openLink(url);
  }
}
