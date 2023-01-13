import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

import { NavigationExtras } from "@angular/router";
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from 'src/app/services/apiHelper/api-helper.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
@Component({
  selector: 'app-badges',
  templateUrl: './badges.page.html',
  styleUrls: ['./badges.page.scss'],
})
export class BadgesPage implements OnInit {
  hideHeader: Boolean = false;
  badgeList = [];
  key = 'selos'
  badgeOwnerList = [];
  cpf = '';
  totalCount = 0;
  isSpecialView = false;
  showDetails = false;
  specialStamps = [];
  normalBadgeList = [];
  badgeOwnerListNormal = [];
  badgeOwnerListSpecial = [];
  userList = [];
  userNormalList = [];
  userSpecialList = [];
  constructor(
    private events: Events,
    private controlPanel: ControlPanelService,
    private apiCtrl: ApiHelperService,
    private dataProvider: DataHolderService,
    private loaderCtrl: LoaderService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cpf = this.controlPanel.getLocalStorageData('cpf');
    this.badgeList = [];
    this.normalBadgeList = [];
    this.badgeOwnerList = [];
    this.specialStamps = [];
    this.hangleToSinglePage();
    this.getList();
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  hangleToSinglePage() {
    this.events.subscribe('selos:toTriggerPopup', (selectedSelos) => {
      this.triggerPopUp(selectedSelos);
    });
  }

  triggerPopUp(selectedSelos) {
    console.log(selectedSelos);

    let alertData = {
      isSuccess: 'selosPopUp',
      message: selectedSelos,
    };
    this.triggerAlert(alertData, 'seloes');
  }

  ngOnDestroy() {
    this.events.unsubscribe('selos:toTriggerPopup');
  }

  getList() {
    let endPoint = this.dataProvider.endPoints.seloes;
    this.loaderCtrl.showLoader();
    let data = {
      cpf: this.cpf
    };
    this.apiCtrl.get(endPoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.code != "get_selos_success") {
        let alertData = {
          isSuccess: 'shop-popup-error',
          message: success.message,
        };
        this.triggerAlert(alertData, 'shop-popup');
        return false;
      }

      let list = success.message.all_selos ? success.message.all_selos : [];
      let userOwned = success.message.selos ? success.message.selos : [];
      list.forEach(element => {
        if (userOwned.indexOf(element.ID.toString()) >= 0) {
          element.owned = true;
          //this.badgeOwnerList.push(element);
          //userList.push(element);
          if (element.categorie == 'normal') {
            this.badgeOwnerListNormal.push(element);
            this.userNormalList.push(element);
            console.log(this.userNormalList);
          } else {
            this.badgeOwnerListSpecial.push(element);
            this.userSpecialList.push(element);
          }
        } else {
          if (element.categorie == 'normal') {
            this.normalBadgeList.push(element);
          } else {
            this.specialStamps.push(element);
          }
        }

      });
      console.log('selos', this.badgeOwnerList, this.normalBadgeList, this.specialStamps);
      this.badgeList = this.normalBadgeList;
      this.badgeOwnerList = this.badgeOwnerListNormal;
      this.totalCount = this.userNormalList.length;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      return false;
    });
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  opensinglePage(index) {
    let data = {
      list: this.badgeList,
      position: index,
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        selected: JSON.stringify(data),
      }
    };
    // this.navCtrl.navigateForward(['single-badge-page'], navigationExtras);
  }

  toggleContent(token) {
    this.badgeList = [];
    this.badgeOwnerList = [];
    this.cd.detectChanges();
    if (token == 'NormalView') {
      this.badgeList = this.normalBadgeList;
      this.badgeOwnerList = this.badgeOwnerListNormal;
      this.totalCount = this.userNormalList.length;
      this.isSpecialView = false;
    } else {
      this.badgeList = this.specialStamps;
      this.badgeOwnerList = this.badgeOwnerListSpecial;
      this.totalCount = this.userSpecialList.length;
      this.isSpecialView = true;
    }
  }
}
