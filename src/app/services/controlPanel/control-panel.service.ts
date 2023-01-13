import { Injectable } from '@angular/core';
import { MenuController, ActionSheetController, ModalController, ToastController, Events, Platform, NavController, AlertController } from '@ionic/angular';
import { ApiHelperService } from '../apiHelper/api-helper.service';
import { LoaderService } from '../loader/loader.service';
import { DataHolderService } from '../dataHolder/data-holder.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NavigationExtras } from '@angular/router';

import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class ControlPanelService {

  modal = [];
  toastHolder: any;

  constructor(
    public modalController: ModalController,
    public menuCtrl: MenuController,
    public toastController: ToastController,
    public actionSheetController: ActionSheetController,
    private events: Events,
    private ApiService: ApiHelperService,
    public loaderCtrl: LoaderService,
    private dataCtrl: DataHolderService,
    private oneSignal: OneSignal,
    public platform: Platform,
    private networkChecker: Network,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    public alertController: AlertController,
  ) {
    this.ifNoConnection();
  }

  async triggerAlert(component, data, className?) {
    if (!component) {
      return false;
    }
    if (this.modal.length) {
      return false;
    }
    this.modal.push(await this.modalController.create({
      component: component,
      cssClass: className ? className : '',
      componentProps: {
        modelDataHolder: data
      }
    }));
    return await this.modal[this.modal.length - 1].present();
  }

  closeTrigger() {
    this.modal.pop().dismiss();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      position: "top",
      color: "dark",
      duration: 3000
    });
    toast.present();
  }

  async presentToastwithTime(message) {
    const toast = await this.toastController.create({
      message: message,
      position: "top",
      color: "dark",
      showCloseButton: true,
      closeButtonText: 'confirme'
    });

    toast.present();
  }

  async presentActionSheet(header, buttonList) {
    const actionSheet = await this.actionSheetController.create({
      header: header,
      buttons: buttonList
    });
    await actionSheet.present();
  }

  unMaskCPF(cpf) {
    if (cpf) {
      return cpf.replace(/\D+/g, '');
    }
    return '';
  }

  updateLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeFromLocalStorage(key) {
    if (!key) {
      return false;
    }
    localStorage.removeItem(key);
  }

  getLocalStorageData(key) {
    if (!localStorage.getItem(key)) {
      return '';
    }
    let data = JSON.parse(localStorage.getItem(key));
    return data;
  }

  openConstelacao() {
    let paramData = {
      isConstelacao: true
    };
    //this.menuCtrl.toggle();
    let navigationExtras: NavigationExtras = {
      queryParams: paramData
    }
    this.navCtrl.navigateForward('/performance-page', navigationExtras);
  }

  scrollToTop() {
    let ionContent = document.querySelectorAll('ion-content');
    if (ionContent.length) {
      ionContent.forEach(element => {
        element.scrollToTop(500);
      });
    }
  }

  getNotification(eventKey) {
    let endpoint = this.dataCtrl.endPoints.notification;
    this.loaderCtrl.showLoader();

    this.ApiService.get(endpoint).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let notificationData = success;
      let notificationSuccessMessage = 'get_notification_success';
      if (notificationData && notificationData.code !== notificationSuccessMessage) {
        return false;
      }
      this.publishCustomEvent(eventKey, success.data);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });
  }

  analizeMission(list, updatedList) {
    return new Promise((resolve, reject) => {
      if (list) {
        let missionAvailableCount: number = 0;
        let completedCount: number = 0;
        let uniqueMission = [];
        list.forEach((element, index) => {

          if (element.mission_type == "type5" || element.mission_type == "type17") {
            let spliter = element.post_title.split(' ');
            list[index].post_title1 = spliter[0];
            list[index].post_title2 = spliter[1];
          }

          if (!updatedList.length) {
            if (element.start_date && moment(element.start_date).isAfter()) {
              list[index]['customStatus'] = 'mission-new';
            } else if (!element.completed && moment(element.expiry_date).isAfter()) {
              list[index]['customStatus'] = 'mission-new';
            } else if (moment(element.expiry_date).isBefore()) {
              list[index]['customStatus'] = 'mission-expired';
              // } expired status removed
            } else {
              list[index]['customStatus'] = 'mission-new';
            }
          } else {
            updatedList.forEach((subElement, subIndex) => {
              if (subElement.mission_id == element.ID) {
                try {
                  element.updatedListApproved = updatedList[subIndex].approved;
                  element.updatedListRejected = updatedList[subIndex].rejected;
                  element.updatedListExpired = updatedList[subIndex].expired;
                } catch (error) {
                  element.updatedListApproved = 'dataNotDound';
                  element.updatedListRejected = 'dataNotDound';
                  element.updatedListExpired = 'dataNotDound';
                }
                // title split removed

                list[index]['marked'] = true;
                if (!element.completed && moment(element.expiry_date).isAfter()) {
                  if (uniqueMission.indexOf(element.ID) === -1) {
                    uniqueMission.push(element.ID);
                    missionAvailableCount += 1;
                  }
                  list[index]['customStatus'] = 'mission-pending';
                } else if (element.start_date && moment(element.start_date).isAfter()) {
                  list[index]['customStatus'] = 'mission-new';
                  // } mission completed code removed
                  // mission closed and expired code removed
                } else if ((element.updatedListApproved == 0 || element.updatedListApproved == 1) && moment(element.expiry_date).isBefore()) {
                  list[index]['customStatus'] = 'mission-expired';
                }
              } else {
                if (element['dashboard_mission_status']) {
                  list[index]['customStatus'] = element['dashboard_mission_status'];
                } else if (list[index]['marked']) {

                } else {
                  // title split code removed
                  if (element.start_date && moment(element.start_date).isAfter()) {
                    list[index]['customStatus'] = 'mission-new';
                  } else if (!element.completed && moment(element.expiry_date).isAfter()) {
                    list[index]['customStatus'] = 'mission-new';
                    // mission closed and expired code removed
                  } else if (moment(element.expiry_date).isBefore()) {
                    list[index]['customStatus'] = 'mission-expired';
                  } else {
                    list[index]['customStatus'] = 'mission-new';
                  }
                }
              }
            });
          }
        });
        let data = {
          'missionAvailableCount': missionAvailableCount,
          'completedMissionCount': completedCount,
          'list': list,
        };
        resolve(data);
      } else {
        reject('');
      }

    });
  }

  getUserDetailsServer(eventKey) {
    let endpoint = this.dataCtrl.endPoints.setting;
    this.loaderCtrl.stopLoader();
    this.loaderCtrl.showLoader();
    this.ApiService.get(endpoint).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let UserDetailsData = success;

      if (UserDetailsData.data.Clube_de_Vendas)
        this.updateLocalStorage('Clube_de_Vendas', UserDetailsData.data.Clube_de_Vendas);

      if (UserDetailsData.data.Clube_de_Retiradas)
        this.updateLocalStorage('Clube_de_Retiradas', UserDetailsData.data.Clube_de_Retiradas);
      let UserDetailsSuccessMessage = 'get_current_user_all_details_success';
      if (UserDetailsData && UserDetailsData.code == 'expire_password_error' && !this.ApiService.baseUrl.includes('dev')) {
        this.navCtrl.navigateRoot('/register-page/profile-resetPassword');
      } else if (UserDetailsData && UserDetailsData.code !== UserDetailsSuccessMessage) {
        return false;
      }
      try {
        if (success.data.sky) {

        } else {
          success.data.sky = success.data.meta;
        }
        let metaData = success.data.sky;
        let userData = success.data.user.data;
        let conversionFactor = success.data.converion_factor;
        let points = success.data.points_details;
        let pointExpire = success.data.points_expire;
        let cpf = metaData.username ? metaData.username : metaData.CPF;
        if (!cpf) {
          cpf = userData.user_login;
        }

        if (metaData.accept_regulation == 0) {
          this.triggerRegulamento();
        } else {
          this.updateLocalStorage('isForcedRegulamento', false);
        }
        this.updateLocalStorage('is_desconto_visible', success.data.is_desconto_visible);
        this.updateLocalStorage('produtos_sky_category_visiblility', success.data.produtos_sky_category_visiblility);
        this.updateLocalStorage('newsCategory', success.data.news_category_settings)
        this.updateLocalStorage('trainingCategory', success.data.treinamento_category_settings)

        if (success.data.home_banner_settings.length) {
          this.updateLocalStorage('home_banner_settings', success.data.home_banner_settings);
        } else {
          this.updateLocalStorage('home_banner_settings', []);
        }
        let userRole = success.data.user.roles;
        userRole[0] = userRole[0] == 'resgate' ? 'inativo' : userRole[0];
        let userRoleMap = this.dataCtrl.userRoles;
        let regulamentoLink = success.data.regulamento_file ? success.data.regulamento_file : '';
        let clubeStarLink = success.data.Estrelas_do_Clube ? success.data.Estrelas_do_Clube : '';
        let foto = success.data.meta.foto ? success.data.meta.foto : '';
        let isAppRated = success.data.meta.is_app_reviewed;
        if (isAppRated == undefined || isAppRated == '0') {
          this.triggerAppAvaliation();
        }
        let enablePopupContas = success.data.e_popup_pgcontas ? success.data.e_popup_pgcontas : '';
        let descriptionPopupContas = success.data.desc_popup_pgcontas ? success.data.desc_popup_pgcontas : '';
        let is_resgate = success.data.tags.perfil == 'resgate' ? true : false;
        let mapedRole = [];
        if (userRole.length) {
          userRole.forEach(role => {
            if (userRoleMap[role]) {
              mapedRole.push(userRoleMap[role]);
            }
          });
        } else {
          for (const key in userRole) {
            if (Object.prototype.hasOwnProperty.call(userRole, key)) {
              const element = userRole[key];
              if (userRoleMap[element]) {
                mapedRole.push(userRoleMap[element]);
              }
            }
          }
        }
        success.data.user.roles = mapedRole.length == 0 ? mapedRole.push(metaData.Perfil) : mapedRole;
        success.data.userInfo = userData;
        success.data.CPF = cpf;

        this.updateLocalStorage('usermeta', metaData);
        this.updateLocalStorage('userInfo', userData);
        mapedRole.length ? this.updateLocalStorage('userRole', mapedRole) : this.updateLocalStorage('userRole', userRole[0]);
        this.updateLocalStorage('conversionFactor', conversionFactor);
        this.updateLocalStorage('points', points);
        this.updateLocalStorage('pointExpire', pointExpire);
        this.updateLocalStorage('regulamentoLink', regulamentoLink);
        this.updateLocalStorage('clubeStarLink', clubeStarLink);
        this.updateLocalStorage('cpf', cpf);
        this.updateLocalStorage('foto', foto);
        this.updateLocalStorage('enablePopup', enablePopupContas);
        this.updateLocalStorage('descriptionPopup', descriptionPopupContas);
        this.updateLocalStorage('isResgate', is_resgate);
        this.publishCustomEvent(eventKey, success.data);
        let userDataSideMenu = {
          'foto': foto,
          'role': mapedRole
        };
        this.publishCustomEvent('avatar:get', userDataSideMenu);
        this.publishCustomEvent('updateProfilePic', userDataSideMenu);

      } catch (error) {
        console.warn(error)
      }
      return success.data;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      localStorage.clear();
      this.navCtrl.navigateRoot('login-page');
      this.presentToast("Sua sessão expirou, por favor, faça o login novamente.");
      console.log(endpoint, error);
    });
  }

  triggerAppAvaliation() {
    let isRatingPopupAllowed = this.getLocalStorageData('isUserRating');
    if (isRatingPopupAllowed) {
      return false;
    }

    this.events.publish('trigger-app-rating');
    return false;
    if (this.platform.is('cordova')) {
      const appRate: any = window['AppRate'];
      if (!appRate) {
        setTimeout(() => {
          this.triggerAppAvaliation();
        }, 300);
        return false;
      }
      const preferences = appRate.getPreferences();
      preferences.displayAppName = 'Meu Clube';
      preferences.openStoreInApp = false;
      preferences.inAppReview = true;
      preferences.simpleMode = true;
      preferences.useLanguage = 'pt-BR';
      preferences.usesUntilPrompt = 2;
      preferences.customLocale = this.dataCtrl.appRatingInfo;
      preferences.callbacks = {
        onButtonClicked: (buttonIndex) => {
          if (buttonIndex == 3) {
            localStorage.setItem('isUserRating', 'true');
            this.triggerRatingApi();
          } else if (buttonIndex == 2) {
            localStorage.setItem('isUserRating', 'true');
            localStorage.setItem('triggerUserRatingOnLogin', 'true');
          } else {
            localStorage.setItem('isUserRating', 'true');
          }
        },
      };
      preferences.reviewType = {
        ios: 'AppStoreReview',
        android: 'InAppBrowser'
      };
      preferences.storeAppURL = {
        ios: 'pt.scit.clubesky',
        android: 'market://details?id=pt.scit.clubesky',
      };
      appRate.setPreferences(preferences);
      appRate.promptForRating(true);
    }
  }

  triggerRegulamento() {
    this.updateLocalStorage('isForcedRegulamento', true);
    this.navCtrl.navigateRoot('/regulamento-page');
  }

  triggerRatingApi() {
    let endpoint = this.dataCtrl.endPoints.apiRating;
    let data = {
      'is_app_reviewed': true
    };
    this.ApiService.postWithPlugin(endpoint, data).then((success: any) => {
    }, (errorResponse) => {
    });
  }

  publishCustomEvent(eventKey, data?) {
    this.events.publish(eventKey, data ? data : '');
  }

  intimateOneSignal(userData) {
    if (!this.platform.is("cordova")) {
      return false;
    }

    // for Dev version
    this.oneSignal.startInit('49545085-8545-4bd1-a852-b28bcbeb74e4');

    // for Prod version
    // this.oneSignal.startInit('49545085-8545-4bd1-a852-b28bcbeb74e4');

    this.oneSignal.setSubscription(true);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
    this.oneSignal.sendTags(userData);

    this.oneSignal.getIds().then((id) => {
      if (id) {
        let endpoint = this.dataCtrl.endPoints.playerId;
        let data = {
          playerid: id.userId
        };
        this.ApiService.put(endpoint, data).subscribe((success: any) => {

        }, (error) => {
          console.log(endpoint, error);
        });
      }
    });
    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });

    this.oneSignal.endInit();
  }

  ifNoConnection() {
    let disconnectSubscription = this.networkChecker.onDisconnect().subscribe(() => {
      disconnectSubscription.unsubscribe();
      this.navCtrl.navigateRoot('/login-page');
      this.ifConnectionAvailable();
      console.log('network was disconnected :-(');
      this.presentToast('Nenhuma Internet disponível!!!');
    });
  }

  ifConnectionAvailable() {
    let connectSubscription = this.networkChecker.onConnect().subscribe(() => {
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.networkChecker.type) {
          connectSubscription.unsubscribe();
          this.ifNoConnection();
          this.presentToast('Conectado à internet.');
        }
      }, 3000);
    });
  }

  ptBrNumberFormat(number, isDecimal) {
    if (isDecimal)
      return parseFloat(number).toLocaleString('pt-br', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    else
      return Number(number).toLocaleString('pt-br', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
  }

  randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getParsedString(str) {
    if (!str) {
      return str;
    }
    var rx = /([\uD800-\uDBFF][\uDC00-\uDFFF](?:[\u200D\uFE0F][\uD800-\uDBFF][\uDC00-\uDFFF]){2,}|\uD83D\uDC69(?:\u200D(?:(?:\uD83D\uDC69\u200D)?\uD83D\uDC67|(?:\uD83D\uDC69\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\uFE0F|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC6F\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3C-\uDD3E\uDDD6-\uDDDF])\u200D[\u2640\u2642]\uFE0F|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F\u200D[\u2640\u2642]|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642])\uFE0F|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC69\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708]))\uFE0F|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83D\uDC69\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\u200D(?:(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F)/;
    var res = str.split(rx).filter(Boolean);

    var parsedString = "";

    res.forEach(function (word) {
      if (word.match(rx)) {
        parsedString = parsedString + "&#" + word.codePointAt() + ";";
      } else {
        parsedString = parsedString + word;
      }
    });
    return parsedString;
  }

  async presentAlertConfirm(alertHeader, alertMessage, cancelFunction, acceptFunction, scope) {
    const alert = await this.alertController.create({
      header: alertHeader,
      message: alertMessage,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            cancelFunction(scope);
          }
        }, {
          text: 'Okay',
          handler: () => {
            acceptFunction(scope);
          }
        }
      ]
    });
    await alert.present();
  }

  imageConverter(attachment) {
    var arr = attachment.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'image/' + mime, { type: mime });
  }

  openAppRating() {
    let link;

    if (!this.platform.is("cordova")) {
      return false;
    }

    if (this.platform.is('ios')) {
      link = 'itms-apps://itunes.apple.com/app/apple-store/id1499989047';
    } else if (this.platform.is('android')) {
      link = 'market://details?id=pt.scit.clubesky';
    } else {
      return false;
    }
    this.openLink(link);
  }

  openLink(url, type?) {
    let options: InAppBrowserOptions = {
      'location': 'yes',
      'fullscreen': 'yes',
      'hideurlbar': 'yes'
    };
    if (!url) {
      return false;
    }
    const browser = this.iab.create(url, type ? type : '_system', options);
  }

  getCheckSum(slice) {
    var validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVYWXZ_";
    slice.toUpperCase().trim();
    var sum = 0;
    for (var i = 0; i < slice.length; i++) {
      var ch = slice.charAt(slice.length - i - 1);
      if (validChars.indexOf(ch) < 0) {
        return "0";
      }
      var digit = ch.charCodeAt(0) - 48;
      var weight;
      if (i % 2 == 0) {
        weight = (2 * digit) - parseInt((digit / 5).toString()) * 9;
      }
      else {
        weight = digit;
      }
      sum += weight;
    }
    sum = Math.abs(sum) + 10;
    var checkSum = (10 - (sum % 10)) % 10;
    return checkSum.toString();
  }

  generateOtp(type, triggerPopUp) {
    let endpoint;
    if (type == 'checkout') {
      endpoint = this.dataCtrl.endPoints.getOtpCheckout;
    } else {
      endpoint = this.dataCtrl.endPoints.getOtpProfile;
    }

    let data = {
      cpf: this.getLocalStorageData('cpf'),
      type: 'email'
    }

    this.loaderCtrl.showLoader();
    this.ApiService.post(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (!success || !success.code.includes('success')) {
        this.presentToast(success.message);
        return false;
      }
      this.presentToast(success.message);
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });

    if (triggerPopUp) {
      let alertData = {
        isSuccess: 'otp-popup',
        key: type,
        message: 'Ei! Acabamos de enviar um código para seu e-mail e número de telefone, você precisará dele para concluir seu pedido . Pode ir que a gente te espera aqui, mas só é válido por 10 minutos, tá?!'
      }
      this.triggerAlert(triggerPopUp, alertData, 'otp-popup');
    }
  }
}