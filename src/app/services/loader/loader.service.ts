import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loader;
  loaderKey;
  constructor(public loadingController: LoadingController) { }

  async showLoader() {
    if (this.getLocalStorageData('isLoaderPresent') == false) {
      this.updateLocalStorage('isLoaderPresent', true);
      this.loader = await this.loadingController.create();
      await this.loader.present();
      this.triggerAutoDismiss();
    }
  }

  async stopLoader() {
    if (this.loader) {
      await this.loader.dismiss();
      this.updateLocalStorage('isLoaderPresent', false);
    }
  }

  triggerAutoDismiss() {
    setTimeout(() => {
      this.stopLoader();
      this.updateLocalStorage('isLoaderPresent', false);
    }, 8000);
  }

  updateLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorageData(key) {
    if (!localStorage.getItem(key)) {
      return '';
    }
    let data = JSON.parse(localStorage.getItem(key));
    return data;
  }
}
