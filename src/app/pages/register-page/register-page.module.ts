import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { RegisterPagePageRoutingModule } from './register-page-routing.module';

import { RegisterPagePage } from './register-page.page';
import { ComponentsModule } from '../../components/components.module';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    BrMaskerModule,
    IonicModule,
    RegisterPagePageRoutingModule
  ],
  declarations: [RegisterPagePage]
})
export class RegisterPagePageModule {}
