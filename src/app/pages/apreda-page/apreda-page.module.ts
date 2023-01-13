import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApredaPagePageRoutingModule } from './apreda-page-routing.module';

import { ApredaPagePage } from './apreda-page.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    ApredaPagePageRoutingModule
  ],
  declarations: [ApredaPagePage]
})
export class ApredaPagePageModule {}
