import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataHolderService } from 'src/app/services/dataHolder/data-holder.service';
import { ApiHelperService } from 'src/app/services/apiHelper/api-helper.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ControlPanelService } from 'src/app/services/controlPanel/control-panel.service';
import { PdfViewerService } from 'src/app/services/pdfViewer/pdf-viewer.service';

@Component({
  selector: 'app-program-page',
  templateUrl: './program-page.page.html',
  styleUrls: ['./program-page.page.scss'],
})
export class ProgramPagePage implements OnInit {
  hideHeader: Boolean = false;
  leftButtonList: any
  rightButtonList: any
  showTechnicoContent: Boolean = false;
  showVendedorContent: Boolean = false;

  // sky user roles removed

  constructor(
    private apiCtrl: ApiHelperService,
    private loaerCtrl: LoaderService,
    private dataHolder: DataHolderService,
    private ctrlPanel: ControlPanelService,
    private pdfViewer: PdfViewerService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    // this.getProgramButton();
    this.checkUserRole();
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  getProgramButton() {
    let endPoint = this.dataHolder.endPoints.program;
    this.loaerCtrl.showLoader();
    this.apiCtrl.get(endPoint).subscribe((success: any) => {
      this.loaerCtrl.stopLoader();
      if (success && success.code === 'get_oprograma_success') {
        this.leftButtonList = success.data.o_programa_buttons_left;
        this.rightButtonList = success.data.o_programa_buttons_right;
      }
    }, (error) => {
      this.loaerCtrl.stopLoader();
      console.log(error)
    })
  }

  openPage(selected) {
    if (selected.button_link) {
      this.pdfViewer.downloadAndView(selected.button_link)
    } else {
      this.ctrlPanel.presentToast('documento não está disponível no momento')
    }
  }

  openRegulamentoPage() {
    this.navCtrl.navigateForward(['regulamento-page']);
  }

  checkUserRole() {
    let userRole = this.ctrlPanel.getLocalStorageData('userRole')[0].toLowerCase();
    if (userRole == 'vendedor isp') {
      this.showVendedorContent = true;
    } else if (userRole == 'técnico independente || técnico - distribuidor') {
      this.showTechnicoContent = true;
    } else {
      this.showTechnicoContent = true;
    }
  }

  toBack() {
    this.navCtrl.pop();
  }
}
