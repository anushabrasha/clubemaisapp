import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
// unused imports removed
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class PdfViewerService {

  constructor(
    private ctrlPanel: ControlPanelService,
    private iab: InAppBrowser,
  ) { }

  downloadAndView(link) {
    this.ctrlPanel.presentToast('Seu download começará em breve.');
    let options: InAppBrowserOptions = {
      'location': 'yes',
      'fullscreen': 'yes',
      'hideurlbar': 'yes',
      'toolbar': 'yes',
      'closebuttoncaption': 'Voltar',
      'hidenavigationbuttons': 'yes'
    };
    this.iab.create(link, '_system', options);
    //commented code removed
  }
}
