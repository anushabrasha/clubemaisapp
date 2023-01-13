
import { AbstractControl, Validators } from '@angular/forms';

const PURE_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Passwords should be at least 8 characters long and should contain one number, one character and one special character.
const PASSWORD_REGEXP = /^(?=\D*\d)(?=[^a-z]*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,25}$/;

// Phone number must be exactly 11 number and 3 symbols
const PHONE_NUMBER_REGEXP = /[0-9() -]{14,15}$/;

// cep number must be exactly 8 number
const CEP_REGEXP = /[0-9-]{9}$/;

// User Name must be in Characters alone
const NAME_REGEXP = /[A-Za-z]$/;

const oldPassword = (control: AbstractControl): { [key: string]: any } => {
  if (!control.value)
    return null;

  var reg = new RegExp(PASSWORD_REGEXP);
  let isValid = reg.test(control.value);
  if (!isValid)
    return { 'validatePassword': { isValid } }
  else
    return null;
};

const password = (control: AbstractControl): { [key: string]: any } => {
  if (!control.value)
    return null;

  var reg = new RegExp(PASSWORD_REGEXP);
  let isValid = reg.test(control.value);
  if (!isValid)
    return { 'validatePassword': { isValid } }
  else
    return null;
};

const name = (control: AbstractControl): { [key: string]: any } => {
  if (!control.value)
    return null;

  var reg = new RegExp(NAME_REGEXP);
  let isValid = reg.test(control.value);
  if (!isValid)
    return { 'validateName': { isValid } }
  else
    return null;
};

const confirmPassword = (control: AbstractControl): { [key: string]: any } => {
  if (!control.value)
    return null;

  var reg = new RegExp(PASSWORD_REGEXP);
  let isValid = reg.test(control.value);
  if (!isValid)
    return { 'validatePassword': { isValid } }

  isValid = control.value == control.root.value['newpassword']
  if (!isValid) {
    return { 'passwordMismatch': { isValid } };
  }

  return null;
};

const email = (control: AbstractControl): { [key: string]: any } => {
  if (!control.value)
    return null;
  var reg = new RegExp(PURE_EMAIL_REGEXP);
  let isValid = reg.test(control.value);
  if (!isValid)
    return { 'validateEmail': { isValid } }
  else
    return null;
};

const phoneNumber = (control: AbstractControl): { [key: string]: any } => {
  if (!control.value)
    return null;
  var reg = new RegExp(PHONE_NUMBER_REGEXP);
  let isValid = reg.test(control.value);
  if (!isValid)
    return { 'validatePhoneNumber': { isValid } }
  else
    return null;
};

const cpf = (control: AbstractControl): { [key: string]: any } => {
  let isValid = true;
  var cpf;
  if (control.value) {
    cpf = control.value.replace(/\D+/g, '');
  } else {
    return null;
  }

  var invalidCpf: any = ['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999'];
  if (invalidCpf.includes(cpf) || isNaN(Number(cpf)) || cpf.length != 11) {
    isValid = false;
    return { 'validateCpf': { isValid } }
  }
  return null;
  /*for (var t = 9; t < 11; t++) {
    for (var d = 0, c = 0; c < t; c++) {
      d += cpf[c] * ((t + 1) - c);
    }
    d = ((10 * d) % 11) % 10;
    if (cpf[c] != d) {
      isValid = false;
    }
  }

  // if (!cpf)
  //   isValid = true;

  if (!isValid)
    return { 'validateCpf': { isValid } }
  else
    return null;*/
};

const cep = (control: AbstractControl): { [key: string]: any } => {
  if (!control.value)
    return null;
  var reg = new RegExp(CEP_REGEXP);
  let isValid = reg.test(control.value);
  if (!isValid)
    return { 'validateCep': { isValid } }
  else
    return null;
};

const required = (control: AbstractControl): { [key: string]: any } => {
  if (control.value && control.value.text) {
    if (!control.value.text.trim())
      return { 'error': true };
    else
      return null;
  }
  if (!control.value || (control.value.trim && !control.value.trim()))
    return { 'error': true };
  else
    return null;
};

const inputValidators = {
  email: email,
  name: name,
  password: password,
  oldPassword: oldPassword,
  cpf: cpf,
  phone: phoneNumber,
  cep: cep,
  required: required,
  confirmPassword: confirmPassword
};

export const setValidation = (defaultValue = null, required: boolean = false, validation: string = null) => {
  var composeValidation = [];
  if (required) {
    composeValidation.push(Validators.required);
    composeValidation.push(inputValidators['required']);
  }

  if (defaultValue == 'null') {
    defaultValue = '';
  }

  if (validation)
    composeValidation.push(inputValidators[validation]);
  if (composeValidation.length)
    return [defaultValue, Validators.compose(composeValidation)];

  return [defaultValue];
}