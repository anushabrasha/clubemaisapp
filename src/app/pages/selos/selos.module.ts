import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelosPageRoutingModule } from './selos-routing.module';

import { SelosPage } from './selos.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SelosPage]
})
export class SelosPageModule {}
