import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessPagePageRoutingModule } from './access-page-routing.module';

import { AccessPagePage } from './access-page.page';
import { BrMaskerModule } from 'br-mask';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BrMaskerModule,
    PipesModule,
    AccessPagePageRoutingModule
  ],
  declarations: [AccessPagePage]
})
export class AccessPagePageModule { }
