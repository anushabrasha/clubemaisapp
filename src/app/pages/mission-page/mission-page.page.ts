import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Events, NavController, IonInfiniteScroll } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import * as moment from 'moment';


@Component({
  selector: 'app-mission-page',
  templateUrl: './mission-page.page.html',
  styleUrls: ['./mission-page.page.scss'],
})
export class MissionPagePage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  infiniteScrollEvent: any; missionList: any = []; missionCount: any = '00';
  isGameMission: Boolean = false; hideHeader: Boolean = false;
  completedMissionCount: number = 0;
  totalPointsEarned = '--'; missionToBackEvent = 'misssion:toBack';
  isMissionPresent: Boolean = true;
  search_string:String = "";
  currentPage = 1;
  missionsNotFound: Boolean = false;
  searchResults:any = [];
  searchString:String = "";

  constructor(
    private events: Events,
    private router: Router,
    private navCtrl: NavController,
    private dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private ngZone: NgZone,
    private controlPanelService: ControlPanelService,
  ) {

  }

  ngOnInit() {
    if (this.router.url.includes('game-mission-page')) {
      this.isGameMission = true;
    }
    this.getMissionList();
    this.refreshPage();
  }


  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  refreshPage() {
    this.events.subscribe('misssion:refreshPage', (isGameMission) => {
      this.isGameMission = isGameMission
      this.ngZone.run(() => {
        this.missionList = [];
        this.missionCount = '00';
        this.completedMissionCount = 0;
        this.totalPointsEarned = '--';
        this.getMissionList();
      });
    });
  }


  ngOnDestroy() {
    this.events.unsubscribe('misssion:refreshPage');
  }

  toBack() {
    this.navCtrl.pop();
  }

  openSinglePage(selected) {
    let paramData = {
      mission: JSON.stringify(selected),
    };
    if (this.isGameMission) {
      paramData['isGameMission'] = true;
    }
    let navigationExtras: NavigationExtras = {
      queryParams: paramData
    };
    this.navCtrl.navigateForward(['mission-single'], navigationExtras);
  }

  getMissionList() {

    let endPoint = this.dataProvider.endPoints.missionList;
    let data = {
      page: 1,
      search_string: this.searchString
    };
    if (this.isGameMission) {
      data["game"] = true;
    }
    this.loaderCtrl.showLoader();
    this.apiCtrl.get(endPoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.code !== "get_missions_success") {
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.triggerAlert(alertData, 'small-alert');
        return false;
      }

      let missionList = success.data.all_missions;
      if (missionList.length) {
        this.analizeMission(missionList, success.data.missions);
      } else {
        this.isMissionPresent = false;
      }
      
      // pagination removed
      this.totalPointsEarned = success.data.total_mission_points;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log("getUserDetails error ", error);
    });
  }

  analizeMission(list, updatedList?) {
    let updatedListToProcess = updatedList ? updatedList : [];
    this.controlPanelService.analizeMission(list, updatedListToProcess).then(data => {
      if (data) {
        this.missionList = [...this.missionList, ...data['list']];
        this.completedMissionCount = data['completedMissionCount'];
        this.missionCount = data['missionAvailableCount'];
        this.isMissionPresent = true;
      }
    }).catch(error => {
      console.log(error);
    });
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  getButtonName(mission, isFor) {
    if (isFor == 'label') {
      switch (mission.customStatus) {
        case 'mission-new':
          return 'nova!';
        case 'mission-pending':
          return 'participando';
        case 'mission-expired':
          if (mission.mission_type == 'type6') {
            return ''
          } else {
            return ''
          }
        default:
          break;
      }
    } else if (isFor == 'button') {
      switch (mission.customStatus) {
        case 'mission-new':
          return this.isGameMission ? 'Jogar' : 'participar';
        case 'mission-pending':
          return this.isGameMission ? 'tentativas esg' : 'SAIBA MAIS';
        case 'mission-expired':
          if (mission.mission_type == 'type7') {
            mission.disableActionButton = false;
          } else {
            mission.disableActionButton = true;
          }
          return 'encerrado'
        default:
          break;
      }
    }
  }
  searchMissions(event:any) {
    if(event.length == 4){
      this.searchString = event;
      this.getMissionList();
    }
    else{
      this.searchString = "";
      this.getMissionList();
    }
  }
  onClear(event:any){
    this.searchString = "";
    this.getMissionList();
  }


  // pagination removed
}
