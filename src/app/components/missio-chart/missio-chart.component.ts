import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';

import { PerformanceService } from '../../services/performance/performance.service';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';

@Component({
  selector: 'app-missio-chart',
  templateUrl: './missio-chart.component.html',
  styleUrls: ['./missio-chart.component.scss'],
})
export class MissioChartComponent implements OnInit {
  @Input() userData: any;
  role;
  listingData: any = {};
  showEstrelagem = false;
  ToshowRegras = true;

  constructor(
    private performanceCtrl: PerformanceService,
    private events: Events,
    private controlPanelService: ControlPanelService,
  ) { }

  ngOnInit() {
    console.log(this.userData);
    this.listingData = {};
    try {
      if (this.userData.role) {
        this.role = this.userData.role;
        let reportData = this.userData;
        this.eventHandlers();
        this.performanceCtrl.mapUserMissioDetail(reportData, 'missioReport:optimize');
      }
    } catch (error) {
      this.role = '';
    }
  }

  ngOnDestroy() {
    this.events.unsubscribe('missioReport:optimize');
  }

  eventHandlers() {
    this.missioReportOptimizer();
  }

  missioReportOptimizer() {
    this.events.subscribe('missioReport:optimize', (processedData) => {
      console.log('ind', processedData);
      // this.title = processedData.title;
      this.listingData = processedData;
    });
  }


  toggle(token) {
    if (token) {
      this.ToshowRegras = false;
    } else {
      this.ToshowRegras = true;
    }
  }
}
