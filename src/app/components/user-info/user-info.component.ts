import { Component, OnInit } from '@angular/core';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service'
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';

import { Events } from '@ionic/angular';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  userData: any = {
    'userName': '',
    'userPoints': '',
    'userFoto': '',
  }
  count = {
    'missionCount': '--',
    'treinamentosCount': '--'
  }

  defaultAvatar = 'assets/images/common/default-user-image.png';
  showCount: Boolean = false; showNameLabel = false;
  userRole; userNameLabel; expirePoints;
  avatarData: any = {
    userName: this.ctrlPanel.getLocalStorageData('userInfo').display_name,
    avatarURL: this.ctrlPanel.getLocalStorageData('foto') ? this.ctrlPanel.getLocalStorageData('foto') : ''
  };

  constructor(
    private ctrlPanel: ControlPanelService,
    private dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    private loaderCtrl: LoaderService,
    private events: Events
  ) { }

  ngOnInit() {
    this.userRole = this.ctrlPanel.getLocalStorageData('userRole')[0].toLowerCase();
    this.expirePoints = this.ctrlPanel.getLocalStorageData('pointExpire')
    this.getUserInfo();
    this.getUserPoints();
  }

  ionViewDidEnter() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.events.subscribe('userDetail:get', (userData) => {
      this.userData.userName = userData.userInfo.display_name;
      this.userData.userPoints = userData.points_details;
      this.userData.userFoto = userData.meta.foto
      if (!this.userData.userFoto) {
        this.showNameLabel = true;
        this.userNameLabel = this.ctrlPanel.getLocalStorageData('userNameLabel');
      }
      this.ctrlPanel.updateLocalStorage('userFoto', this.userData.userFoto)
      this.ctrlPanel.updateLocalStorage('userData-component', this.userData)
    });
    let dataHolder = this.ctrlPanel.getLocalStorageData('userData-component');
    this.userData = dataHolder ? dataHolder : {};
  }

  ngOnDestroy() {
    this.events.unsubscribe('userDetail:get')
  }

  getUserPoints() {
    //selos count code removed

    let courseEndpoint = this.dataProvider.endPoints.courseCount;
    this.apiCtrl.getWithPlugin(courseEndpoint).then((success: any) => {
      this.loaderCtrl.stopLoader();
      this.count.treinamentosCount = JSON.parse(success.data);
    }, (error) => {
      console.log(error)
    })

    let missionEndpoint = this.dataProvider.endPoints.missionList;
    this.apiCtrl.get(missionEndpoint).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      this.count.missionCount = success.data.total_count;
    }, (error) => {
      console.log(error)
    })
  }

  getFirstName(name) {
    return name.split(' ')[0];
  }

}
