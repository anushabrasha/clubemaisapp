import { Component, OnInit } from '@angular/core';
import { MenuController, Events } from '@ionic/angular';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import { LoaderService } from '../../services/loader/loader.service';
import { NavController } from '@ionic/angular';
import { DataHolderService } from 'src/app/services/dataHolder/data-holder.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.page.html',
  styleUrls: ['./dash-board.page.scss'],
})
export class DashBoardPage implements OnInit {
  hideHeader: Boolean = false;
  alertData = {
    isSuccess: true,
    message: 'This is a sample data.',
  };
  isProparetario = false;
  isDistribuidor = false;
  defaultAvatar = 'assets/images/common/default-user-image.png';
  userData = {
    'userName': '',
    'userPoints': '',
    'userExpirePoint': '',
    'userRole': [],
    'userFoto': '',
  }
  menuList = [];
  principalRoleList = this.dataHolder.principalRoleList;
  gerenteRoleList = this.dataHolder.gerenteRoleList;
  perfis_internos = [
    'SUPERVISOR SERVIÇOS SKY',
    'SUPERVISOR VENDAS SKY',
    'MATRIZ SKY',
    'GERENTE REGIONAL VENDAS SKY',
    'GERENTE REGIONAL SERVIÇOS SKY',
    'ASSISTENTE REGIONAL SKY',
    'GERENTE CANAL REMOTO SKY',
    'SUPERVISOR CANAL REMOTO SKY',
    'ASSISTENTE CANAL REMOTO SKY',
    'CONSULTOR SERVIÇOS SKY',
    'Retirador',
  ];
  perfilSky: boolean = false;
  perfil;

  userMenuList = [
    {
      title: 'TROQUE SEUS PONTOS',
      img: 'assets/images/icons/shop-yellow-icon.png',
      url: '/shop',
    },
    {
      title: 'DESAFIOS',
      img: 'assets/images/icons/target-yellow-icon.png',
      url: '/mission-page',
    },
    {
      title: 'FIQUE POR DENTRO',
      img: 'assets/images/icons/list-yellow-icon.png',
      url: '/news-page',
    },
    {
      title: 'TREINAMENTOS',
      img: 'assets/images/icons/cap-yellow-icon.png',
      url: '/training-page',
    },
  ];

  userGameMenuList = [
    {
      title: 'TROQUE SEUS PONTOS',
      img: 'assets/images/icons/shop-yellow-icon.png',
      url: '/shop',
    },
    {
      title: 'DESAFIOS+',
      img: 'assets/images/icons/target-yellow-icon.png',
      url: '/mission-page',
    },
    {
      title: 'Games',
      img: 'assets/images/icons/game-yellow-icon.png',
      url: '/game-mission-page',
    },
    {
      title: 'TREINAMENTOS',
      img: 'assets/images/icons/cap-yellow-icon.png',
      url: '/training-page',
    },
  ];


  showPerformance: boolean = true;
  showTimeline: boolean = false;
  showTimeLineTitle: boolean = false;
  homeBannerImages = [];

  constructor(
    public menuCtrl: MenuController,
    private controlPanelService: ControlPanelService,
    private loader: LoaderService,
    private events: Events,
    private navCtrl: NavController,
    private dataHolder: DataHolderService
  ) {
    // this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.controlPanelService.getNotification('notification:get');
  }

  ionViewDidEnter() {
    this.triggerGetUserDetails();
    this.subscribeUserAvatar();
    this.eventHandler();
  }

  eventHandler() {
    this.events.subscribe('trigger-app-rating', (userData) => {
      let alertData = {
        isSuccess: 'appRating'
      };
      // this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, 'small-alert');
    });
  }

  subscribeUserAvatar() {
    this.events.subscribe('userAvatar:update', (userData) => {
      this.triggerGetUserDetails();
    });
  }

  openConstelacao() {
    this.controlPanelService.openConstelacao();
  }

