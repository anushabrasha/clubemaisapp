import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonInfiniteScroll, Events } from '@ionic/angular';

import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';

import * as moment from 'moment';


@Component({
  selector: 'app-extrato-page',
  templateUrl: './extrato-page.page.html',
  styleUrls: ['./extrato-page.page.scss'],
})
export class ExtratoPagePage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  hideHeader: Boolean = false;
  startPage = 0; drawLength = 10;
  orderItems = []; orderList = [];

  searchString = ''; selectedTipoFilter = '';
  currentPoints: any = 0; infiniteScrollEvent: any;
  expiredPoints = 0; drawCount = 1;

  fromDate; toDate; date; search;

  constructor(
    private events: Events,
    private dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private controlPanelService: ControlPanelService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.eventHandler();
    this.controlPanelService.getUserDetailsServer('userDetail:get-extrato');
    this.getOrderList();
    //pointExpire
  }

  ionViewWillLeave() {
    this.events.unsubscribe('userDetail:get-extrato');
  }

  eventHandler() {
    this.events.subscribe('userDetail:get-extrato', (userData) => {
      this.currentPoints = this.controlPanelService.getLocalStorageData('points');
      this.currentPoints = this.controlPanelService.ptBrNumberFormat(this.currentPoints, true);
      this.expiredPoints = this.controlPanelService.getLocalStorageData('pointExpire');
    });
  }

  dateFilter() {
    let start = this.fromDate;
    let end = this.toDate;
    let alertData = {
      isSuccess: 'empty',
      message: 'a data selecionada não é válida',
    };

    if (!start || !end) {
      this.triggerAlert(alertData, 'small-alert');
      return false;
    } else if ((start != end) && (!moment(end).isAfter(moment(start)))) {
      this.triggerAlert(alertData, 'small-alert');
      return false;
    }
    this.date = {
      'start_date': moment(start).format("YYYY-MM-DD"),
      'end_date': moment(end).format("YYYY-MM-DD"),
    };
    this.getOrderList('date', 1, 0);
  }

  filterByTipo(selectedTipo) {
    this.selectedTipoFilter = selectedTipo;
    this.getOrderList('tipo', 1, 0);
  }

  getOrderList(filterBy?, drawCount?, startCount?) {
    let endpoint = this.dataProvider.endPoints.extrato;

    let data: any = {
      'start': this.startPage,
      'length': this.drawLength,
      'search': { value: "", regex: false }
    };

    if (filterBy) {
      this.drawCount = drawCount
      data.start = startCount
      if (filterBy == 'date') {
        data = { ...data, ...this.date }
      } else if (filterBy == 'tipo' && this.selectedTipoFilter != '') {
        data.type = this.selectedTipoFilter;
      } else {

      }
    }

    if (this.drawCount > 1) {
      data.draw = this.drawCount;
    }

    if (this.searchString) {
      data.search.value = this.searchString;
    }

    this.loaderCtrl.showLoader();

    this.apiCtrl.post(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();

      if (!success || !success.data || !success.data.length) {
        let alertData = {
          isSuccess: 'empty',
          message: 'Extrato sem movimentação.',
        };
        this.toggleInfiniteScroll();
        this.triggerAlert(alertData, 'small-alert');
        if (this.drawCount <= 1 && !success.data.length) {
          this.orderList = [];
        }
        return false;
      }
      if (this.drawCount > 1) {
        this.orderList = this.orderList.concat(success.data);
      } else {
        this.orderList = success.data;
      }
      if (success.data.length < 10) {
        this.toggleInfiniteScroll();
      } else {
        this.completeInfiniteScrollEvent();
      }

    }, (error) => {
      this.toggleInfiniteScroll();
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  loadMoreData(event) {
    this.infiniteScrollEvent = event;
    this.startPage = 10 * this.drawCount;
    this.drawCount = 1 + this.drawCount;
    if (this.selectedTipoFilter != '') {
      this.getOrderList('tipo', this.drawCount, this.startPage);
      return false;
    }
    this.getOrderList();
  }

  completeInfiniteScrollEvent() {
    if (this.infiniteScrollEvent) {
      this.infiniteScrollEvent.target.complete();
    }
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = true;
  }

  searchTable() {

  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  toBack() {
    this.navCtrl.pop();
  }

  showContent(orderData) {
    orderData.showContent = !orderData.showContent;
  }
}
