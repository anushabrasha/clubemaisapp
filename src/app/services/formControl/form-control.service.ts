import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { setValidation } from '../validators/validators';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  constructor(
    private formBuilder: FormBuilder,

  ) { }

  accessPageStepOneForm(): FormGroup {
    return this.formBuilder.group({
      username: setValidation('', true, 'cpf'),
      email: setValidation('', true, 'email'),
    });
  }

  accessPageStepTwoForm(userData): FormGroup {
    return this.formBuilder.group({
      nome_completo: setValidation(userData ? userData.Nome : '', true, 'name'),
      email: setValidation(userData ? userData.email : '', true, 'email'),
      telefone: setValidation(userData ? userData.celular : '', false, 'phone'),
      emailAccess: setValidation(false, false, ''),
      phoneAccess: setValidation(false, false, ''),
    });
  }

  registerPageStepOneForm(userData): FormGroup {
    return this.formBuilder.group({
      nome_completo: setValidation(userData ? userData.Nome ? userData.Nome : userData.nome_completo : '', true, 'name'),
      username: setValidation(userData ? userData.CPF ? userData.CPF : userData.username : '', true, 'cpf'),
      email: setValidation(userData ? userData.email : '', false, 'email'),
      data_de_nascimento: setValidation(userData ? userData.data_nascimento ? userData.data_nascimento : userData.data_de_nascimento : '', true, ''),
      telefone: setValidation(userData ? userData.celular ? userData.celular : userData.telefone : '', true, 'phone'),
      genero: setValidation(userData ? userData.genero : '', false, ''),
    });
  }

  registerPageStepTwoForm(userData): FormGroup {
    return this.formBuilder.group({
      cep: setValidation(userData ? userData.cep ? userData.cep : userData.shipping_postcode : '', true, 'cep'),
      rua: setValidation(userData ? userData.rua : '', true, ''),
      numero: setValidation(userData ? userData.numero : '', false, ''),
      complemento: setValidation(userData ? userData.complemento : '', false, ''),
      bairro: setValidation(userData ? userData.bairro : '', true, ''),
      cidade: setValidation(userData ? userData.cidade : '', true, ''),
      estado: setValidation(userData ? userData.estado : '', true, ''),
      ponto_de_referencia: setValidation(userData ? userData.ponto_referencia : '', true, ''),
    });
  }

  registerPageStepThreeForm(): FormGroup {
    return this.formBuilder.group({
      newpassword: setValidation('', true, 'newpassword'),
      confirmPassword: setValidation('', true, 'confirmPassword'),
    });
  }

  profilePageStepThreeForm(resetPassword?): FormGroup {
    return this.formBuilder.group({
      password: setValidation('', resetPassword ? true : false, 'oldPassword'),
      newpassword: setValidation('', resetPassword ? true : false, 'password'),
      confirmPassword: setValidation('', resetPassword ? true : false, 'confirmPassword'),
    });
  }

  forgetPasswordFormOne(): FormGroup {
    return this.formBuilder.group({
      user_login: setValidation('', true, 'cpf')
    });
  }

  forgetPasswordFormTwo(): FormGroup {
    return this.formBuilder.group({
      newpassword: setValidation('', true, 'password'),
      confirmPassword: setValidation('', true, 'confirmPassword'),
    });
  }

  rechargeShopFormOneTelefone(): FormGroup {
    return this.formBuilder.group({
      telefone: setValidation('', true, 'phone'),
      variation: setValidation('', true, ''),
    });
  }

  rechargeShopFormTwoTelefone(): FormGroup {
    return this.formBuilder.group({
      telefone: setValidation('', true, 'phone'),
    });
  }

  loginForm(): FormGroup {
    return this.formBuilder.group({
      user: setValidation('', true, 'cpf'),
      password: setValidation('', true, 'password'),
    });
  }

  registerByDeepLinkStepOneForm(userData): FormGroup {
    userData.CPF = userData.CPF.replace(/\D+/g, '');
    return this.formBuilder.group({
      nome_completo: setValidation(userData ? userData.Nome : '', true, 'name'),
      username: setValidation(userData ? userData.CPF : '', true, 'cpf'),
      email: setValidation(userData ? userData.email : '', false, 'email'),
      data_de_nascimento: setValidation(userData ? userData.data_nascimento : '', true, ''),
      // id: setValidation(userData ? userData.ID : '', true, ''),
      telefone: setValidation(userData ? userData.celular : '', true, 'phone'),
      // tamanho_da_camisa: setValidation(userData ? userData.tamanho_camisa : '', false, ''),
      // tamanho_da_calca: setValidation(userData ? userData.tamanho_calca : '', false, ''),
      // tamanho_da_sapato: setValidation(userData ? userData.tamanho_sapato : '', false, ''),
      genero: setValidation(userData ? userData.genero : '', false, ''),
    });
  }

  registerByDeepLinkStepTwoForm(userData): FormGroup {
    return this.formBuilder.group({
      cep: setValidation(userData ? userData.cep : '', true, 'cep'),
      rua: setValidation(userData ? userData.rua : '', true, ''),
      numero: setValidation(userData ? userData.numero : '', false, ''),
      complemento: setValidation(userData ? userData.complemento : '', false, ''),
      bairro: setValidation(userData ? userData.bairro : '', true, ''),
      cidade: setValidation(userData ? userData.cidade : '', true, ''),
      estado: setValidation(userData ? userData.estado : '', true, ''),
      ponto_de_referencia: setValidation(userData ? userData.ponto_referencia : '', true, ''),
    });
  }

  checkOutForm(userData): FormGroup {
    return this.formBuilder.group({
      firstName: setValidation(userData ? userData.billing_first_name : '', true, 'name'),
      lastname: setValidation(userData ? userData.CPF : '', true, 'name'),
      cep: setValidation(userData ? userData.billing_postcode : '', true, 'cep'),
      email: setValidation(userData ? userData.billing_email : '', true, 'email'),
      endereco: setValidation(userData ? userData.billing_address_1 : '', true, ''),
      number: setValidation(userData ? userData.billing_number : '', true, ''),
      telefone: setValidation(userData ? userData.billing_phone : '', true, 'phone'),
      complemento: setValidation(userData ? userData.billing_complement : '', false, ''),
      cidade: setValidation(userData ? userData.billing_city : '', true, ''),
      bairro: setValidation(userData ? userData.billing_neighbor : '', true, ''),
      pontoDeReference: setValidation(userData ? userData.billing_referencia : '', true, ''),
      estado: setValidation(userData ? userData.billing_state : '', false, ''),
    });
  }

  contactForm(): FormGroup {
    return this.formBuilder.group({
      "name": setValidation('', true, 'name'),
      "email": setValidation('', true, 'email'),
      "telephone": setValidation('', true, 'phone'),
      "subject": setValidation('', true, ''),
      "message": setValidation('', true, ''),
    });
  }
}


// username: "49526030087"
// id: "00005"
// nome_completo: "Claudia Costa"
// email: "claudiabritocosta@me.com"
// telefone: "(22) 9925-6313"
// access_phone: "on"
// data_de_nascimento: "1974-01-13"
// tamanho_da_camisa: "P"
// tamanho_da_calca: "P"
// tamanho_da_sapato: "36"
// genero: "FEMININO"
// cep: "22793-520"
// rua: "null"
// numero: "null"
// complemento: "null"
// bairro: "null"
// cidade: "null"
// estado: "null"
// ponto_de_referencia: "null"
// origin: "first-access-site"