import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';
import { ControlPanelService, DataHolderService, LoaderService, ApiHelperService } from 'src/app/services/';

@Component({
  selector: 'app-news-page-card',
  templateUrl: './news-page-card.component.html',
  styleUrls: ['./news-page-card.component.scss'],
})
export class NewsPageCardComponent implements OnInit {
  @Input() isFor: any;

  newsList;
  constructor(
    private events: Events,
    private dataHolder: DataHolderService,
    private apiCtrl: ApiHelperService,
    private ctrlPanel: ControlPanelService,
    private loaderCtrl: LoaderService,
  ) { }

  ngOnInit() {
    this.eventHandler();
  }

  ngOnDestroy() {
    this.events.unsubscribe('news:list');
  }

  eventHandler() {
    this.events.subscribe('news:list', (list) => {
      this.newsList = list;
    });
  }

  openSingleNewsView(selectednews) {
    if (selectednews.post_read_status != 1) {
      this.markNewsAsRead(selectednews);
    }
    this.events.publish("newsPage:toSinglePage", selectednews);
  }

  markNewsAsRead(selectednews) {
    let endpoint = this.dataHolder.endPoints.newsRead;
    let data = {
      'post_id': selectednews.id,
    };
    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success && success.code !== 'update_post_read_status_success') {
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.ctrlPanel.triggerAlert(alertData, 'small-alert')
        return false;
      }
      selectednews.post_read_status = 1;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(error);
    })

  }
}
