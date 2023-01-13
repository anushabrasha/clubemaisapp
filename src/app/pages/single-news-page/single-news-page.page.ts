import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Events, NavController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { ControlPanelService } from 'src/app/services/controlPanel/control-panel.service';


@Component({
  selector: 'app-single-news-page',
  templateUrl: './single-news-page.page.html',
  styleUrls: ['./single-news-page.page.scss'],
})
export class SingleNewsPagePage implements OnInit {
  hideHeader: Boolean = false;
  newsSinglePageToBackEvent = 'newsSinglePage:toBack';
  news;
  videoUrl;
  sanatized;
  similarNewList = []

  constructor(
    private activeRoute: ActivatedRoute,
    private events: Events,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private ApiService: ApiHelperService,
    public loaderCtrl: LoaderService,
    private dataCtrl: DataHolderService,
    private ctrlPanel: ControlPanelService
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.news = JSON.parse(params["selectednews"]);
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4');
      this.sanatized = this.sanitizer.bypassSecurityTrustHtml(this.news.post_content);
      this.getNewsLike();
      this.handleBackButton();
      this.getSimilarNews();
      this.focusElement();
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('newsSinglePage:toBack');
  }

  getNewsLike() {
    let endpoint = this.dataCtrl.endPoints.like;
    let data = {
      post_id: this.news.id,
      cpf: this.ctrlPanel.getLocalStorageData('cpf')
    }
    this.loaderCtrl.showLoader();
    this.ApiService.get(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      this.news.is_user_liked = success.current_user_emoji ? success.current_user_emoji : 0;
      this.news.post_like_count = success.emoji_1_count == '' ? 0 : success.emoji_1_count;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    })
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  handleBackButton() {
    this.events.subscribe('newsSinglePage:toBack', (type) => {
      this.toBack();
    });
  }

  openVideo(url) {
    this.ctrlPanel.openLink(url, '_system');
  }

  toBack() {
    this.navCtrl.pop();
  }

  focusElement() {
    if (!document.getElementById('focusContent')) {
      setTimeout(() => {
        this.focusElement();
      }, 300);
      return false;
    }

    document.getElementById('focusContent').scrollIntoView()
  }

  likeNews(postId) {
    let endpoint = this.dataCtrl.endPoints.like;
    let data = {
      emoji_id: 1,
      post_id: postId,
      cpf: this.ctrlPanel.getLocalStorageData('cpf')
    };
    this.loaderCtrl.showLoader();
    this.ApiService.post(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let newsData = success;
      let newsSuccessMessage = 'update_emoji_success';
      if (newsData && newsData.code !== newsSuccessMessage) {
        return false;
      }
      this.getNewsLike();
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });
  }

  getSimilarNews() {
    let endpoint = this.dataCtrl.endPoints.news;
    let data: any = {};
    data.category = this.news.category;

    this.loaderCtrl.showLoader();
    this.ApiService.get(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let newsData = success;
      let newsSuccessMessage = 'get_news_success';
      if (newsData && newsData.code !== newsSuccessMessage) {
        return false;
      }
      let newsList = newsData.data.posts.slice(0, 4);
      let currentNewsIndex = newsList.findIndex(news => news.id == this.news.id);
      console.log(currentNewsIndex)
      if (currentNewsIndex != -1 && currentNewsIndex <= 3) {
        newsList.splice(currentNewsIndex, 1);
        this.similarNewList = newsList;
      } else {
        newsList.splice(3, 1);
        this.similarNewList = newsList
      }
      this.similarNewList = this.similarNewList.slice(0, 2)
      this.events.publish('news:list', this.similarNewList);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error)
    });
  }
}