  triggerAlert(alertData) {
    this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, 'small-alert');
  }

  triggerGetUserDetails() {
    this.controlPanelService.getUserDetailsServer('userDetail:get');
    this.homeBannerImages = this.controlPanelService.getLocalStorageData('home_banner_settings');
    this.initilizeGetUserEvent();
  }

  initilizeGetUserEvent() {
    this.events.subscribe('userDetail:get', (userData) => {
      userData.user.roles.length == 0 ? userData.user.roles.push(userData.sky.Perfil) : userData.user.roles;
      let metaData = userData.meta;
      let userInfoData = userData.userInfo;
      let userPoints = userData.points_details;
      let userExpirepoint = userData.points_expire;
      this.userData.userName = metaData.Nome ? metaData.Nome : userInfoData.display_name;
      this.userData.userRole = userData.user.roles;
      let role = this.controlPanelService.getLocalStorageData('userRole');
      let isResgate = this.controlPanelService.getLocalStorageData('isResgate');
      if (!role.length) {
        this.controlPanelService.updateLocalStorage('userRole', this.userData.userRole);
        role = this.userData.userRole;
      }
      this.userData.userPoints = userPoints;
      this.userData.userExpirePoint = userExpirepoint;
      this.userData.userFoto = metaData.foto;

      if (this.perfis_internos.indexOf(role[0].toUpperCase()) > -1) {
        this.perfilSky = true;
        this.showPerformance = false;
        this.showTimeline = true;
      }
      this.checkMenuList(role);

      if (role[0] == 'inativo' && isResgate) {
        let alertData = {
          isSuccess: 'empty',
          message: "Seu login não está ativo, não permitindo acesso ao Clube SKY. Você terá acesso apenas para resgate dos seus pontos pelo prazo determinado no regulamento.",
        };
        this.triggerAlert(alertData);
      }
      let tagData: any = {
        'cpf': userData.CPF,
        'perfil': userData.user.roles[0],
      };
      if (userData.tags) {
        for (let tag in userData.tags) {
          tagData[tag] = userData.tags[tag];
        }
        delete tagData.CPF;
      }
      this.controlPanelService.intimateOneSignal(tagData);
    });
  }

  checkMenuList(userRole) {
    let userrole = userRole[0].toLowerCase();
    let isResgate = this.controlPanelService.getLocalStorageData('isResgate');
    // if (userrole.includes('games')) {
    //   this.menuList = this.userGameMenuList;
    //   // } 
    // } else {
    this.menuList = this.userMenuList;
    // }
  }

  ngOnDestroy() {
  }

  ionViewWillLeave() {
    this.events.unsubscribe('userDetail:get');
    this.events.unsubscribe('userAvatar:update');
    this.events.unsubscribe('trigger-app-rating');
  }

  callAFunction(page) {
    this[page.onClick](page);
  }

  openPage(menu) {
    if (menu.onClick) {
      this.callAFunction(menu);
      return false;
    }
    let allowedPages = ['/performance-page', '/game-mission-page', '/program-page', '/training-page', '/shop', '/mission-page', '/news-page', '/vantagens'];
    if (allowedPages.includes(menu.url)) {
      this.navCtrl.navigateForward(menu.url);
    } else {
      let alertData = {
        isSuccess: 'empty',
        message: 'Esta página estará disponível em breve.',
      };
      this.triggerAlert(alertData);
      return false;
    }
  }


  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  toggleView(token) {
    if (token == 'performance') {
      this.showPerformance = true;
      this.showTimeline = false;
      this.triggerGetUserDetails();
    } else {
      this.showPerformance = false;
      this.showTimeline = true;
    }
  }

  openBannerPage(banner) {
    if (!banner.link) {
      this.navCtrl.navigateRoot('/dash-board')
    } else {
      this.navCtrl.navigateRoot(banner.link)
    }
  }
}
