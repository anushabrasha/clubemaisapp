import { Component, OnInit, Input } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';

import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';

import * as moment from 'moment';

@Component({
  selector: 'app-performance-page',
  templateUrl: './performance-page.page.html',
  styleUrls: ['./performance-page.page.scss'],
})
export class PerformancePagePage implements OnInit {

  @Input() isFrom: Boolean;
  @Input() isDash: Boolean;

  hideHeader: Boolean = false;
  bars: any; colorArray: any;
  pageOneFlag: boolean = false; pageTwoFlag: boolean = false; pageThreeFlag: boolean = false;
  pageFourFlag: boolean = false; isConselta: boolean = false; toShowMissio: boolean = false;
  isRetirador: boolean = false; isGDISTRIBUTOR: boolean = false; constelacao: any = false;
  isServicePoliticy: boolean = false;
  monthlyData: any = [];
  weeklyData = {}; missioData: any = {}; weeklyListInfo: any = {};

  periodo; period; periodMission; periodMensal; selectedView = 1;
  periodRetirador; tipo; userRole; userName; dataM; userInfo;
  roles = ['Técnico', 'Supervisor Técnico', 'Torre'];



  constructor(
    private controlPanelService: ControlPanelService,
    private events: Events,
    private navCtrl: NavController,
    private dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private ctrlService: ControlPanelService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.isFrom = params["isConstelacao"]
    });
    this.getPerformanceData();
    this.userRole = this.ctrlService.getLocalStorageData('userRole');
    this.userRole = this.userRole[0];
    console.log(this.userRole);

    let userMeta = this.controlPanelService.getLocalStorageData('usermeta');
    if (userMeta && userMeta.Nome || userMeta.Tipo_Credenciado) {
      this.userName = userMeta.Nome;
      //this.tipo = userMeta.Tipo_Credenciado;
    }
    this.eventHandlers();
  }

  ngOnDestroy() {
    this.controlPanelService.removeFromLocalStorage('performanceFilter');
    this.events.unsubscribe('weeklyReport:optimize');
  }

  eventHandlers() {
    this.weeklyReportOptimizer();
  }

  weeklyReportOptimizer() {
    this.events.subscribe('weeklyReport:optimize', (processedData) => {
      this.weeklyListInfo = processedData;
    });
  }

  getPerformanceData() {
    let endpoint = this.dataProvider.endPoints.performance;
    //this.loaderCtrl.showLoader();
    this.apiCtrl.get(endpoint, '').subscribe((success: any) => {
      //this.loaderCtrl.stopLoader();
      if (!success || success.code != 'get_dash_success') {
        return false;
      }
      console.log(success);
      let userData = success.data;
      if (!userData) {
        this.weeklyData = false;
        this.monthlyData = false;
        return false;
      }
      let weeklyReportStructure = [];
      let monthlyReportStructure = [];

      let userDataHolder = {};
      for (const key in userData) {
        if (key.includes('constella_calendar_document_link')) {

        } else if (key.includes('default_month')) {
          this.controlPanelService.updateLocalStorage('selectedMonthConstela', userData[key]);
        } else {
          userDataHolder[key] = userData[key];
        }
      }

      for (const key in userDataHolder) {
        var role = key;
        var dataKeys = Object.keys(userDataHolder[key]);

        if (key.includes('proprietrio')) {
          this.isConselta = true;
          var weeklyStructure = {
            role: role,
            report: userDataHolder[key][dataKeys[0]]
          }
          weeklyReportStructure.push(weeklyStructure);
        } else {
          this.isConselta = false;
          this.pageOneFlag = true;

          if (key.includes('tecnico') || key.includes('retirador')) {
            this.toShowMissio = true;

            if (key.includes('tecnico')) {
              this.missioData = userDataHolder[key]['vw_sky_dash_w_missao_ret_tecnico'][0] ? userDataHolder[key]['vw_sky_dash_w_missao_ret_tecnico'][0] : {};
              this.missioData['role'] = 'tecnico';
            } else {
              this.toggleViewTo(4);
              this.missioData = userDataHolder[key]['vw_sky_dash_w_missao_ret_retirador'][0] ? userDataHolder[key]['vw_sky_dash_w_missao_ret_retirador'][0] : {};
              this.missioData['role'] = 'retirador';
              this.isRetirador = true;
              //Retirador
              let dataRetirador = this.missioData.Data_Apuracao ? this.missioData.Data_Apuracao : '';
              let mesatual: any = moment(dataRetirador).format('M');
              this.period = this.periodRetirador = this.dataProvider.fullMonths[mesatual - 1] + ' de ' + moment(dataRetirador).format('YYYY') + ' • Até ' + moment(dataRetirador).format('DD') + '/' + (moment(dataRetirador).format('M'));
            }
          }
          var monthlyStructure = {
            role: role,
            report: userDataHolder[key][dataKeys[0]]
          };
          var weeklyStructure = {
            role: role,
            report: userDataHolder[key][dataKeys[1]]
          }
          weeklyReportStructure.push(weeklyStructure);
          monthlyReportStructure.push(monthlyStructure);
        }
      }

      if (!weeklyReportStructure.length) {
        return false;
      }

      try {
        this.tipo = weeklyReportStructure[0].report[0].Tipo_Credenciado;
      } catch (error) {
        this.tipo = '';
      }
      this.weeklyData = weeklyReportStructure;
      console.log(weeklyReportStructure, monthlyReportStructure);
      let data = weeklyReportStructure[0].report[0];

      if (this.isConselta) {
        //this.loaderCtrl.showLoader();
        endpoint = this.dataProvider.endPoints.performanceConstelacao;
        this.apiCtrl.getWithPlugin(endpoint).then((success: any) => {
          console.log('dashconst', success);
          //this.loaderCtrl.stopLoader();
          this.constelacao = JSON.parse(success.data)['data']
        }, (error) => {
          console.log(error);
        });

        let periodEndpoint = this.dataProvider.endPoints.periodList;
        this.apiCtrl.getWithPlugin(periodEndpoint).then((success: any) => {
          success = JSON.parse(success.data);
          if (!success || !success.length) {
            return false;
          }
          this.controlPanelService.updateLocalStorage('periodList', success);
        });
      }

      if (this.userRole !== 'Proprietário') {
        this.dataM = monthlyReportStructure[0]?.report[0];
      } else {
        this.dataM = {};
      }
      let date = data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO;
      let momentMonth: any = moment(date).format('M');
      this.userRole === 'Proprietário' ? this.period = this.dataProvider.fullMonths[momentMonth - 1] + ' de ' + moment(date).format('YYYY') + ' • Até ' + moment(date).format('DD') + '/' + (moment(date).format('M')) : '';
      this.periodo = this.period = this.dataProvider.fullMonths[momentMonth - 1] + ' de ' + moment(date).format('YYYY') + ' • Até ' + moment(date).format('D') + '/' + (moment(date).format('M'));

      this.roles.forEach((element, index) => {
        if (this.userRole == element) {
          this.isServicePoliticy = true;
        }
      });
      if (typeof this.userName === "undefined") {
        this.userName = data.Nome;
      }
      if (!data || !this.dataM) {
        return false;
      }
      console.log('dataapuracao', this.dataM.DATA_APURACAO);
      this.tipo = data.Tipo_Credenciado;
      this.userRole === 'Proprietário' ? this.period = this.dataProvider.fullMonths[momentMonth - 1] + ' de ' + moment(date).format('YYYY') + ' • Até ' + moment(date).format('DD') + '/' + (moment(date).format('M')) : '';
      //this.periodo = this.period = this.dataProvider.fullMonths[momentMonth - 1] + ' de ' + moment(date).format('YYYY') + ' • Até ' + moment(date).format('DD') + '/' + (moment(date).format('M'));
      //Mensal
      if (this.userRole != 'Proprietário') {
        let dateM = this.dataM.DATA_APURACAO ? this.dataM.DATA_APURACAO : data.Data_Apuracao;
        let mesMensal: any = moment(dateM).format('M');
        this.periodMensal = this.dataProvider.fullMonths[mesMensal - 1] + ' de ' + moment(dateM).format('YYYY');

      }
      //Missão
      let dataMissio = this.missioData.Data_Apuracao ? this.missioData.Data_Apuracao : data.DATA_APURACAO;
      let mesatual: any = moment(dataMissio).format('M');
      this.periodMission = this.dataProvider.fullMonths[mesatual - 1] + ' de ' + moment(dataMissio).format('YYYY') + ' • Até ' + moment(dataMissio).format('DD') + '/' + (moment(dataMissio).format('M'));
      console.log(this.dataProvider.fullMonths[mesatual - 1] + ' de ' + moment(dataMissio).format('YYYY') + ' • Até ' + moment(dataMissio).format('DD') + '/' + (moment(dataMissio).format('M')));

      //Temporarily show only the rules tab.
      if (this.userRole == 'GERENTE DISTRIBUIDOR') {
        //this.toggleViewTo(5);
        //this.isGDISTRIBUTOR = true;
      }

      this.monthlyData = monthlyReportStructure;
    }, (error) => {
      //this.loaderCtrl.stopLoader();
      console.log("getPerformanceData error ", error);
    });
  }

  toggleViewTo(index) {
    if (index == 1) {
      this.pageOneFlag = true;
      this.pageTwoFlag = false;
      this.pageThreeFlag = false;
      this.pageFourFlag = false;
      this.period = this.periodo;
    } else if (index == 2) {
      this.pageOneFlag = false;
      this.pageTwoFlag = true;
      this.pageThreeFlag = false;
      this.pageFourFlag = false;
      this.period = this.periodMensal;
      console.log(this.monthlyData, this.pageTwoFlag, !this.constelacao);
      //this.period = this.periodo;
    } else if (index == 3) {
      this.pageOneFlag = false;
      this.pageTwoFlag = false;
      this.pageThreeFlag = true;
      this.pageFourFlag = false;
      this.period = this.periodo;
    } else if (index == 4) {
      this.pageOneFlag = false;
      this.pageTwoFlag = false;
      this.pageThreeFlag = false;
      this.pageFourFlag = true;
      this.period = this.periodMission;
    } else if (index == 5) {
      this.pageOneFlag = false;
      this.pageTwoFlag = false;
      this.pageThreeFlag = true;
      this.pageFourFlag = false;
      this.period = this.periodMensal;
    } else {

    }
  }

  updateView() {
    this.toggleViewTo(this.selectedView)
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }
}
