import { Component, OnInit, Input, NgZone } from '@angular/core';

import { LoaderService } from '../../services/loader/loader.service';
import { ImageProcessorService } from '../../services/imageProcessor/image-processor.service';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service'
import { ApiHelperService } from '../../services/apiHelper/api-helper.service'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Events, NavController, Platform, NavParams } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

declare var cordova: any;

@Component({
  selector: 'app-mission-type',
  templateUrl: './mission-type.component.html',
  styleUrls: ['./mission-type.component.scss'],
})
export class MissionTypeComponent implements OnInit {
  @Input() missionInfo: any;
  @Input() isGameMission: any;
  mission: any = {};
  selectedImage; uploadedVideo; filename; selectedVideo; textMissionValue;

  cameraheader = "Escolha uma imagem";
  MAX_FILE_SIZE = 25 * 1024 * 1024;
  ALLOWED_MIME_TYPE = "video/mp4";
  showMissionStatus = false;
  isStatusMission = false;
  statusMission = ['type11', 'type12', 'type13', 'type14'];
  missionStatus = []

  cameraActionList = [
    {
      text: 'Câmera',
      handler: () => {
        this.cameraPluginAction('camera');
      }
    }, {
      text: 'Galeria',
      handler: () => {
        this.cameraPluginAction('file');
      }
    }, {
      text: 'Cancelar',
      role: 'destructive',
      handler: () => {
        this.selectedImage = '';
        this.events.publish('mission:fieldUpdates', {});
      }
    },
  ];
  videoActionList = [
    {
      text: 'Galeria',
      handler: () => {
        this.cameraPluginAction('file');
      }
    }, {
      text: 'Cancelar',
      role: 'destructive',
      handler: () => {
        this.selectedImage = '';
        this.events.publish('mission:fieldUpdates', {});
      }
    },
  ];

  constructor(
    private ctrlPanel: ControlPanelService,
    private loaderCtrl: LoaderService,
    private camera: Camera,
    private imageprocessor: ImageProcessorService,
    private events: Events,
    private file: File,
    private ngZone: NgZone,
    private iab: InAppBrowser,
    private navCtrl: NavController,
    private orientation: ScreenOrientation
  ) { }

