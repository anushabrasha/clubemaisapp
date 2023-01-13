import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { DataHolderService } from "../../services/dataHolder/data-holder.service";
import { LoaderService } from '../../services/loader/loader.service';
import { ApiHelperService } from "../../services/apiHelper/api-helper.service";

@Component({
  selector: 'app-apreda-page',
  templateUrl: './apreda-page.page.html',
  styleUrls: ['./apreda-page.page.scss'],
})
export class ApredaPagePage implements OnInit {
  hideHeader: Boolean = false;
  aprenda: any;
  userToken = 'https://skydev.scit.pt/courses/conexao-sky-play/?iframe=true&token=1294|$2y$10$QwBBkzHEfrNLHPGU/DoFoOKX2oajoSWbhqbcNRCpALS4YvLsGWQPm';
  iframeURL;
  selectedAprenda;

  constructor(
    private navCtrl: NavController,
    private controlPanel: ControlPanelService,
    private loaderCtrl: LoaderService,
    private events: Events,
    private sanitizer: DomSanitizer,
    private dataCtrl: DataHolderService,
    private apiCtrl: ApiHelperService,
    public route: ActivatedRoute,

  ) { }

  ngOnInit() {
    let token = this.controlPanel.getLocalStorageData('x-auth-sb');
    // let token = '1403|$2y$10$67F9h0IlGWhKGc6Kj7p8NO62l2lUa6OZ9H7Opjq0cwz8afOhnAUoi';

    if (token) {
      this.route.queryParams.subscribe(params => {
        this.selectedAprenda = JSON.parse(params["selectedAprenda"]);
        console.log(this.selectedAprenda);
      });
      // console.log(encodeURI(this.userToken));

      let url: any = this.selectedAprenda.link + '?iframe=true&token=' + token
      url = this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(url));
      console.log(url);
      this.iframeURL = url;
    }

  }

  getToken() {

  }

  toBack() {
    this.navCtrl.pop();
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  getSelectedCourse() {
    // this.controlPanel.getlargeDataFromLocalStorage('getSelectedCourse').then(data => {
    //   console.log(data);
    //   if (data) {
    //     let selected = data;
    //   }
    // }).catch(error => {
    //   console.log(error);
    // });
  }

  ngOnDestroy() {
    this.controlPanel.removeFromLocalStorage('selectedAprenda');
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData);
    }
  }

}
