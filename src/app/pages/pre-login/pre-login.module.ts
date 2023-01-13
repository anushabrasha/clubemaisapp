import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreLoginPageRoutingModule } from './pre-login-routing.module';

import { PreLoginPage } from './pre-login.page';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    PreLoginPageRoutingModule
  ],
  declarations: [PreLoginPage]
})
export class PreLoginPageModule {}
