import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-premiere-mission-dashboard-page',
  templateUrl: './premiere-mission-dashboard-page.page.html',
  styleUrls: ['./premiere-mission-dashboard-page.page.scss'],
})
export class PremiereMissionDashboardPagePage implements OnInit {
  hideHeader: Boolean = false;
  mission;
  stages = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private ctrlPanel: ControlPanelService,
    private apiCtrl: ApiHelperService,
    private dataProvider: DataHolderService,
    private loaderCtrl: LoaderService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.mission = JSON.parse(params["mission"]);
    });
    this.getMissionStatus(this.mission.ID)
  }

  getMissionStatus(missionId) {

    let endpoint = this.dataProvider.endPoints.missionStatus;
    let data = {
      mission_id: missionId
    }
    this.loaderCtrl.showLoader();
    this.apiCtrl.get(endpoint, data).subscribe((success: any) => {
      if (success) {
        this.stages = success.data
      }
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(error)
    })
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  setStatus(status) {

    switch (status) {
      case '1':
        return 'tele-cine-not-started';
      case '2':
        return 'tele-cine-not-reached';
      case '3':
        return 'tele-cine-basic-achievement';
      case '4':
        return 'tele-cine-charade';
      case '5':
        return 'tele-cine-cat-woman';
      case '6':
        return 'tele-cine-batman';
      default:
        return '';
    }
  }

  toBack() {
    this.navCtrl.back();
  }

}
