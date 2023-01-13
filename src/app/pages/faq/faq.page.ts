import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { LoaderService } from '../../services/loader/loader.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  hideHeader: Boolean = false;
  selectedQuestion;
  faqList = [];
  hideUSerInfo = false;

  constructor(
    private navCtrl: NavController,
    private ApiService: ApiHelperService,
    public loaderCtrl: LoaderService,
    private controlPanelService: ControlPanelService,
    private dataProvider: DataHolderService,
  ) { }

  ngOnInit() {
    let token = this.controlPanelService.getLocalStorageData('x-auth-sb');
    this.hideUSerInfo = token ? false : true;
    this.getFAQList();
  }

  openRegulamentoPage() {
    this.navCtrl.navigateForward('/regulamento-page');
  }

  getFAQList() {
    let endPoint = this.dataProvider.endPoints.faq;
    this.loaderCtrl.showLoader();
    this.ApiService.get(endPoint, '').subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.code !== "sky_faq_list_success") {
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.triggerAlert(alertData, 'small-alert');
        return false;
      }

      if (success.data.length) {
        this.faqList = success.data;
      }


    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log("getUserDetails error ", error);
    });
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  toggleAnswer(selectedFaq, selected) {
    this.faqList.forEach(faq => {
      if (faq.status) {
        faq.status = ''
      }
    });

    if (this.selectedQuestion === selected) {
      this.selectedQuestion = '';
    } else {
      selectedFaq.status = 'active'
      this.selectedQuestion = selected;
    }
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  toBack() {
    this.navCtrl.pop();
  }
}
