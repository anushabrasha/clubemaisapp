import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';
import { FormControlService } from '../../services/formControl/form-control.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';

@Component({
  selector: 'app-forget-password-page',
  templateUrl: './forget-password-page.page.html',
  styleUrls: ['./forget-password-page.page.scss'],
})
export class ForgetPasswordPagePage implements OnInit {

  pageOneFlag: boolean = true;
  pageTwoFlag: boolean = false; pageThreeFlag: boolean = false; pageFourFlag: boolean = false;
  userData = {
    cpf: '',
    password: '',
    confirmPassword: '',
  };
  forgetPasswordFormOne; forgetPasswordFormTwo;
  userEmailID = ""; isDeepLink; token;
  deepLinkData = {
    rkey: '',
    user_id: '',
  };
  deepLinkUserData = {};

  constructor(
    public menuCtrl: MenuController,
    public route: ActivatedRoute,
    private navCtrl: NavController,
    private dataHolder: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private formCtrl: FormControlService,
    private controlPanelService: ControlPanelService,
    public changeDetection: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.forgetPasswordFormOne = this.formCtrl.forgetPasswordFormOne();
    this.forgetPasswordFormTwo = this.formCtrl.forgetPasswordFormTwo();
    this.route.paramMap.subscribe((params: any) => {
      console.log("params ", params);
      if (params && params.params) {
        if (params.params.token) {
          this.isDeepLink = true;
          this.menuCtrl.enable(false);
          let data = JSON.parse(params.params.token);
          this.deepLinkData.rkey = data.key;
          this.deepLinkData.user_id = data.id;
          this.passToForm(2);
          this.validateUser();
        } else {
          this.isDeepLink = false;
        }
      }
    });
  }

  openPage(path) {
    localStorage.clear();
    this.navCtrl.navigateForward('/' + path);
  }

  validateUser() {
    let endpoint = this.dataHolder.endPoints.accessPageStep1;
    this.loaderCtrl.showLoader();
    this.apiCtrl.get(endpoint, this.deepLinkData).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.code !== "validate_sky_users_success") {
        let alertData = {
          isSuccess: 'empty',
          message: 'Usuário já cadastrado',
        };
        this.triggerAlert(alertData, 'small-alert');
        this.navCtrl.navigateRoot('/login-page');
        return false;
      }

      if (!success.data.token) {
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.triggerAlert(alertData, 'small-alert');
        this.navCtrl.navigateRoot('/login-page');
        return false;
      }
      this.token = success.data.token;

      let name = success.data.meta.nome_completo ? success.data.meta.nome_completo : '';
      let id = success.data.meta.id ? success.data.meta.id : '';
      let username = success.data.meta.user_login ? success.data.meta.user_login : '';
      let cep = success.data.meta.cep ? success.data.meta.cep : '';
      let rua = success.data.meta.rua ? success.data.meta.rua : '';
      let numero = success.data.meta.numero ? success.data.meta.numero : '';

      let email = success.data.meta.email ? success.data.meta.email : '';
      let bairro = success.data.meta.bairro ? success.data.meta.bairro : '';
      let cidade = success.data.meta.cidade ? success.data.meta.cidade : '';
      let estado = success.data.meta.estado ? success.data.meta.estado : '';

      this.controlPanelService.updateLocalStorage('x-auth-sb', this.token);
      this.deepLinkUserData['nome_completo'] = success.data.sky.Nome ? success.data.sky.Nome : name;
      this.deepLinkUserData['id'] = success.data.sky.ID ? success.data.sky.ID : id;
      this.deepLinkUserData['username'] = success.data.sky.CPF ? success.data.sky.CPF : username;

      this.deepLinkUserData['cep'] = success.data.sky.cep ? success.data.sky.cep : cep;
      this.deepLinkUserData['rua'] = success.data.sky.rua ? success.data.sky.rua : rua;
      this.deepLinkUserData['numero'] = success.data.sky.numero ? success.data.sky.numero : numero;
      this.deepLinkUserData['email'] = success.data.sky.email ? success.data.sky.email : email;
      this.deepLinkUserData['bairro'] = success.data.sky.bairro ? success.data.sky.bairro : bairro;
      this.deepLinkUserData['cidade'] = success.data.sky.cidade ? success.data.sky.cidade : cidade;
      this.deepLinkUserData['estado'] = success.data.sky.estado ? success.data.sky.estado : estado;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log("getUserDetails error ", error);
      this.navCtrl.navigateRoot('/login-page');
    });
  }

  checkCpf() {
    let endpoint = this.dataHolder.endPoints.forgetPassword;
    let data = this.forgetPasswordFormOne.value;
    data.user_login = data.user_login.replace(/\D+/g, '');
    this.loaderCtrl.showLoader();

    this.apiCtrl.post(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let forgetPasswordSucessCode = 'sky_register_new_user_success';

      if (success && !success.status) {
        let alertData = {
          isSuccess: false,
          message: success.message,
        };
        this.triggerAlert(alertData);
        return false;
      }
      this.userEmailID = success.email;
      this.passToForm(4);
    }, (error) => {
      if (!error.status) {
        let alertData = {
          isSuccess: 'empty',
          message: "Usuário não encontrado",
        };
        this.triggerAlert(alertData, 'small-alert');
      }
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });
  }

  toBack() {
    this.navCtrl.back();
  }

  updatePassword() {
    let endpoint = this.dataHolder.endPoints.updateUser;
    this.deepLinkUserData['password'] = this.forgetPasswordFormTwo.value.newpassword;
    let userData = this.deepLinkUserData;
    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endpoint, userData).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success && success.code !== 'profile_update_success') {
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.triggerAlert(alertData, 'small-alert');
        return false;
      }
      this.passToForm(3);
      this.changeDetection.detectChanges();
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });
    // this.passToForm(3);
  }

  passToForm(formCount) {
    if (this.isDeepLink && formCount == 1) {
    localStorage.clear();
    this.navCtrl.navigateRoot('/login-page');
    } else {
      if (formCount == 1) {
        this.pageOneFlag = true;
        this.pageTwoFlag = false;
        this.pageThreeFlag = false;
        this.pageFourFlag = false;
      } else if (formCount == 2) {
        this.pageTwoFlag = true;
        this.pageOneFlag = false;
        this.pageThreeFlag = false;
        this.pageFourFlag = false;
      } else if (formCount == 3) {
        this.pageOneFlag = false;
        this.pageTwoFlag = false;
        this.pageThreeFlag = true;
        this.pageFourFlag = false;
      } else if (formCount == 4) {
        this.pageOneFlag = false;
        this.pageTwoFlag = false;
        this.pageThreeFlag = false;
        this.pageFourFlag = true;
      } else {

      }
    }
  }

  toLoginPage() {
    this.navCtrl.navigateRoot('/login-page');
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  domChange() {
    this.changeDetection.detectChanges();
  }

  ionViewWillLeave() {
    this.changeDetection.detach();
  }

  openPolitica() {
    let url = this.dataHolder.urlHolder.politica;
    this.controlPanelService.openLink(url);
  }
}
