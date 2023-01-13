import { Component, OnInit, NgZone,Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-user-card-info',
  templateUrl: './user-card-info.component.html',
  styleUrls: ['./user-card-info.component.scss'],
})

export class UserCardInfoComponent implements OnInit {
  @Output() userCardInfoEvent = new EventEmitter<string>();
  @Input() userId: any;
  perfil = '';
  regional='';
  selos='';
  userExtraInfo: any="";
  constructor(
    private ngZone: NgZone,
    private dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private controlPanelService: ControlPanelService,
    private sanitizer: DomSanitizer,
  
  ) { }

  ngOnInit() {

     this.extraUserInfo(this.userId);
    
  }
  addNewItem(value: string) {
    this.userCardInfoEvent.emit(value);
  }

  extraUserInfo(userId) {

    let formData = new FormData();
    
    let data = {
      'user_id': userId,
      
    }

        formData.append("user_id",userId);
        
       // data = formData;

    let endpoint = this.dataProvider.endPoints.extraUserInfo;
    this.loaderCtrl.showLoader();
   
      this.apiCtrl.postTokenWithPlugin(endpoint, data).then((success: any) => {
      this.loaderCtrl.stopLoader();
      console.log('suceess data', JSON.parse(success.data)['data']);
      this.userExtraInfo = JSON.parse(success.data)['data'];
     
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });

  }

}
