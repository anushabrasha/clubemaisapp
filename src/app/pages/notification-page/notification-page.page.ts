import { Component, OnInit } from '@angular/core';
import { Events, NavController } from '@ionic/angular';

import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';
import { DataHolderService } from 'src/app/services/dataHolder/data-holder.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PdfViewerService } from '../../services/pdfViewer/pdf-viewer.service';

import * as moment from 'moment';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.page.html',
  styleUrls: ['./notification-page.page.scss'],
})
export class NotificationPagePage implements OnInit {
  hideHeader: Boolean = false;
  notificationToBackEvent = 'notification:toBack';
  isInfoView;
  listingData = [];

  constructor(
    private events: Events,
    private navCtrl: NavController,
    private controlPanel: ControlPanelService,
    private loaderCtrl: LoaderService,
    private dataCtrl: DataHolderService,
    private apiCtrl: ApiHelperService,
    private inAppBrowser: InAppBrowser,
    private PDFViewer: PdfViewerService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.eventListner();
    this.getNotificationData();
  }

  ngOnDestroy() {
    this.events.unsubscribe('notification:toBack');
    this.events.unsubscribe('notification:get');
  }

  eventListner() {
    this.handleBackButton();
    this.handleNotificationData();
  }

  markAsRead(selected) {

    if (selected.link !== '') {
      let link = new URL(selected.link);
      console.log(link)
      if (this.apiCtrl.baseUrl.includes(link.hostname)) {
        link.pathname === '/' ? this.navCtrl.navigateRoot('/dash-board') : this.navCtrl.navigateRoot(link.pathname)
      } else {
        const browser = this.inAppBrowser.create(selected.link, '_blank', 'location=no');
      }
    }

    if (selected.viewed) {
      return false;
    }

    let endpoint = this.dataCtrl.endPoints.notificationRead
    let data = {
      'notification_id': selected.ID,
      'viewed': true,
    };

    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let profileSuccessMessage = 'update_notification_success';

      if (success && success.code !== profileSuccessMessage) {
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.triggerAlert(alertData, 'small-alert');
        return false;
      }
      selected.viewed = true;
      this.checkNotificationCount();
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });

  }

  checkNotificationCount() {
    let count = 0;
    this.listingData.forEach(element => {
      if (element.viewed) {
        count++;
      }
    });
    let data = {
      notification_count: count
    }
    this.events.publish('notification:get', data);
  }

  getNotificationData() {
    this.controlPanel.getNotification('notification:get');
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  handleBackButton() {
    this.events.subscribe('notification:toBack', (type) => {
      this.toBack();
    });
  }

  handleNotificationData() {
    this.events.subscribe('notification:get', (data) => {
      let notificationList = data;
      console.log(notificationList);

      if (notificationList.notification && notificationList.notification.length) {
        this.listingData = notificationList.notification;
      } else {
        this.isInfoView = true
      }
    });
  }

  toBack() {
    this.navCtrl.pop();
  }

  timeFormater(date) {
    return moment(date).format("h:mm");
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData);
    }
  }
}
