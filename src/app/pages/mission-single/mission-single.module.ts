import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MissionSinglePageRoutingModule } from './mission-single-routing.module';

import { MissionSinglePage } from './mission-single.page';
import { PinchZoomModule } from 'ngx-pinch-zoom';

import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    PipesModule,
    MissionSinglePageRoutingModule,
    PinchZoomModule
  ],
  declarations: [MissionSinglePage]
})
export class MissionSinglePageModule { }
