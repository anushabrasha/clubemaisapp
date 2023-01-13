import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';
import { FormControlService } from '../../services/formControl/form-control.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';

@Component({
  selector: 'app-access-page',
  templateUrl: './access-page.page.html',
  styleUrls: ['./access-page.page.scss'],
})
export class AccessPagePage implements OnInit {

  pageOneFlag: Boolean = true;
  pageTwoFlag: Boolean = false;
  pageThreeFlag: Boolean = false;
  userDetail = {
    email: '',
    telefone: '',
  };
  accessPageStepOneForm: any;
  accessPageStepTwoForm;
  isNameEditable: boolean = true;
  isEmailEditable: boolean = false;
  isTelefoneEditable: boolean = false;
  isUserAcceptReceber: boolean = true;

  constructor(
    public menuCtrl: MenuController,
    private router: Router,
    private dataHolder: DataHolderService,
    private apiCtrl: ApiHelperService,
    private navCtrl: NavController,
    public loaderCtrl: LoaderService,
    private formCtrl: FormControlService,
    private controlPanelService: ControlPanelService,
  ) { }

  ngOnInit() {
    this.accessPageStepOneForm = this.formCtrl.accessPageStepOneForm();
  }

  getUserDetails() {
    if (!this.accessPageStepOneForm.valid) {
      return false;
    }
    let endPoint = this.dataHolder.endPoints.accessPageStep1;
    let data = {
      cpf: this.accessPageStepOneForm.value.username.replace(/\D+/g, ''),
      email: this.accessPageStepOneForm.value.email
    };
    this.loaderCtrl.showLoader();
    this.apiCtrl.get(endPoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.code !== "validate_sky_users_success") {
        let msg = 'Usuário não encontrado';
        switch (success.code) {
          case 'exists_error':
            msg = 'Usuário já cadastrado';
            break;
          case 'validador_error':
            msg = 'Atenção: seu cadastro no sistema Icare está desatualizado, não permitindo acesso ao Clube SKY. Entre em contato com o proprietário da sua empresa para atualização imediata';
            break;
          default:
            break;
        }
        let alertData = {
          isSuccess: 'empty',
          message: msg,
        };
        this.triggerAlert(alertData, 'small-alert');
        return false;
      }
      this.passToForm(2);
      this.updateUserData(success.data);
      this.accessPageStepTwoForm = this.formCtrl.accessPageStepTwoForm(success.data);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log("getUserDetails error ", error);
    });

  }

  updateUserData(accessdUserData) {
    if (accessdUserData.Nome) {
      this.isNameEditable = false;
    }
    this.userDetail['data_de_nascimento'] = accessdUserData.data_nascimento;
    this.userDetail['tamanho_da_camisa'] = accessdUserData.tamanho_camisa;
    this.userDetail['tamanho_da_calca'] = accessdUserData.tamanho_calca;
    this.userDetail['tamanho_da_sapato'] = accessdUserData.tamanho_sapato;
    this.userDetail['genero'] = accessdUserData.genero;
    this.userDetail['cep'] = accessdUserData.cep;

    this.userDetail['rua'] = accessdUserData.rua;
    this.userDetail['numero'] = accessdUserData.numero;
    this.userDetail['complemento'] = accessdUserData.complemento;
    this.userDetail['bairro'] = accessdUserData.bairro;
    this.userDetail['cidade'] = accessdUserData.cidade;
    this.userDetail['estado'] = accessdUserData.estado;
    this.userDetail['ponto_de_referencia'] = accessdUserData.ponto_referencia;
    this.userDetail['origin'] = 'first-access-app';
  }

  registerUserDetails() {
    if (!this.accessPageStepTwoForm.valid) {

      return false;
    }
    if (!this.actionReceber()) {
      return false;
    }
    Object.assign(this.userDetail, this.accessPageStepTwoForm.value);
    Object.assign(this.userDetail, this.accessPageStepOneForm.value);
    let defaultValues = {
      'origin': 'first-access-app',
      'username': this.accessPageStepOneForm.value.username.replace(/\D+/g, '')
    };
    Object.assign(this.userDetail, defaultValues);
    let endPoint = this.dataHolder.endPoints.registerUser;
    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endPoint, this.userDetail).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.code !== "sky_register_new_user_success") {
        let alertData = {
          isSuccess: false,
          message: success.message,
        };
        this.triggerAlert(alertData);
        return false;
      }
      this.passToForm(3);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log("registerUserDetails error ", error);
    });

  }

  toBack() {
    this.navCtrl.back();
  }

  toPreviousForm() {

  }

  editable(fieldKey) {
    this[fieldKey] = !this[fieldKey];
  }

  passToForm(formCount) {
    if (formCount == 1) {
      this.pageOneFlag = true;
      this.pageTwoFlag = false;
      this.pageThreeFlag = false;
    } else if (formCount == 2) {
      this.pageTwoFlag = true;
      this.pageOneFlag = false;
      this.pageThreeFlag = false;
    } else if (formCount == 3) {
      this.pageOneFlag = false;
      this.pageTwoFlag = false;
      this.pageThreeFlag = true;
    } else {

    }
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  actionReceber() {
    if (!this.accessPageStepTwoForm.value.emailAccess && !this.accessPageStepTwoForm.value.phoneAccess) {
      this.isUserAcceptReceber = false;
      return false;
    } else {
      this.isUserAcceptReceber = true;
      return true;
    }
  }
}
