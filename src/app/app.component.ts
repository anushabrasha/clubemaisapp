import { Component } from '@angular/core';

import { Platform, MenuController, NavController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationStart } from '@angular/router';

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ControlPanelService } from './services/controlPanel/control-panel.service';
import { PdfViewerService } from './services/pdfViewer/pdf-viewer.service';

import { RegisterPagePage } from './pages/register-page/register-page.page';
import { ForgetPasswordPagePage } from './pages/forget-password-page/forget-password-page.page';
import { TrainingPagePage } from './pages/training-page/training-page.page';
import { ShopPage } from './pages/shop/shop.page';
import { NewsPagePage } from './pages/news-page/news-page.page';
import { NotificationPagePage } from './pages/notification-page/notification-page.page';
import { ContactPagePage } from './pages/contact-page/contact-page.page';
import { BadgesPage } from './pages/badges/badges.page';

import { ExtratoPagePage } from './pages/extrato-page/extrato-page.page';
import { VantagensPage } from './pages/vantagens/vantagens.page';
import { ProgramPagePage } from './pages/program-page/program-page.page';
import { OrderListPage } from './pages/order-list/order-list.page';
import { ContaPagePage } from './pages/conta-page/conta-page.page';
import { MissionPagePage } from './pages/mission-page/mission-page.page';
import { AlertPopupComponent } from './components/alert-popup/alert-popup.component';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoaderService } from './services/loader/loader.service';
import { ImageProcessorService } from './services/imageProcessor/image-processor.service';
import { DataHolderService } from './services/dataHolder/data-holder.service';
import { ApiHelperService } from './services/apiHelper/api-helper.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  defaultProdileSRC = 'assets/images/common/default-user-image.png';

  public appPages = this.dataHolder.defaultPages;
  public gameappPages = this.dataHolder.defaultGamePages;
  // user based pages removed
  public userPages = this.dataHolder.defaultUserPages;

  public errorAppPages = this.dataHolder.errorAppPages;
  public errorUserPages = this.dataHolder.errorAppPages;

  // properitero, distributor removed
  // default matrix, retirator page removed

  principalRoleList = this.dataHolder.principalRoleList;
  gerenteRoleList = this.dataHolder.gerenteRoleList;

  showSplashOne = true; showSplashTwo = true; showSplashThree = true; showSplash = true;
  isIosPlatform = false; showNameLabel = false;

  cameraheader = "Escolha uma imagem";
  userName = this.ctrlPanel.getLocalStorageData('userInfo').display_name;
  avatarURL = this.ctrlPanel.getLocalStorageData('foto');
  userNameLabel;

  avatarData: any = {
    userName: '',
    avatarURL: ''
  };
  cameraActionList = [
    {
      text: 'Câmera',
      handler: () => {
        this.cameraPluginAction('camera');
      }
    }, {
      text: 'Galeria',
      handler: () => {
        this.cameraPluginAction('file');
      }
    }, {
      text: 'Cancelar',
      role: 'destructive',
      handler: () => {
        // console.log('Share clicked');
      }
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public menuCtrl: MenuController,
    private events: Events,
    private navCtrl: NavController,
    private ctrlPanel: ControlPanelService,
    public loaderCtrl: LoaderService,
    private camera: Camera,
    private imageprocessor: ImageProcessorService,
    private dataHolder: DataHolderService,
    private apiCtrl: ApiHelperService,
    private deeplinks: Deeplinks,
    private ga: GoogleAnalytics,
    private pdfDownloader: PdfViewerService,
    private orientation: ScreenOrientation
  ) {
    this.initializeApp();
    this.pdfDownload();
    if (this.platform.is('ios')) {
      this.isIosPlatform = true
    }
  }

  openConstelacao() {
    this.ctrlPanel.openConstelacao();
  }

  pdfDownload() {
    document.onclick = (e) => {
      var event: any = e || window.event;
      var element = event.target || event.srcElement;
      e.preventDefault();
      var link;
      if (element['tagName'] == 'A' && element['href']) {
        link = element['href'];
      } else if (element.parentElement['tagName'] == 'A' && element.parentElement['href']) {
        link = element.parentElement['href'];
      } else {
        return false;
      }
      if (link.includes('wa.me')) {
        this.ctrlPanel.openLink(link);
      } else if (this.router.url.includes('mission-single')) {

      } else {
        this.pdfDownloader.downloadAndView(link);
      }
    };
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.enableDeepLink();
      if (this.platform.is('cordova')) {
        this.setscreenOrientation();
        this.splashScreen.hide();
        this.splashScreenLogic();
      } else {
        this.showSplash = false;
      }
      this.router.initialNavigation();
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false)
      this.statusBar.backgroundColorByHexString('#d00609');
      this.statusBar.styleBlackOpaque();
      this.eventListeners();
      this.apiCtrl.loadAppInfo();
      this.googleAnalytics();
    });
  }

  setscreenOrientation() {
    this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT);
  }

  googleAnalytics() {
    this.ga.startTrackerWithId('UA-35060993-7')
      .then(() => {
        //console.log('Google analytics is ready now');
        this.router.events.subscribe(event => {
          //observe router and when it start navigation it will track the view
          if (event instanceof NavigationStart) {
            let title = 'app';
            //get title if it was sent on state
            if (this.router.getCurrentNavigation().extras.state) {
              title = this.router.getCurrentNavigation().extras.state.title;
            }
            // console.log('track analytics', event.url, title);
            //pass url and page title 
            this.ga.trackView(event.url)
              .then(() => { console.log('call track') })
              .catch(e => console.log(e));
          }
        });
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  splashScreenLogic() {
    setTimeout(() => {
      this.showSplashOne = false;
    }, 3000);
    setTimeout(() => {
      this.showSplashTwo = false;
      this.showSplash = false;
    }, 4500);
  }

  closeSideMenu(event) {
    event.preventDefault();
    this.toggleMenu();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  openPage(page) {
    if (page.onClick) {
      this.callAFunction(page);
      this.menuCtrl.toggle();
      return false;
    }
    this.menuCtrl.toggle();
    if (page.url == '/dash-board') {
      this.navCtrl.navigateRoot(page.url);
    } else {
      this.navCtrl.navigateForward(page.url);
    }
  }

  openSubMenu(selected) {
    if (selected.onClick) {
      this.callAFunction(selected);
      return false;
    }
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.ctrlPanel.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.ctrlPanel.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  callAFunction(page) {
    this[page.onClick](page);
  }

  logOut(page) {
    localStorage.clear();
    this.navCtrl.navigateRoot(page.url);
  }

  eventListeners() {
    this.avatarEvent();
  }

  avatarEvent() {

    this.events.subscribe('avatar:get', (data) => {
      let isResgate = this.ctrlPanel.getLocalStorageData('isResgate');
      let userRole = this.ctrlPanel.getLocalStorageData('userRole')[0].toLowerCase();
      this.avatarData = {
        userName: '',
        avatarURL: ''
      };
      if (data) {
        this.avatarData.userName = this.ctrlPanel.getLocalStorageData('userInfo').display_name
        this.avatarData.avatarURL = this.ctrlPanel.getLocalStorageData('foto')

        // if (userRole.includes('games')) {
        // this.appPages = this.gameappPages;
        // }  else {
        this.appPages = this.appPages;
        // }

      } else {
        this.avatarURL = '';
        this.userPages = this.errorUserPages;
        this.appPages = this.errorAppPages;
      }
    });
  }

  toggleSubMenu(selected) {
    selected.subMenuView = !selected.subMenuView;
  }

  changeAvatar() {
    this.ctrlPanel.presentActionSheet(this.cameraheader, this.cameraActionList);
  }

  showAccountRemovePopup() {
    let message = 'Você quer mesmo remover sua conta?'
    let removeAccountButtonList = [
      {
        text: 'SIM',
        handler: () => {
          this.removeAccount();
        }
      }, {
        text: 'NÃO',
        handler: () => {
          console.log('cancel')
        }
      },
    ];
    this.ctrlPanel.presentActionSheet(message, removeAccountButtonList)
  }

  removeAccount() {
    let endpoint = this.dataHolder.endPoints.removeAccount;
    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endpoint, {}).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success && success.code === 'remove_my_account_success') {
        localStorage.clear();
        this.navCtrl.navigateRoot('/login-page');
        this.ctrlPanel.presentToast(success.message)
      }
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    })
  }

  cameraPluginAction(method) {
    console.log(method);
    let optionType = 'PHOTOLIBRARY';
    if (method == 'camera') {
      optionType = 'CAMERA';
    }
    const options: CameraOptions = {
      quality: 15,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType[optionType],
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.loaderCtrl.showLoader();
    this.camera.getPicture(options).then((imageData) => {
      this.avatarURL = 'data:image/jpeg;base64,' + imageData;
      this.imageprocessor.getImageFile(imageData).then(data => {
        setTimeout(() => {
          this.updateUser(data);
          this.loaderCtrl.stopLoader();
        }, 1000);
      }, error => {
        this.loaderCtrl.stopLoader();
        this.avatarURL = '';
        //console.log(error);
        this.menuCtrl.toggle();
      })
    }, (err) => {
      this.loaderCtrl.stopLoader();
      this.avatarURL = '';
      //console.log(err);
      this.menuCtrl.toggle();
    });
  }

  updateUser(image) {
    let endpoint = this.dataHolder.endPoints.updateUser;
    let skyData = this.ctrlPanel.getLocalStorageData('usermeta');
    var formData: any = new FormData();
    formData.append("foto", image);
    formData.append("profile_pic_update", true);

    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endpoint, formData).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let data = success;
      let profileSuccessMessage = 'profile_update_success';

      if (success && success.code !== profileSuccessMessage) {
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.triggerAlert(alertData, 'small-alert');
        this.avatarURL = '';
        return false;
      }
      this.menuCtrl.toggle();
      this.events.publish('userAvatar:update', '');
    }, (error) => {
      this.loaderCtrl.stopLoader();
      // console.log(endpoint, error);
      this.menuCtrl.toggle();
    });
  }

  enableDeepLink() {
    if (!this.platform.is("cordova")) {
      return false;
    }

    let routerOptions = {};
    if (this.platform.is('ios')) {
      routerOptions = {
        '/register': '/register',
        '/my-account/lost-password': '/my-account/lost-password',
        '/mission': '/mission',
        '/mission/': '/mission',
        '/aprenda': '/training-page',
        '/shop': '/shop',
        '/news': '/news',
        '/notification': '/notification-page',
        '/fale-conosco': '/contact-page',
        '/selos': '/badges',
        '/extrato': '/extrato-page',
        '/clube-de-vantagens': '/vantagens',
        '/o-programa': '/program-page',
        '/seus-pedidos': '/order-list',
        '/conta': '/conta-page'
      };
    } else {
      routerOptions = {
        '/register/': RegisterPagePage,
        '/my-account/lost-password/': ForgetPasswordPagePage,
        '/mission': MissionPagePage,
        '/mission/': MissionPagePage,
        '/aprenda': TrainingPagePage,
        '/shop': ShopPage,
        '/news': NewsPagePage,
        '/notification': NotificationPagePage,
        '/fale-conosco': ContactPagePage,
        '/selos': BadgesPage,
        '/extrato': ExtratoPagePage,
        '/clube-de-vantagens': VantagensPage,
        '/o-programa': ProgramPagePage,
        '/seus-pedidos': OrderListPage,
        '/conta': ContaPagePage
      };
    }


    this.deeplinks.route(routerOptions).subscribe(match => {

      // match.$route - the route we matched, which is the matched entry from the arguments to route()
      // match.$args - the args passed in the link
      // match.$link - the full link data
      if (match['$link']['path'].includes('register')) {
        let queryString = match['$args']['uid'];
        this.navCtrl.navigateRoot('/register-page/' + queryString);
      } else if (match['$link']['path'].includes('my-account/lost-password')) {
        let key = match['$args']['key'];
        let id = match['$args']['id'];
        let data = {
          'key': match['$args']['key'],
          'id': match['$args']['id']
        };
        let encrypted = JSON.stringify(data);
        this.navCtrl.navigateRoot('/forget-password-page/' + encrypted);
      } else if (match['$link']['queryString']?.includes('game=true')) {
        this.openDeeplinkPages('/game-mission-page');
      } else if (match['$link']['path'].includes('mission')) {
        this.openDeeplinkPages('/mission-page');
      } else if (match['$link']['path'].includes('aprenda')) {
        this.openDeeplinkPages('/training-page');
      } else if (match['$link']['path'].includes('shop')) {
        this.openDeeplinkPages('/shop');
      } else if (match['$link']['path'].includes('news')) {
        this.openDeeplinkPages('/news-page');
      } else if (match['$link']['path'].includes('notification')) {
        this.openDeeplinkPages('/notification-page')
      } else if (match['$link']['path'].includes('fale-conosco')) {
        this.openDeeplinkPages('/contact-page');
      } else if (match['$link']['path'].includes('selos')) {
        this.openDeeplinkPages('/selos');
      } else if (match['$link']['path'].includes('extrato')) {
        this.openDeeplinkPages('/extrato-page');
      } else if (match['$link']['path'].includes('clube-de-vantagens')) {
        this.openDeeplinkPages('/vantagens');
      } else if (match['$link']['path'].includes('o-programa')) {
        this.openDeeplinkPages('/program-page');
      } else if (match['$link']['path'].includes('seus-pedidos')) {
        this.openDeeplinkPages('/order-list');
      } else if (match['$link']['path'].includes('conta')) {
        this.openDeeplinkPages('/conta-page');
      } else {

      }
    }, nomatch => {
      // nomatch.$link - the full link data
      console.error('Got a deeplink that didn\'t match', nomatch);
    });
  }

  openDeeplinkPages(path) {
    let token = this.ctrlPanel.getLocalStorageData('x-auth-sb');
    if (!token) {
      this.navCtrl.navigateRoot('/login-page');
      this.ctrlPanel.presentToast('Por favor entre');
    } else {
      this.navCtrl.navigateRoot(path);
    }
  }

  openPolitica() {
    let url = this.dataHolder.urlHolder.politica;
    this.ctrlPanel.openLink(url);
  }

  openPDF(info) {
    let url = this.ctrlPanel.getLocalStorageData(info.key);
    if (!url) {
      let alertData = {
        isSuccess: 'empty',
        message: 'O documento não está disponível agora',
      };
      this.triggerAlert(alertData, 'small-alert');
      return false;
    }
    this.ctrlPanel.openLink(url);
  }

  downloadEstrelas() {
    let link = this.ctrlPanel.getLocalStorageData('clubeStarLink');
    if (!link) {
      return false;
    }
    this.pdfDownloader.downloadAndView(link);
  }
}
