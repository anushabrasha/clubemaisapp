import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgetPasswordPagePageRoutingModule } from './forget-password-page-routing.module';

import { ForgetPasswordPagePage } from './forget-password-page.page';
import { BrMaskerModule } from 'br-mask';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    BrMaskerModule,
    ForgetPasswordPagePageRoutingModule
  ],
  declarations: [ForgetPasswordPagePage]
})
export class ForgetPasswordPagePageModule { }
