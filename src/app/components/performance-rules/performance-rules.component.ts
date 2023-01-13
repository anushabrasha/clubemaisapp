import { Component, OnInit, Input } from '@angular/core';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';

import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-performance-rules',
  templateUrl: './performance-rules.component.html',
  styleUrls: ['./performance-rules.component.scss'],
})
export class PerformanceRulesComponent implements OnInit {
  @Input() userData: any;
  role;
  shortlistedRoles = ['almoxarife', 'supervisor_tcnico', 'tecnico', 'torre'];
  listdata;
  showEspecial: boolean = false;
  showMaster: boolean = false;
  showSky: boolean = false;
  min_servicos;
  fatura_paga;
  slideOpts = {
    initialSlide: 0,
  };
  show = false;
  constructor(
    private iab: InAppBrowser,
    private ctrlPanel: ControlPanelService,
  ) { }

  ngOnInit() {
    try {
      if (this.userData.vendedor) {
        this.role = 'proprietrio';
        let localData = this.ctrlPanel.getLocalStorageData('performanceFilter');
        if (localData) {
          this.userData = localData;
        }
        this.listdata = this.userData.vendedor;
        console.log('data performance rules', this.listdata);
        return;
      }
      this.role = this.userData[0].role;
      console.log(this.userData);
      let report = this.userData[0].report;
      this.min_servicos = report[0].MIN_SERVICO ? report[0].MIN_SERVICO : '';
      this.fatura_paga = report[0].MAX_P2 ? report[0].MAX_P2 + '%' : report[0].MAX_P2_PDV + '%';
      if (this.role == "proprietrio") {
        this.generateProprietrio(report);
      } else if (this.shortlistedRoles.includes(this.role)) {
        let userData = report[0];
        if (userData.Tipo_Credenciado == 'CREDENCIADO ESPECIAL') {
          this.showEspecial = true;
        } else if (userData.Tipo_Credenciado == 'CREDENCIADO MASTER') {
          this.showMaster = true;
        } else if (userData.Tipo_Credenciado == 'CREDENCIADO SKY') {
          this.showSky = true;
        }
      } else {

      }
    } catch (error) {
      this.role = '';
    }
  }

  generateProprietrio(report) {
    this.listdata = report[0];
    var NotaList = ['N5', 'N4', 'N3', 'N2', 'N1'];
    var notaSum = 0;
    NotaList.forEach(element => {
      if (this.listdata[element] >= 0) {
        notaSum += parseInt(this.listdata[element]);
      }
    });
    this.listdata.NSum = notaSum;
  }

  downloadRegulamento() {
    let options: InAppBrowserOptions = {
      'location': 'yes',
      'fullscreen': 'yes',
    };
    let userLink = this.ctrlPanel.getLocalStorageData('regulamentoLink');
    if (userLink) {
      const browser = this.iab.create(userLink, '_system', options);
    } else {
      this.ctrlPanel.presentToast('Arquivo não encontrado, por favor, tente novamente mais tarde.');
    }
  }
}
