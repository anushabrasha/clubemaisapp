import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MissionPagePageRoutingModule } from './mission-page-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { MissionPagePage } from './mission-page.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    SlickCarouselModule,
    IonicModule,
    PipesModule,
    MissionPagePageRoutingModule
  ],
  declarations: [MissionPagePage]
})
export class MissionPagePageModule {}