  ngOnInit() {
    if (this.missionInfo) {
      this.mission = this.missionInfo;
    }
    this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT);
  }

  chooseImage() {
    if (this.mission.mission_type == 'type7') {
      this.cameraheader = 'Escolha um video';
      this.ctrlPanel.presentActionSheet(this.cameraheader, this.videoActionList);
    } else {
      this.ctrlPanel.presentActionSheet(this.cameraheader, this.cameraActionList);
    }
  }

  async cameraPluginAction(method) {

    let optionType = 'PHOTOLIBRARY';
    let mediaType = 'PICTURE';
    let options: CameraOptions;

    if (method == 'camera') {
      optionType = 'CAMERA';
    }
    if (this.mission.mission_type == 'type7') {
      mediaType = 'VIDEO';
      options = {
        quality: 15,
        correctOrientation: true,
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        destinationType: this.camera.DestinationType.DATA_URL,
        mediaType: this.camera.MediaType[mediaType]
      }
    } else {
      options = {
        quality: 15,
        correctOrientation: true,
        sourceType: this.camera.PictureSourceType[optionType],
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType[mediaType]
      }
    }

    this.loaderCtrl.showLoader();

    this.ngZone.runOutsideAngular(() => {
      this.camera.getPicture(options).then((imageData) => {
        if (this.mission.mission_type == 'type7' && imageData) {
          var videoData = imageData
          if (videoData) {
            const filename = videoData.substr(videoData.lastIndexOf('/') + 1);
            let dirpath = videoData.substr(0, videoData.lastIndexOf('/') + 1);
            dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;

            this.videoConceptChecker(dirpath, filename);
          }
        } else {
          let type = 'image/jpeg';
          let base = 'data:image/jpeg;base64,';
          if (this.mission.mission_type == 'type7') {
            type = this.ALLOWED_MIME_TYPE;
            base = 'data:video/mp4;base64,';
          }
          this.ngZone.run(() => {
            this.selectedImage = base + imageData;
          });

          this.imageprocessor.getImageFile(imageData, type).then(data => {
            setTimeout(() => {
              this.loaderCtrl.stopLoader();
              let data = {
                file: this.selectedImage
              };
              let description = { description: this.textMissionValue, }
              if (this.mission.mission_type == 'type17') {
                Object.assign(data, description);
              }
              this.events.publish('mission:fieldUpdates', data);
            }, 1000);
          }, error => {
            this.loaderCtrl.stopLoader();
            this.selectedImage = '';
            this.events.publish('mission:fieldUpdates', {});
            console.log(error);
          })
        }
      }, (err) => {
        this.loaderCtrl.stopLoader();
        this.selectedImage = '';
        this.events.publish('mission:fieldUpdates', {});
        console.log(err);
      });
    });
  }

  async videoConceptChecker(dirpath, filename) {
    try {
      var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
      var retrievedFile = await this.file.getFile(dirUrl, filename, {});
    } catch (err) {
      this.loaderCtrl.stopLoader();
      this.ctrlPanel.presentToast("Algo deu errado.");
      return false;
    }

    retrievedFile.file(data => {
      if (data.size > this.MAX_FILE_SIZE) {
        this.ctrlPanel.presentToast("Você não pode fazer upload de mais de 25 MB.");
        this.resetVideoForm();
      } else if (data.type !== this.ALLOWED_MIME_TYPE) {
        this.ctrlPanel.presentToast("Tipo de arquivo incorreto.");
        this.resetVideoForm();
      } else {
        this.videoProcessor(dirpath, filename);
      }
    });
  }

  videoProcessor(dirpath, filename) {
    try {
      this.file.readAsDataURL(dirpath, filename).then(blob => {
        if (blob == null) {
          return false
        }
        let type = this.ALLOWED_MIME_TYPE;
        let baseValue;

        this.ngZone.run(() => {
          this.filename = filename;
          baseValue = blob.split("data:video/mp4;base64,")[1];
        });
        this.imageprocessor.getImageFile(baseValue, type).then(data => {
          setTimeout(() => {
            this.loaderCtrl.stopLoader();
            let holder = {
              file: data
            };
            this.events.publish('mission:fieldUpdates', holder);
          }, 1000);
        }, error => {
          this.resetVideoForm();
          console.log(error);
        })

      }), ((err) => {
        this.resetVideoForm();
        console.log('error');
      });
    } catch (error) {
      this.resetVideoForm();
      console.log('error');
    }
  }

  resetVideoForm() {
    this.loaderCtrl.stopLoader();
    this.filename = '';
    this.events.publish('mission:fieldUpdates', {});
  }

  updateDescription() {
    let holder = {
      description: this.textMissionValue
    };
    let image = { file: this.selectedImage, }
    if (this.mission.mission_type == 'type17') {
      Object.assign(holder, image);
    }
    this.events.publish('mission:fieldUpdates', holder);
  }

  toggleMissionStatus() {
    this.showMissionStatus = !this.showMissionStatus;
  }

  playGame(url) {
    let isGameMission: Boolean = true
    let options: InAppBrowserOptions = {
      'location': 'yes',
      'hideurlbar': 'yes',
    };
    this.loaderCtrl.showLoader();
    this.orientation.lock(this.orientation.ORIENTATIONS.LANDSCAPE)
    let browser = this.iab.create(url, '_blank', options);
    browser.on('exit').subscribe(event => {
      this.navCtrl.navigateBack('game-mission-page');
      this.events.publish('misssion:refreshPage', isGameMission);
      this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT);
    });
  }
}
