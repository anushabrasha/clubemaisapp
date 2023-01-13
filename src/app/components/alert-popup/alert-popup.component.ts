import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController, Events } from '@ionic/angular';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss'],
})
export class AlertPopupComponent implements OnInit {

  otpValue;
  alertData;
  alertMessage;
  isSuccess;

  constructor(
    public navParams: NavParams,
    public modalController: ModalController,
    private controlPanelService: ControlPanelService,
    private navCtrl: NavController,
    private events: Events
  ) { }

  ngOnInit() {
    this.alertData = this.navParams.get('modelDataHolder');
    this.showAlert();
  }

  showAlert() {
    this.alertMessage = this.alertData['message'];
    this.isSuccess = this.alertData['isSuccess'];
  }

  closePopup() {
    this.controlPanelService.closeTrigger();
  }

  openAppRating() {
    this.closePopup();
    this.controlPanelService.openAppRating();
    this.controlPanelService.updateLocalStorage('isUserRating', true);
    this.controlPanelService.triggerRatingApi();
  }

  closeAppRatingPopup() {
    this.closePopup();
    this.controlPanelService.updateLocalStorage('isUserRating', true);
    this.controlPanelService.updateLocalStorage('triggerUserRatingOnLogin', true);
  }

  openPage(page) {
    this.navCtrl.navigateForward('/' + page);
    this.controlPanelService.closeTrigger();
  }

  sendEmailOtp() {
    this.controlPanelService.generateOtp(this.alertData['key'], true);
  }

  submitOtp() {
    this.events.publish(this.alertData['key'] + '-doubleCheckPassword', this.otpValue);
    this.closePopup();
  }
}
