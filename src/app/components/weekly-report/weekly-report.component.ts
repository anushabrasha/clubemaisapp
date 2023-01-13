import { Component, OnInit, Input } from '@angular/core';
import { Events, Platform } from '@ionic/angular';

import { PerformanceService } from '../../services/performance/performance.service';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';
import { PdfViewerService } from '../../services/pdfViewer/pdf-viewer.service';
import * as moment from 'moment';

@Component({
  selector: 'app-weekly-report',
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.scss'],
})
export class WeeklyReportComponent implements OnInit {
  @Input() userData: any;
  role;
  listingData: any = {};
  showEstrelagem = false;
  periodList = [];
  selectedPeriod = '';
  customMonth = '--';
  downloadLink = '';
  dataAte = '--';
  competencia = '--';
  dataActual = '--';
  Tipo_Credenciado;
  digital = false;
  televendas = false;
  other = false;

  constructor(
    private performanceCtrl: PerformanceService,
    private events: Events,
    private ctrlService: ControlPanelService,
    private dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private PDFViewer: PdfViewerService,
    private iab: InAppBrowser,
    private fileOpener: FileOpener,
    public plt: Platform
  ) { }

  ngOnInit() {

    this.listingData = {};
    let localData = this.ctrlService.getLocalStorageData('usermeta');
    try {
      if (this.userData.length) {
        this.role = this.userData[0].role;
        this.Tipo_Credenciado = this.userData[0].report[0].Tipo_Credenciado

        if (this.Tipo_Credenciado == 'DIGITAL') {
          this.digital = true;
        } else if (this.Tipo_Credenciado == 'TELEVENDAS') {
          this.televendas = true;
        } else {
          this.other = true;
        }

        let reportData = this.userData[1] ? this.userData[1] : this.userData;
        this.eventHandlers();
        if (this.role != 'proprietrio') {
          this.performanceCtrl.mapUserWeeklyDetail(reportData, 'weeklyReport:optimize');
        }
      }
    } catch (error) {
      this.role = '';
    }
    if (this.role == 'proprietrio') {
      this.getPeroidList();
    }

  }

  getPeroidList() {
    let list = this.ctrlService.getLocalStorageData('periodList');
    let struct = { text: "Selecione", id: "" };
    if (!list) {
      return false;
    }
    list.unshift(struct);
    this.periodList = list;
    let localDefaultData = this.ctrlService.getLocalStorageData('selectedMonthConstela');
    if (localDefaultData) {
      let defaultData = localDefaultData;
      let holder = defaultData.split('-');
      let data = holder[0] + '-' + parseInt(holder[1]);
      this.selectedPeriod = data;
    } else {
      this.loaderCtrl.showLoader();
      let periodEndpoint = this.dataProvider.endPoints.defaltPeriodList;
      this.apiCtrl.get(periodEndpoint, '').subscribe((success: any) => {
        this.loaderCtrl.stopLoader();
        if (!success) {
          this.listingData = {};
          this.customMonth = '--';
          return false;
        }

        let defaultData = success;
        let holder = defaultData.split('-');
        let data = holder[0] + '-' + parseInt(holder[1]);
        this.selectedPeriod = data;
      });
    }
    this.periodUpdate();
  }

  periodUpdate() {
    let selected = this.selectedPeriod;
    this.customMonth = '--';

    if (!selected) {
      return false;
    }
    this.getChildList(selected);

    let data = {
      'Periodo': selected
    };
    this.loaderCtrl.showLoader();
    let endpoint = this.dataProvider.endPoints.performance;
    this.listingData = {};
    this.dataAte = '--';
    this.competencia = '--';
    this.dataActual = '--';
    this.downloadLink = '';

    this.apiCtrl.get(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (!success || !success.data || !success.data.proprietrio || !success.data.proprietrio.vw_sky_dash_constelacao) {
        this.listingData = {};
        return false;
      }

      let userData = success.data;

      this.downloadLink = userData['constella_calendar_document_link'] ? userData['constella_calendar_document_link'] : '';

      let weeklyReportStructure = [];
      for (const key in userData) {
        var role = key;
        var dataKeys = Object.keys(userData[key]);

        if (key.includes('proprietrio')) {
          var weeklyStructure = {
            role: role,
            report: userData[key][dataKeys[0]]
          }
          weeklyReportStructure.push(weeklyStructure);
        }
      }

      if (weeklyReportStructure[0]['report'][0]) {
        let dataHolder = weeklyReportStructure[0]['report'][0];
        this.dataAte = dataHolder['Data_Apuracao'] ? moment(dataHolder['Data_Apuracao']).format('DD/MM/YYYY') : '--';
        this.competencia = dataHolder['Competencia'] ? dataHolder['Competencia'] : '--';
        this.dataActual = dataHolder['data_atualizacao'] ? dataHolder['data_atualizacao'] : '--';
      }
      this.performanceCtrl.mapUserWeeklyDetail(weeklyReportStructure, 'weeklyReport:optimize');
    }, (error) => {
      this.loaderCtrl.stopLoader();
      this.listingData = {};
      this.customMonth = '--';
    });
  }

  getChildList(selected) {
    // this.loaderCtrl.showLoader();
    let endpoint = this.dataProvider.endPoints.performanceConstelacao;
    let data = {
      cpf: this.ctrlService.getLocalStorageData('cpf'),
      Periodo: selected
    }
    this.apiCtrl.getWithPlugin(endpoint, data).then((success: any) => {
      success = JSON.parse(success.data);

      this.loaderCtrl.stopLoader();
      this.ctrlService.updateLocalStorage('performanceFilter', success.data);
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('weeklyReport:optimize');
  }

  eventHandlers() {
    this.weeklyReportOptimizer();
  }

  weeklyReportOptimizer() {
    this.events.subscribe('weeklyReport:optimize', (processedData) => {

      // this.title = processedData.title;
      this.listingData = processedData;
      console.log(this.listingData);
      
      let selectedDate = processedData.date;
      if (selectedDate) {
        let month = this.dataProvider.fullMonths[parseInt(moment(selectedDate).format('M')) - 1];
        this.customMonth = month + ' ' + moment(selectedDate).format('YYYY') + ' • ATÉ ' + moment(selectedDate).format('DD/MM');
      }
    });
  }

  downloadConstelaReport() {
    if (!this.downloadLink) {
      return false;
    }
    this.iab.create(this.downloadLink, '_system');
  }

}
