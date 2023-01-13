import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Events, NavController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';
import { PdfViewerService } from '../../services/pdfViewer/pdf-viewer.service';
import { NavigationExtras } from '@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'app-mission-single',
  templateUrl: './mission-single.page.html',
  styleUrls: ['./mission-single.page.scss'],
})
export class MissionSinglePage implements OnInit {
  hideHeader: Boolean = false;
  isGameMission: Boolean = false;
  mission: any = {};
  missionToBackEvent = 'misssionPage:toBack';
  instructions = [];
  missionSubmitData: any = {};
  userInfo;
  selectedImage;
  showForm;
  userCPF;
  showActionButton = true;
  statusMission = ['type11', 'type12', 'type13', 'type14', 'type16']


  constructor(
    private activeRoute: ActivatedRoute,
    private events: Events,
    private navCtrl: NavController,
    private dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private ctrlPanel: ControlPanelService,
    private sanitizer: DomSanitizer,
    private ctrlService: ControlPanelService,
    private PDFViewer: PdfViewerService
  ) { }

  ngOnInit() {
    this.userInfo = this.ctrlPanel.getLocalStorageData('usermeta');
    this.userInfo.celular = this.userInfo.celular ? this.userInfo.celular : this.userInfo.telefone;
    this.userCPF = this.ctrlPanel.getLocalStorageData('cpf');
    this.activeRoute.queryParams.subscribe(params => {
      this.mission = JSON.parse(params["mission"]);
      this.isGameMission = params["isGameMission"] ? true : false;

      if (this.mission.instructions) {
        this.instructions = this.mission.instructions;
      }
      if (this.mission.hover_description) {
        this.mission.hover_description = this.sanitizer.bypassSecurityTrustHtml(this.mission.hover_description);
      } else {
        if (this.mission.mission_hover_short_description) {
          this.mission.hover_description = this.sanitizer.bypassSecurityTrustHtml(this.mission.mission_hover_short_description);
        }
      }

      if (this.mission.mission_type == "type4" || this.mission.mission_type == "type5" || this.mission.mission_type == "type17") {
        let spliter = this.mission.post_title.split(' ');
        this.mission.post_title1 = spliter[0];
        this.mission.post_title2 = spliter[1];
      }


      if (this.mission.automatic_enrollment) {
        var formData: any = new FormData();
        formData.append("title", this.userCPF + this.mission.post_title);
        formData.append("from_email", this.userInfo.email);
        formData.append("from_telephone", this.userInfo.celular);
        formData.append("mission_id", this.mission.ID);
        formData.append('cpf', this.userCPF);
        this.makeMissionAPI(formData);
      }
    });
    this.checkParticipate();
    this.eventHandlers();
    this.fieldUpdates();
  }

  eventHandlers() {
    this.events.subscribe('misssionPage:toBack', (type) => {
      this.navCtrl.pop();
      this.selectedImage = '';
    });
  }

  checkParticipate() {
    if (this.mission.customStatus == 'mission-new') {
      this.showForm = (this.mission.mission_type == "type5" && moment(this.mission.expiry_date).isBefore()) ? false : true;
      if (this.mission.mission_type == 'type7' || this.mission.mission_type == 'type17') {
        this.showForm = true;
      } else {
        this.showForm = true;
      }
    } else if (this.mission.mission_type == "type6") {
      this.showForm = false;
    } else if (this.mission.mission_type == 'type8' || this.mission.mission_type == 'type15') {
      this.showForm = true;
    }
    else {
      this.showForm = false;
    }
  }

  // get button name based on mission type function removed

