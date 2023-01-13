import { Component, OnInit } from '@angular/core';
import { ControlPanelService } from 'src/app/services/controlPanel/control-panel.service';

@Component({
  selector: 'app-programas-de-reconhecimento',
  templateUrl: './programas-de-reconhecimento.page.html',
  styleUrls: ['./programas-de-reconhecimento.page.scss'],
})
export class ProgramasDeReconhecimentoPage implements OnInit {
  estrelasDoClubeLink = '';
  clubeDeVendasLink = '';
  clubeDeRetiradasLink = ''

  constructor(
    private ctrlPanel: ControlPanelService
  ) { }

  ngOnInit() {
    this.getPdfLink()
  }

  getPdfLink = () => {
    this.clubeDeRetiradasLink = this.ctrlPanel.getLocalStorageData('Clube_de_Retiradas');
    this.clubeDeVendasLink = this.ctrlPanel.getLocalStorageData('Clube_de_Vendas');
    this.estrelasDoClubeLink = this.ctrlPanel.getLocalStorageData('clubeStarLink');
  }

  openPdf(key) {
    let url = ''
    if (key == 'clubeDeRetiradasLink') {
      url = this.clubeDeRetiradasLink
    } else if (key == 'clubeDeVendasLink') {
      url = this.clubeDeVendasLink
    } else if (key == 'estrelasDoClubeLink') {
      url = this.estrelasDoClubeLink
    }
    if (!url) {
      let alertData = {
        isSuccess: 'empty',
        message: 'O documento não está disponível agora',
      };
      this.ctrlPanel.triggerAlert(alertData, 'small-alert');
      return false;
    }
    this.ctrlPanel.openLink(url);
  }

}
