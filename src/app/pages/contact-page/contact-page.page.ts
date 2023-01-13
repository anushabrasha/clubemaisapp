import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { LoaderService } from '../../services/loader/loader.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { FormControlService } from '../../services/formControl/form-control.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.page.html',
  styleUrls: ['./contact-page.page.scss'],
})
export class ContactPagePage implements OnInit {
  hideHeader: Boolean = false; showHistory = false; hideUSerInfo = false; successView: Boolean = false;
  showNewForm = true;
  pageTitle = 'Fale Conosco';
  contactForm;
  errorClass = 'error';
  historyList = [];
  userCPF = '';
  whatsAppLink = 'https://wa.me/+5521967496077';


  constructor(
    private navCtrl: NavController,
    private ApiService: ApiHelperService,
    public loaderCtrl: LoaderService,
    private controlPanelService: ControlPanelService,
    private dataProvider: DataHolderService,
    private formCtrl: FormControlService,
  ) { }

  ngOnInit() {
    let token = this.controlPanelService.getLocalStorageData('x-auth-sb');
    this.hideUSerInfo = token ? false : true;

    this.contactForm = this.formCtrl.contactForm();
    this.getCPF();
  }

  getCPF() {
    let cpf = this.controlPanelService.getLocalStorageData('cpf');
    if (cpf) {
      this.userCPF = cpf;
    } else {
      this.userCPF = '';
    }
  }

  openFAQPage() {
    this.navCtrl.navigateForward('/faq')
  }

  getHistory() {
    let endpoint = this.dataProvider.endPoints.history;

    this.loaderCtrl.showLoader();
    this.ApiService.get(endpoint, '').subscribe((success: any) => {
      this.loaderCtrl.stopLoader();

      if (!success.length) {
        let alertData = {
          isSuccess: 'empty',
          message: "Nenhuma lista encontrada.",
        };
        this.triggerAlert(alertData, 'small-alert');
        this.toggleContent('new');
        return false;
      }
      this.historyList = success;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });
  }

  submitForm() {
    let endpoint = this.dataProvider.endPoints.faleConosco;
    let contactFormData = this.contactForm.value;
    let formData: any = new FormData();

    formData.append("your-name", contactFormData.name);
    formData.append("your-email", contactFormData.email);
    formData.append("telephone", contactFormData.telephone);
    formData.append("your-subject", contactFormData.subject);
    formData.append("your-message", contactFormData.message);
    formData.append("user-cpf", this.userCPF);

    this.loaderCtrl.showLoader();
    this.ApiService.post(endpoint, formData).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();

      if (success && success.status != "mail_sent") {
        let alertData = {
          isSuccess: 'empty',
          message: "Erro ao enviar. por favor, tente novamente mais tarde.",
        };
        this.triggerAlert(alertData, 'small-alert');
        return false;
      }
      this.successView = true;
      this.contactForm = this.formCtrl.contactForm();
    }, (error) => {
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

  toggleContent(tag) {
    if (tag == 'new') {
      this.showNewForm = true;
      this.showHistory = false;
    } else if (tag == 'history') {
      this.getHistory();
      this.showHistory = true;
      this.showNewForm = false;
    } else {

    }
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  openWhatsapp() {
    this.controlPanelService.openLink(this.whatsAppLink, '_system');
  }

  toBack() {
    this.navCtrl.pop();
  }

  getError(value, field) {
    if (value) {
      return field == 'name' ? 'name inválido' : 'email inválido'
    } else {
      return 'campo obrigatório'
    }
  }
}
