import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { MenuController, NavController, Events } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { DataHolderService } from '../../services/dataHolder/data-holder.service';
import { ApiHelperService } from '../../services/apiHelper/api-helper.service';
import { LoaderService } from '../../services/loader/loader.service';
import { FormControlService } from '../../services/formControl/form-control.service';
import { ImageProcessorService } from '../../services/imageProcessor/image-processor.service';

import { AlertPopupComponent } from '../../components/alert-popup/alert-popup.component';
import { ControlPanelService } from '../../services/controlPanel/control-panel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.page.html',
  styleUrls: ['./register-page.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPagePage implements OnInit {
  errorClass = 'error'; cameraheader = "Escolha uma imagem"; regulamentoTheory = '';
  defaultProdileSRC = '../../../assets/images/common/default-user-image.png';
  profileSRC = this.defaultProdileSRC;

  registerPageStepOneForm; registerPageStepTwoForm; imageFile;
  profilePageStepThreeForm; registerPageStepThreeForm; checker;
  formSteps = [
    {
      id: 1,
      title: '1 Info',
      enabled: true,
      className: 'active'
    },
    {
      id: 2,
      title: '2 Endereço',
      enabled: false,
      className: ''
    },
    {
      id: 3,
      title: '3 Senha',
      enabled: false,
      className: ''
    }
  ];

  isInfoView: Boolean = true; pageOneFlag: Boolean = true;
  pageTwoFlag: Boolean = false; acceptRegulamento: Boolean = false; hideHeader: Boolean = false;
  pageThreeFlag: Boolean = false; pageFourFlag: Boolean = false; isProfilePage: Boolean = false;
  toResetPassword = false; firstInstance = false; showSuccessView: Boolean = false; isDeeplink: Boolean = false;
  successMessage;
  stateList = [];
  hidePassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  hideRegPassword = true;
  hideRegConfirmPassword = true;
  userData = {
    cpf: "",
    ID: "",
    name: "",
    emailid: "",
    telefone: "",
    password: '',
    confirmPassword: '',
    newpassword: '',
  };
  cepDetails = {
    cidade: "",
    bairro: "",
    rua: "",
    estado: "",
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
        console.log('Share clicked');
      }
    },
  ];

  constructor(
    public menuCtrl: MenuController,
    public route: ActivatedRoute,
    private navCtrl: NavController,
    public dataProvider: DataHolderService,
    private apiCtrl: ApiHelperService,
    public loaderCtrl: LoaderService,
    private formCtrl: FormControlService,
    private controlPanelService: ControlPanelService,
    private camera: Camera,
    private imageprocessor: ImageProcessorService,
    private changeDetection: ChangeDetectorRef,
    private events: Events,
    private ngZone: NgZone,

  ) {
    this.checker = setInterval(() => {
      this.changeDetection.detectChanges();
      this.changeDetection.detach();
    }, 500);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      if (params && params.params) {
        if (params.params.isProfile == 'profile-resetPassword') {
          this.isProfilePage = true;
          this.toResetPassword = true;
          this.getUserDetails();
          let avatar = this.controlPanelService.getLocalStorageData('foto');
          if (avatar) {
            this.profileSRC = avatar;
          }
        } else if (params.params.isProfile == 'profile') {
          this.isProfilePage = true;
          this.getUserDetails();
          let avatar = this.controlPanelService.getLocalStorageData('foto');
          if (avatar) {
            this.profileSRC = avatar;
          }
        } else if (params.params.isProfile) {
          this.pageTwoFlag = false;
          this.isProfilePage = false;
          this.isDeeplink = true;
          this.getUserDetailsByID(params.params.isProfile);
          this.formSteps = [...this.formSteps, { id: 4, title: '4 Reg', enabled: false, className: '' }]
        } else {
          this.getRegulamentoText('');
          this.isProfilePage = false;
          this.formSteps = [...this.formSteps, { id: 4, title: '4 Reg', enabled: false, className: '' }]
          this.registerPageStepOneForm = this.formCtrl.registerPageStepOneForm('');
          this.registerPageStepTwoForm = this.formCtrl.registerPageStepTwoForm('');
          this.registerPageStepThreeForm = this.formCtrl.registerPageStepThreeForm();
        }
      }
    });
    this.eventHandler();
    this.getStatelist();
    // this.regulamentoTheory = this.dataProvider.regulamentoTheory;
  }

  getStatelist() {
    let state = this.dataProvider.state;
    let keys = Object.keys(state);
    keys.forEach(element => {
      let data: any = {};
      data.key = element;
      data.text = state[element];
      this.stateList.push(data);
    });
  }


  ngOnDestroy() {
    this.events.unsubscribe('profile-doubleCheckPassword');
  }

  eventHandler() {
    this.events.subscribe('profile-doubleCheckPassword', (otp) => {
      this.profileStepThreeValidationFunction(otp);
    });
  }

  getRegulamentoText(role) {
    let endpoint = this.dataProvider.endPoints.regulamento;
    let data: any = '';
    if (role) {
      data = {
        'perfil': role
      };
    }
    // this.loaderCtrl.showLoader();
    this.apiCtrl.get(endpoint, data).subscribe((success: any) => {
      // this.loaderCtrl.stopLoader();
      if (!success) {
        this.navCtrl.navigateRoot('/login-page');
        return false;
      }
      this.regulamentoTheory = success;
    }, (error) => {
      // this.loaderCtrl.stopLoader();
      console.log("getUserDetails error ", error);
      this.navCtrl.navigateRoot('/login-page');
    });
  }

  getUserDetails() {
    this.controlPanelService.getUserDetailsServer('userDetail:profile');
    this.initilizeGetUserEvent();
  }

  initilizeGetUserEvent() {
    this.events.subscribe('userDetail:profile', (userData) => {
      console.log(userData);
      this.registerPageStepOneForm = this.formCtrl.registerPageStepOneForm(userData.sky);
      this.registerPageStepTwoForm = this.formCtrl.registerPageStepTwoForm(userData.sky);
      this.registerPageStepTwoForm.controls.estado.value = this.dataProvider.stateReversed[userData.sky.estado] ? this.dataProvider.stateReversed[userData.sky.estado] : userData.sky.estado
      console.log(this.registerPageStepTwoForm.controls.estado.value)
      this.profilePageStepThreeForm = this.formCtrl.profilePageStepThreeForm();
      this.cepDetails.cidade = userData.sky.cidade;
      this.cepDetails.bairro = userData.sky.bairro;
      this.cepDetails.rua = userData.sky.rua;
      this.cepDetails.estado = this.dataProvider.stateReversed[userData.sky.estado] ? this.dataProvider.stateReversed[userData.sky.estado] : userData.sky.estado;
      if (this.toResetPassword && !this.firstInstance) {
        this.firstInstance = true;
        this.profilePageStepThreeForm = this.formCtrl.profilePageStepThreeForm(true);
        this.menuCtrl.enable(false);
        let alertData = {
          isSuccess: 'empty',
          message: 'Atualize sua senha.',
        };
        this.triggerAlert(alertData, 'small-alert');
        this.togglePageTo(3);
      }
    });
  }

  getUserDetailsByID(userId) {
    let endpoint = this.dataProvider.endPoints.accessPageStep1;
    let data = {
      'uid': userId
    };
    this.loaderCtrl.showLoader();
    this.apiCtrl.get(endpoint, data).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      if (success.code !== "validate_sky_users_success") {
        let alertData = {
          isSuccess: 'empty',
          message: 'Usuário já cadastrado',
        };
        this.triggerAlert(alertData, 'small-alert');
        this.navCtrl.navigateRoot('/login-page');
        return false;
      }
      let userData = success.data;
      this.registerPageStepOneForm = this.formCtrl.registerByDeepLinkStepOneForm(userData);
      this.registerPageStepTwoForm = this.formCtrl.registerByDeepLinkStepTwoForm(userData);
      this.cepDetails.cidade = userData.cidade;
      this.cepDetails.bairro = userData.bairro;
      this.cepDetails.rua = userData.rua;
      this.cepDetails.estado = this.dataProvider.stateReversed[userData.estado] ? this.dataProvider.stateReversed[userData.estado] : userData.estado;
      this.registerPageStepThreeForm = this.formCtrl.registerPageStepThreeForm();
      this.getRegulamentoText(userData.Perfil);
      // this.changeDetection.detectChanges();
      // this.changeDetection.detach();
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log("getUserDetails error ", error);
      this.navCtrl.navigateRoot('/login-page');
    });
  }

  toPreviousForm() {

  }

  openCameraAction() {
    this.controlPanelService.presentActionSheet(this.cameraheader, this.cameraActionList);
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
      this.ngZone.run(() => {
        this.profileSRC = 'data:image/jpeg;base64,' + imageData;
      });
      this.imageprocessor.getImageFile(imageData).then(data => {
        this.loaderCtrl.stopLoader();
        setTimeout(() => {
          this.imageFile = data;
          console.log(data);
          this.loaderCtrl.stopLoader();
        }, 1000);
      }, error => {
        this.loaderCtrl.stopLoader();
        this.imageFile = '';
        this.profileSRC = this.defaultProdileSRC;
        // this.changeDetection.detectChanges();
        // this.changeDetection.detach();
        console.log(error);
      })
    }, (err) => {
      this.loaderCtrl.stopLoader();
      this.imageFile = '';
      this.profileSRC = this.defaultProdileSRC;
      // this.changeDetection.detectChanges();
      // this.changeDetection.detach();
      console.log(err);
    });
  }

  stepOneValidationFunction() {
    this.changeView(2);
    this.togglePageTo(2);
  }

  stepTwoValidationFunction() {
    this.changeView(3);
    this.togglePageTo(3);
  }

  stepThreeValidationFunction() {
    console.log(this.registerPageStepThreeForm);
    this.changeView(4);
    this.togglePageTo(4);
  }

  stepFourValidationFunction() {
    let userData = {};
    let defaultValues = {
      'origin': 'cadastro-app'
    };
    let endpoint = this.dataProvider.endPoints.registerUser;
    this.registerPageStepOneForm.value.username = this.registerPageStepOneForm.value.username.replace(/\D+/g, '');
    let firstformData = this.registerPageStepOneForm.value;
    let secondformData = this.registerPageStepTwoForm.value;
    let thirdformData = this.registerPageStepThreeForm.value;
    firstformData.data_de_nascimento = moment(firstformData.data_de_nascimento).format('YYYY-MM-DD');
    thirdformData.password = thirdformData.newpassword;
    if (!this.isProfilePage) {
      firstformData["accept_regulamento"] = "on";
    }
    Object.assign(userData, firstformData);
    Object.assign(userData, secondformData);
    Object.assign(userData, thirdformData);
    Object.assign(userData, defaultValues);
    let imageData = {
      'foto': this.imageFile ? this.imageFile : '',
    };
    Object.assign(userData, imageData);

    this.submitForm(endpoint, userData);
  }

  profileStepThreeValidationFunction(otp?) {
    let userData = {};
    let endpoint = this.dataProvider.endPoints.updateUser;
    let firstformData = this.registerPageStepOneForm.value;
    let secondformData = this.registerPageStepTwoForm.value;
    let thirdformData = this.profilePageStepThreeForm.value;
    Object.assign(userData, firstformData);
    Object.assign(userData, secondformData);
    let imageData = {
      'foto': this.imageFile ? this.imageFile : '',
    };
    Object.assign(userData, imageData);
    firstformData.data_de_nascimento = moment(firstformData.data_de_nascimento).format('YYYY-MM-DD');
    firstformData.username = firstformData.username.replace(/\D+/g, '');


    var formData: any = new FormData();
    if (this.imageFile) {
      formData.append("foto", this.imageFile ? this.imageFile : '', this.imageFile ? this.controlPanelService.randomString(10) + '.jpeg' : '');
    }
    formData.append("nome_completo", firstformData.nome_completo);
    formData.append("username", firstformData.username);
    formData.append("email", firstformData.email);
    formData.append("data_de_nascimento", firstformData.data_de_nascimento);
    // formData.append("id", firstformData.id);
    formData.append("telefone", firstformData.telefone);
    // formData.append("tamanho_da_camisa", firstformData.tamanho_da_camisa);
    // formData.append("tamanho_da_calca", firstformData.tamanho_da_calca);
    // formData.append("tamanho_da_sapato", firstformData.tamanho_da_sapato);
    formData.append("genero", firstformData.genero);
    if (!this.isProfilePage) {
      formData.append("accept_regulamento", "on");
    }

    formData.append("cep", secondformData.cep);
    formData.append("rua", secondformData.rua);
    formData.append("numero", secondformData.numero);
    formData.append("complemento", secondformData.complemento);
    formData.append("bairro", secondformData.bairro);
    formData.append("cidade", secondformData.cidade);
    formData.append("estado", this.dataProvider.stateReversed[secondformData.estado] ? this.dataProvider.stateReversed[secondformData.estado] : secondformData.estado);
    formData.append("ponto_de_referencia", secondformData.ponto_de_referencia);

    if (otp) {
      formData.append("otp", otp);
    }
    if (thirdformData.password && thirdformData.newpassword && thirdformData.confirmPassword) {
      if (this.profilePageStepThreeForm.valid) {
        if (this.toResetPassword) {
          formData.append("monthly_password_update", true);
          formData.append("password", thirdformData.newpassword);
        } else {
          formData.append("password", thirdformData.password);
          formData.append("newpassword", thirdformData.newpassword);
          formData.append("confirmPassword", thirdformData.confirmPassword);
        }
        this.submitForm(endpoint, formData);
      }
    } else if (thirdformData.password || thirdformData.newpassword || thirdformData.confirmPassword) {
      this.submitForm(endpoint, formData);
    } else {
      if (this.profilePageStepThreeForm.valid) {
        this.submitForm(endpoint, formData);
      }
    }
  }

  getLocationDetail() {
    let cep = this.registerPageStepTwoForm.controls.cep.value;
    this.loaderCtrl.showLoader();
    this.apiCtrl.getCepDetail(cep).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let data = success;
      this.cepDetails.cidade = data.localidade;
      this.cepDetails.bairro = data.bairro;
      this.cepDetails.rua = data.logradouro;
      this.cepDetails.estado = data.uf;
    }, (error) => {
      this.loaderCtrl.stopLoader();
      this.cepDetails = {
        cidade: "",
        bairro: "",
        rua: "",
        estado: "",
      };
      console.log("getLocationDetail error ", error);
    });
  }

  toBack() {
    if (this.isProfilePage) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.navigateRoot('login-page');
    }
  }

  naviagateTo() {
    if (this.isProfilePage) {
      this.navCtrl.navigateRoot('/dash-board');
      return false;
    }
    this.navCtrl.navigateRoot('/login-page');
  }

  submitForm(endpoint, userData) {
    this.loaderCtrl.showLoader();
    this.apiCtrl.post(endpoint, userData).subscribe((success: any) => {
      this.loaderCtrl.stopLoader();
      let successMessage = ['profile_update_success', 'sky_register_new_user_success'];
      if (success && !successMessage.includes(success.code)) {
        let alertData = {
          isSuccess: 'empty',
          message: success.message,
        };
        this.triggerAlert(alertData, 'small-alert');
        return false;
      }
      this.showSuccessView = true;
      this.changeView('')
      this.successMessage = success.message;
      this.controlPanelService.updateLocalStorage('x-auth-sb', success.data.token);
      if (this.isProfilePage) {
        this.controlPanelService.getUserDetailsServer('updateProfilePic-trigger')
      }
    }, (error) => {
      this.loaderCtrl.stopLoader();
      console.log(endpoint, error);
    });
  }

  toCheck() {
    if (!this.isProfilePage) {
      this.stepFourValidationFunction();
    }
  }

  togglePageTo(formCount) {
    if (formCount == 1) {
      this.pageOneFlag = true;
      this.pageTwoFlag = false;
      this.pageThreeFlag = false;
      this.pageFourFlag = false;
    } else if (formCount == 2) {
      this.pageOneFlag = false;
      this.pageTwoFlag = true;
      this.pageThreeFlag = false;
      this.pageFourFlag = false;
      this.formSteps[1].enabled = true;
    } else if (formCount == 3) {
      this.pageOneFlag = false;
      this.pageTwoFlag = false;
      this.pageThreeFlag = true;
      this.pageFourFlag = false;
      this.formSteps[2].enabled = true;
    } else if (formCount == 4) {
      this.pageOneFlag = false;
      this.pageTwoFlag = false;
      this.pageThreeFlag = false;
      this.pageFourFlag = true;
      this.formSteps[3].enabled = true;
    } else {

    }
    this.controlPanelService.scrollToTop();
    // this.changeDetection.detectChanges();
    // this.changeDetection.detach();
  }

  onScroll(event) {
    if (event.detail.scrollTop > 30) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  triggerAlert(alertData, className?) {
    if (className) {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData, className);
    } else {
      this.controlPanelService.triggerAlert(AlertPopupComponent, alertData);
    }
  }

  domChange() {
    // this.changeDetection.detectChanges();
    // this.changeDetection.detach();
  }

  ionViewWillLeave() {
    this.changeDetection.reattach();
    clearInterval(this.checker);
  }

  openLGPD() {
    let alertData = {
      isSuccess: 'LGPDPopup',
    };
    this.triggerAlert(alertData);
  }

  generateOtp() {
    if (this.isProfilePage) {
      let formData = this.registerPageStepOneForm.value;
      let userData = this.controlPanelService.getLocalStorageData("usermeta");
      let passwordFormData = this.profilePageStepThreeForm.value;
      let oldInfo = {
        email: userData.email,
        telefone: userData.celular ? userData.celular : userData.telefone
      };

      if ((oldInfo.email !== formData.email) || (oldInfo.telefone !== formData.telefone)) {
        this.controlPanelService.generateOtp('profile', AlertPopupComponent);
      } else if (this.profilePageStepThreeForm.valid && passwordFormData.newpassword) {
        this.controlPanelService.generateOtp('profile', AlertPopupComponent);
      } else {
        this.profileStepThreeValidationFunction();
      }
    } else {
      this.profileStepThreeValidationFunction();
    }
  }

  changeView(formStepId) {
    this.formSteps.forEach(step => {
      if (this.showSuccessView) {
        step.className = ''
        return false;
      }
      if (step.id == formStepId) {
        step.className = 'active'
      } else {
        step.className = ''
      }
    })
    this.togglePageTo(formStepId)
  }

}
