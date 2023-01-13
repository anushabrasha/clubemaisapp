import { Component, OnInit, ViewChild } from '@angular/core';
import { Events, NavController, IonInfiniteScroll } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';

import {
  ControlPanelService, DataHolderService, LoaderService, ApiHelperService, PdfViewerService
} from 'src/app/services/';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-training-page',
  templateUrl: './training-page.page.html',
  styleUrls: ['./training-page.page.scss'],
})
export class TrainingPagePage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  hideHeader: Boolean = false;
  aprendaList: any = []; infiniteScrollEvent: any;
  selectedAprendaCategory;
  searchString; showCategory; trainingCategory;
  isAprendaPresent: Boolean = true;
  isAprendaNotFound: Boolean = false;


  constructor(
    private controlPanel: ControlPanelService,
    private loaderCtrl: LoaderService,
    private events: Events,
    private navCtrl: NavController,
    private dataCtrl: DataHolderService,
    private apiCtrl: ApiHelperService,
    private iab: InAppBrowser,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.trainingCategory = this.controlPanel.getLocalStorageData('trainingCategory');
    this.trainingCategory[0].status = 'active'
    this.selectedAprendaCategory = this.trainingCategory[0].category.split(':')[0];
    this.hangleToSinglePage();
    this.getCourseList();
  }

  searchCourse() {
    this.getCourseList();
  }

  getCourseList() {
    let endPoint = this.dataCtrl.endPoints.aprendaCategory + '?random=' + Math.floor((Math.random() * 10000) + 1);
    let data: any = {};

    data.page = 1;
    data.category = this.selectedAprendaCategory;
    if (this.searchString) {
      data.search_string = this.searchString
    }

    this.loaderCtrl.showLoader();
    this.apiCtrl.aprendaGet(endPoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (!success.length) {
        if (success.message) {
          let alertData = {
            isSuccess: 'shop-popup-error',
            message: success.message,
          };
          this.triggerAlert(alertData, 'shop-popup');
        }
        this.isAprendaPresent = false;
        return false;
      }
      success.forEach((element, index) => {
        let domain = element.link.split('/courses');
        let imageURL = domain[0] + '/wp-json/scit/v1/course/image?id=' + element.id;
        this.getImageURL(index, imageURL);
      });

      this.aprendaList = success;

      if (!this.searchString && !this.aprendaList.length) {
        this.isAprendaPresent = false;
      } else if (this.searchString && !this.aprendaList.length) {
        this.isAprendaNotFound = true;
      }

      // pagination removed

      this.events.publish('aprenda:list', this.aprendaList);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log("getSelectedproduct error ", error);
    });
  }

  getImageURL(position, url) {
    this.apiCtrl.getUsingURL(url).subscribe((success: any) => {
      if (success) {
        this.aprendaList[position].imageURL = success;
      }
    }, (error) => {
      if (error.error && error.error.text) {
        this.aprendaList[position].imageURL = error.error.text;
      }
    });
  }

  hangleToSinglePage() {
    this.events.subscribe('archivePage:toSinglePage', (selectedAprenda) => {
      this.navigatePage(selectedAprenda);
    });
  }

  navigatePage(selectedAprenda) {
    this.forIOSInApp(selectedAprenda);
  }

  ngOnDestroy() {
    this.events.unsubscribe('archivePage:toSinglePage');
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanel.triggerAlert(AlertPopupComponent, alertData);
    }
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

  changeCategory(selected) {
    this.trainingCategory.forEach(category => {
      if (category.status) {
        category.status = !category.status
      }
    });
    selected.status = 'active';
    this.selectedAprendaCategory = selected.category.split(':')[0]
    this.getCourseList();
  }

  forIOSInApp(selectedAprenda) {
    let token = this.controlPanel.getLocalStorageData('x-auth-sb');
    let url: any = selectedAprenda.link + '?iframe=true&token=' + token
    url = this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(url));
    url = url.changingThisBreaksApplicationSecurity
    let options: InAppBrowserOptions = {
      'location': 'no',
      'fullscreen': 'yes',
      'hideurlbar': 'yes',
      "zoom": "no",
      'toolbar': 'yes',
      'closebuttoncaption': 'Voltar',
      'hidenavigationbuttons': 'yes',
    };
    const browser = this.iab.create(url, '_blank', options);

    browser.on('message').subscribe((event) => {
      const postObject: any = event;
      if (postObject.data.link) {
        browser.close();
        this.controlPanel.openLink(postObject.data.link, '_system');
      }
    });

    browser.on('loadstop').subscribe(function (event) {
      browser.executeScript({
        code: "\
        document.querySelector('a.video-download-mobile').onclick = function (e) {\
          e.preventDefault();\
          if(event.target.href) {\
            webkit['messageHandlers']['cordova_iab'].postMessage(JSON.stringify({link: event.target.href}));\
          }\
        }"
      });
    });
  }

  // pagination removed
}
