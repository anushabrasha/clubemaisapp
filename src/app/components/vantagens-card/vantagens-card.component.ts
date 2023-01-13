import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';

@Component({
  selector: 'app-vantagens-card',
  templateUrl: './vantagens-card.component.html',
  styleUrls: ['./vantagens-card.component.scss'],
})
export class VantagensCardComponent implements OnInit {
  @Input() list: any;
  @Input() toList: number;

  vantagensList = [];
  linkMagico;
  postRedirect = [161090];
  cardsVantagens = [];

  constructor(
    private dataProvider: DataHolderService,
    private events: Events,
    private iab: InAppBrowser,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private controlPanelService: ControlPanelService,
  ) { }

  ngOnInit() {
    this.redirectPage();
    if (this.list.length) {
      this.vantagensList = this.list;
    }
  }

  triggerAlert(alertData) {
    this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, 'small-alert');
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
  
  openUrl(selected) {
    console.log(this.linkMagico);
    if (this.linkMagico && this.postRedirect.includes(selected.post_id)) {
      this.iab.create(this.linkMagico, '_system');
    } else if(selected.partner_url) {
      this.iab.create(selected.partner_url, '_system');
    }
  }
}
