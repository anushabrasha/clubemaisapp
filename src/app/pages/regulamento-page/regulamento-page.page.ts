import { Component, OnInit } from '@angular/core';

import { MenuController, NavController } from '@ionic/angular';

import { LoaderService } from '../../services/loader/loader.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';

@Component({
  selector: 'app-regulamento-page',
  templateUrl: './regulamento-page.page.html',
  styleUrls: ['./regulamento-page.page.scss'],
})
export class RegulamentoPagePage implements OnInit {
  hideHeader: Boolean = false;
  isChecked: Boolean = false;
  isForced: Boolean = false;
  regulamentoTheory = '';
  showButton = false;
  hide = false

  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private ApiService: ApiHelperService,
    public loaderCtrl: LoaderService,
    private controlPanelService: ControlPanelService,
    private dataProvider: DataHolderService,

  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    let role = this.controlPanelService.getLocalStorageData('userRole');
    if (role.length) {
      this.getRegulamento(role);
    } else {
      let alertData = {
        isSuccess: 'empty',
        message: 'Você não é um usuário válido.',
      };
      this.triggerAlert(alertData, 'small-alert');
      this.navCtrl.navigateRoot('/dash-board');
    }
  }

  getRegulamento(role) {
    let endpoint = this.dataProvider.endPoints.regulamento;
    let data: any = '';
    if (role) {
      data = {
        'perfil': role
      };
    }

    this.loaderCtrl.showLoader();
    this.ApiService.get(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      this.showButton = true;
      if (!success) {
        this.errorInRegulamentoAPI();
        return false;
      }
      this.regulamentoTheory = success;
      this.checkIsForced();
    }, (error) => {
      this.loaderCtrl.stopLoader();
      this.showButton = true;
      console.log("getUserDetails error ", error);
      this.errorInRegulamentoAPI();
    });
  }

  toBack() {
    this.navCtrl.pop();
  }

  errorInRegulamentoAPI() {
    let alertData = {
      isSuccess: 'empty',
      message: 'Erro ao obter Regulamento.',
    };
    this.triggerAlert(alertData, 'small-alert');
    this.navCtrl.navigateRoot('/dash-board');
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
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  checkIsForced() {
    let info = this.controlPanelService.getLocalStorageData('isForcedRegulamento');
    if (info) {
      this.isForced = true;
      this.menuCtrl.enable(false);
    }
  }

  submit() {
    let endpoint = this.dataProvider.endPoints.regulamentoAccept;
    let data = {
      accept_lgpd_rules: 1
    };

    this.loaderCtrl.showLoader();
    this.ApiService.postWithPlugin(endpoint, data).then((success: any) => {
      this.loaderCtrl.stopLoader();
      success = JSON.parse(success.data);
      if (!success || success.code != 'accept_rules_success') {
        this.controlPanelService.presentToast(success.message);
        return false;
      }
      this.controlPanelService.presentToast(success.message);
      this.controlPanelService.updateLocalStorage('isForcedRegulamento', false);
      this.navCtrl.navigateRoot('/dash-board');
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(error);
    });
  }
}