  fieldUpdates() {
    this.events.subscribe('mission:fieldUpdates', (data) => {
      this.missionSubmitData = data;
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('misssionPage:toBack');
    this.events.unsubscribe('mission:fieldUpdates');
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  closeIntimationView() {
    this.navCtrl.pop();
    this.openMissionPage();
  }

  openMissionPage() {
    this.events.publish('misssion:refreshPage', this.isGameMission);
  }

  submitMission(mission) {
    if (mission.completed) {
      this.navCtrl.navigateRoot('/mission-page');
      this.events.publish('misssion:refreshPage');
      this.selectedImage = '';
      return false;
    }

    // is hidden code removed its not used anywhere 

    if (this.statusMission.includes(mission.mission_type)) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          mission: JSON.stringify(mission),
        }
      };
      this.navCtrl.navigateRoot('/premiere-mission-dashboard-page', navigationExtras)
      return false;
    }

    var formData: any = new FormData();

    if (mission.mission_type == "type4" || mission.mission_type == "type5" || mission.mission_type == "type17") {
      if (!this.missionSubmitData.file) {
        let alertData = {
          isSuccess: 'empty',
          message: 'Escolha uma foto',
        };
        this.triggerAlert(alertData, 'small-alert');
      } else if (!this.missionSubmitData.description && mission.mission_type == "type17") {
        this.ctrlPanel.presentToast('O campo da mensagem não é válido.');
        return false;
      } else {
        var formData: any = new FormData();
        var arr = this.missionSubmitData.file.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        //let file = new File([u8arr], 'image/' + mime, { type: mime });
        let file = new Blob([u8arr], { type: mime });
        //let png = this.missionSubmitData.file.split(',')[1];
        //new Blob([window.atob(png)], {type: 'image/' + mime, { type: mime })
        formData.append("file", file, this.ctrlPanel.randomString(7) + ".jpeg");

        formData.append("title", this.userCPF + this.mission.post_title);
        formData.append("from_email", this.userInfo.email);
        formData.append("from_telephone", this.userInfo.celular);
        formData.append("mission_id", mission.ID);
        formData.append('cpf', this.userCPF);
        if (mission.mission_type == "type17") {
          formData.append("description", this.missionSubmitData.description);
        }


        this.makeMissionAPI(formData);
      }
    } else if (mission.mission_type == "type7" && !this.missionSubmitData.file) {
      let alertData = {
        isSuccess: 'empty',
        message: 'Por favor, selecione um vídeo para enviar.',
      };
      this.triggerAlert(alertData, 'small-alert');
      return false;
    } else if (mission.mission_type == "type7") {
      if (!this.missionSubmitData.file) {
        if (!this.showForm) {
          this.ctrlPanel.presentToast('Você já está participando.');
          return false;
        }
        formData.append("title", this.userCPF + this.mission.post_title);
        formData.append("from_email", this.userInfo.email);
        formData.append("from_telephone", this.userInfo.celular);
        formData.append("mission_id", mission.ID);
        formData.append('cpf', this.userCPF);

        this.makeMissionAPI(formData);
      } else {
        if (mission.mission_type == "type7") {
          formData.append('file', this.missionSubmitData.file, this.ctrlPanel.randomString(7) + ".mp4");
        } else {
          var arr = this.missionSubmitData.file.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          let file = new File([u8arr], 'image/' + mime, { type: mime });
          formData.append("file", file, this.ctrlPanel.randomString(7) + ".jpeg");
        }

        formData.append("title", this.userCPF + this.mission.post_title);
        formData.append("from_email", this.userInfo.email);
        formData.append("from_telephone", this.userInfo.celular);
        formData.append("mission_id", mission.ID);
        formData.append('cpf', this.userCPF);

        this.makeMissionAPI(formData);
      }
    } else if (mission.mission_type == "type8" || mission.mission_type == "type17") {
      if (!this.missionSubmitData.description) {
        this.ctrlPanel.presentToast('O campo da mensagem não é válido.');
        return false;
      }

      formData.append("title", this.userCPF + this.mission.post_title);
      formData.append("from_email", this.userInfo.email);
      formData.append("from_telephone", this.userInfo.celular);
      formData.append("mission_id", mission.ID);
      formData.append('cpf', this.userCPF);
      formData.append("description", this.missionSubmitData.description);

      this.makeMissionAPI(formData);
    } else {
      formData.append("title", this.userCPF + this.mission.post_title);
      formData.append("from_email", this.userInfo.email);
      formData.append("from_telephone", this.userInfo.celular);
      formData.append("mission_id", mission.ID);
      formData.append('cpf', this.userCPF);
      this.makeMissionAPI(formData);
    }
  }

  makeMissionAPI(FormData) {
    let endpoint = this.dataProvider.endPoints.missionUpdate;

    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endpoint, FormData).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (this.mission.automatic_enrollment) {
        return;
      }
      if (success.code && success.code.includes('_success')) {
        this.navCtrl.navigateRoot('/mission-page');
        this.events.publish('misssion:refreshPage');
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.triggerAlert(alertData, 'small-alert');
        return false;
      } else {
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.triggerAlert(alertData, 'small-alert');
        return false;
      }
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.ctrlPanel.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.ctrlPanel.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  getButtonName(mission, isFor) {
    let participatingMission = ['type5', 'type7', 'type8', 'type17'];
    let notParticipatingMission = ['type5', 'type7', 'type8', 'type17'];

    if (isFor == 'label') {
      switch (mission.customStatus) {
        case 'mission-new':
          if (!mission.automatic_enrollment) {
            return 'missão nova!';
          } else if (mission.automatic_enrollment) {
            return 'participando!';
          }
        case 'mission-pending':
          return 'participando!';
        case 'mission-expired':
          return 'encerrado!'
        default:
          break;
      }
    } else if (isFor == 'button') {
      if (mission.automatic_enrollment) {
        return 'você está participando dessa missão'
      } else {
        switch (mission.customStatus) {
          case 'mission-new':
            if (!participatingMission.includes(mission.mission_type) && !mission.automatic_enrollment) {
              return 'participando';
            } else if (this.statusMission.includes(this.mission.mission_type)) {
              return 'CLIQUE AQUI E ACESSE O SEU MAPA DE EVOLUÇÃO';
            } else if (mission.mission_type == 'type7' || mission.mission_type == 'type8' || mission.mission_type == 'type5' || mission.mission_type == 'type17') {
              return 'enviar';
            } else {
              this.showActionButton = false
            }
            break;
          case 'mission-pending':
            if (!notParticipatingMission.includes(mission.mission_type)) {
              return 'participando!';
            } else if (mission.mission_type == 'type6') {
              return 'você está participando dessa missão';
            } else {
              this.showActionButton = false
            }
            break;
          case 'mission-expired':
            return 'encerrado';
          default:
            break;
        }
      }
    }
  }

  getPostTitle(mission) {
    let titleTypes = ['type5', 'type6', 'type15', 'type17']
    if (titleTypes.includes(mission.mission_type)) {
      return mission.post_title;
    } else {
      return '';
    }
  }
}
