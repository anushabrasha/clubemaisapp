import { Component, OnInit } from '@angular/core';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';

@Component({
  selector: 'app-vantagens',
  templateUrl: './vantagens.page.html',
  styleUrls: ['./vantagens.page.scss'],
})
export class VantagensPage implements OnInit {
  hideHeader: Boolean = false;
  list = [];
  linkMagico;
  postRedirect = [161090];
  showText = false;
  vantagensList: any = [];
  constructor(
    private dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    private controlPanelService: ControlPanelService,
    public loaderCtrl: LoaderService,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
    this.getList();
    this.redirectPage();
  }

  getList() {
    let endpoint = this.dataProvider.endPoints.vantagens;
    this.loaderCtrl.showLoader();
    this.apiCtrl.get(endpoint, {}).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let forgetPasswordSucessCode = 'get_vantagens_success';

      if (success && success.code != forgetPasswordSucessCode) {
        let alertData = {
          isSuccess: false,
          message: success.message ? success.message : 'Lista não encontrada.',
        };
        this.triggerAlert(alertData);
        return false;
      }

      let info = success.data;      
      let holder = [];
      for (let key in info) {
        holder = [...holder, ...info[key]];
      }
      this.list = holder;
      this.vantagensList = holder;
    }, (errorResponse) => {
      this.loaderCtrl.stopLoader();
      if (errorResponse.error && !errorResponse.error.status) {
        let alertData = {
          isSuccess: 'empty',
          message: errorResponse.error.message ? errorResponse.error.message : 'Lista não encontrada.',
        };
        this.triggerAlert(alertData);
        return false;
      }
    });
  }

  redirectPage() {
    let endpoint = this.dataProvider.endPoints.redirectVantagens;
    //this.loaderCtrl.showLoader();
    this.apiCtrl.get(endpoint, {}).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let forgetPasswordSucessCode = 'redirect_vantagens_success';

      if (success && success.code != forgetPasswordSucessCode) {
        let alertData = {
          isSuccess: false,
          message: success.message ? success.message : 'Não há conexão com parceiro.',
        };
        this.triggerAlert(alertData);
        return false;
      }

      this.linkMagico = success.data;
      
    }, (errorResponse) => {
      this.loaderCtrl.stopLoader();
      if (errorResponse.error && !errorResponse.error.status) {
        let alertData = {
          isSuccess: 'empty',
          message: errorResponse.error.message ? errorResponse.error.message : 'Lista não encontrada.',
        };
        this.triggerAlert(alertData);
        return false;
      }
    });
  }

  triggerAlert(alertData) {
    this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, 'small-alert');
  }

  openUrl(selected) {
    if (this.linkMagico && this.postRedirect.includes(selected.post_id)) {
      this.iab.create(this.linkMagico, '_system');
    } else if(selected.partner_url) {
      this.iab.create(selected.partner_url, '_system');
    }
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {      
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }
}
