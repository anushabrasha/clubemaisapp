import { Component, OnInit, ViewChild } from '@angular/core';
import { Events, NavController, IonInfiniteScroll } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import {
  ControlPanelService, DataHolderService, LoaderService, ApiHelperService
} from 'src/app/services/';


@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.page.html',
  styleUrls: ['./news-page.page.scss'],
})
export class NewsPagePage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  hideHeader: Boolean = false; newsListToken: Boolean = false; showCategory: Boolean = false;
  newsList = []; newsCategory = [];
  selectedNewsCategory; searchString;
  currentPage = 1;
  infiniteScrollEvent: any;
  totalPages = 1;
  isNewsPresent: Boolean = true;
  newsNotFound: Boolean = false;

  constructor(
    private events: Events,
    private navCtrl: NavController,
    private ApiService: ApiHelperService,
    public loaderCtrl: LoaderService,
    private dataCtrl: DataHolderService,
    private controlPanelService: ControlPanelService,
  ) { }

  ngOnInit() {
    this.EvenHandle();
    this.newsCategory = this.controlPanelService.getLocalStorageData('newsCategory');

    this.newsCategory[0].status = 'active';
    this.selectedNewsCategory = this.newsCategory[0].category.split(':')[0];
  }

  ionViewDidEnter() {
    this.currentPage = 1;
    this.getNewsList();
  }

  EvenHandle() {
    this.events.subscribe('newsPage:toSinglePage', (selectednews) => {
      this.navigatePage(selectednews);
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('newsPage:toSinglePage');
  }

  getNewsList() {
    let endpoint = this.dataCtrl.endPoints.news;
    let data: any = {};
    data.page = this.currentPage;

    data.category = this.selectedNewsCategory;

    if (this.searchString) {
      data.search_string = this.searchString
    }

    this.loaderCtrl.showLoader();
    this.ApiService.get(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let newsData = success;

      if (!this.searchString && !success.data.posts.length) {
        this.isNewsPresent = false
      } else if (this.searchString && !success.data.posts.length) {
        this.newsNotFound = true;
      }

      let newsSuccessMessage = 'get_news_success';
      if (newsData && newsData.code !== newsSuccessMessage) {
        this.toggleInfiniteScroll();
        return false;
      }
      this.totalPages = success.data.max_num_pages;
      if (this.currentPage > 1) {
        this.newsList = this.newsList.concat(newsData.data.posts);
      } else {
        this.newsList = newsData.data.posts;
      }
      this.currentPage++;
      if (newsData.data.posts.length < 10) {
        this.toggleInfiniteScroll();
      } else {
        this.completeInfiniteScrollEvent();
      }

      this.events.publish('news:list', this.newsList);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      this.toggleInfiniteScroll();
    });
  }

  navigatePage(selectednews) {
    selectednews.category = this.selectedNewsCategory;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        selectednews: JSON.stringify(selectednews),
      }
    };
    this.navCtrl.navigateForward(['single-news-page'], navigationExtras);
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  triggerAlert(alertData) {
    this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, 'small-alert');
  }

  toggleInfiniteScroll() {
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = true;
    }
  }

  completeInfiniteScrollEvent() {
    if (this.infiniteScrollEvent) {
      this.infiniteScrollEvent.target.complete();
    }
  }

  loadMoreData(event) {
    this.infiniteScrollEvent = event;
    if (this.totalPages >= this.currentPage) {
      this.getNewsList();
    } else {
      this.toggleInfiniteScroll();
    }
  }

  searchNews() {
    this.currentPage = 1;
    this.getNewsList();
  }

  changeCategory(selected) {
    this.newsCategory.forEach(category => {
      if (category.status) {
        category.status = '';
      }
    });
    selected.status = 'active';
    this.currentPage = 1;
    this.selectedNewsCategory = selected.category.split(':')[0];
    this.showCategory = false;
    this.newsList = [];
    this.getNewsList();
  }

  toBack() {
    this.navCtrl.pop();
  }
}
