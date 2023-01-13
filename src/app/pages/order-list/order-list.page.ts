import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Events, IonInfiniteScroll } from '@ionic/angular';

import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';

import * as moment from 'moment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  hideHeader: Boolean = false;
  showOrderlist = true;
  orderList = [];
  selectedOrder: any = {};
  orderItems = [];
  search;
  isNextListDisabled = false;
  toShowPrevious = false;
  startPage = 1;
  drawLength = 10;
  selectedAccordion = '';
  fromDate;
  toDate;
  infiniteScrollEvent: any;
  drawCount = 1;




  constructor(
    private navCtrl: NavController,
    public dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private controlPanelService: ControlPanelService,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.orderList = [];
    this.getOrderList();
  }

  toggleBetweenPages(selectedOrder?) {
    if (selectedOrder) {
      this.selectedOrder = selectedOrder;
      this.selectedOrder['total'] = 0;
      let orderItems: any = Object.values(selectedOrder.order_items);
      orderItems.forEach((element: any, index) => {
        element.meta_data.forEach(meta => {
          element.order_date = selectedOrder.order_date;
          element.order_id = selectedOrder.order_id;
          if (meta.key == 'points_to_redeem') {
            orderItems[index]['points_to_redeem'] = meta.value;
            this.selectedOrder['total'] += parseFloat(meta.value);
          } else if (meta.key == 'product_type') {
            orderItems[index]['product_type'] = meta.value;
          }
        });
      });
      this.orderItems = orderItems;

    } else {
      this.selectedOrder = {};
      this.orderItems = [];
    }
    this.showOrderlist = !this.showOrderlist;
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
    let date = {
      'start_date': moment(start).format("YYYY-MM-DD"),
      'end_date': moment(end).format("YYYY-MM-DD")
    };
    this.getOrderList(date);
  }

  getOrderList(date?) {
    let endpoint = this.dataProvider.endPoints.orderList;

    this.loaderCtrl.showLoader();
    let data: any = {
      'start': this.startPage,
      'length': this.drawLength,
    };
    if (date) {
      this.drawCount = 1;
      data.start = 0
      data = { ...data, ...date }
    }

    if (this.drawCount > 1) {
      data.draw = this.drawCount;
    }


    if (this.search) {
      data.order_id = this.search;
      data.start = 1;
      this.startPage = 1;
    }
    this.apiCtrl.post(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();

      if (!success || !success.data || !success.data.length) {
        let alertData = {
          isSuccess: 'empty',
          message: 'Não há mais pedidos..',
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
      this.completeInfiniteScrollEvent();

      if (success.recordsTotal <= success.recordsFiltered) {
        this.disableNextListconcept();
      } else {
        this.startPage = (this.drawLength + this.startPage);
      }

    }, (error) => {
      this.loaderCtrl.stopLoader();
      this.toggleInfiniteScroll();
      console.log(endpoint, error);
    });
  }

  toBack() {
    this.navCtrl.pop();
  }

  loadMoreData(event) {
    this.infiniteScrollEvent = event;
    this.startPage = 10 * this.drawCount;
    this.drawCount = 1 + this.drawCount;
    this.getOrderList();
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  disableNextListconcept() {
    this.isNextListDisabled = true;
  }

  toNext() {
    this.getOrderList();
  }

  toPrevious() {
    this.startPage = (this.startPage - (this.drawLength * 2));
    this.getOrderList();
  }

  triggerToggle(order) {
    if (this.selectedAccordion == order.order_id) {
      this.selectedAccordion = '';
    } else {
      this.selectedAccordion = order.order_id;
    }
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

  translateStatus(status){
    if(!status){
      return false;
    }
    switch(status){
      case 'pending':
        return 'pendente';
      case 'processing':
        return 'em processamento';
      case 'completed':
        return 'concluída';
      case 'cancelled':
        return 'cancelada';
      default:
        return status;
    }
  }

}
