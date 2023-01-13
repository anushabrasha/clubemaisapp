import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPagePageRoutingModule } from './login-page-routing.module';
import { BrMaskerModule } from 'br-mask';

import { LoginPagePage } from './login-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BrMaskerModule,
    LoginPagePageRoutingModule
  ],
  declarations: [LoginPagePage]
})
export class LoginPagePageModule { }
