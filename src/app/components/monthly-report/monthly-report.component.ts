import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';

import { PerformanceService } from '../../services/performance/performance.service';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.scss'],
})
export class MonthlyReportComponent implements OnInit {
  @Input() userData: any;
  slideOpts = {
    initialSlide: 0,
  };
  userList = [];
  listingData = [];
  title = [];
  show = false;
  isConselta = false;

  constructor(
    private performanceCtrl: PerformanceService,
    private ctrlService: ControlPanelService,
    private events: Events,
  ) { }

  ngOnInit() {
    try {
      console.log('data monthly 1', this.userData);
      if (this.userData.tecnico) {
        let localData = this.ctrlService.getLocalStorageData('performanceFilter');
        if (localData) {
          this.userData = localData;
        }
        this.listingData = this.userData.tecnico;
        this.isConselta = true;
        console.log('data monthly', this.listingData);
        return;
      }

      this.listingData = this.userData;
           
      this.userList = this.userData;
      console.log(this.userList);
      this.eventHandlers();
      this.performanceCtrl.mapUserMonthlyDetail(this.userData, 'monthlyReport:optimize');
    } catch (error) {
      this.userList = [];
      this.isConselta = false;
      console.log('error mensal', error);
    }

  }

  ngOnDestroy() {
    this.events.unsubscribe('monthlyReport:optimize');
  }

  eventHandlers() {
    this.monthlyReportOptimizer();
  }

  monthlyReportOptimizer() {
    this.events.subscribe('monthlyReport:optimize', (processedData) => {
      console.log(processedData);
      this.title = processedData.title;
      this.listingData = processedData.report;
    });
  }
}
