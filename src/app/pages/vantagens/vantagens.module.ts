import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VantagensPageRoutingModule } from './vantagens-routing.module';

import { VantagensPage } from './vantagens.page';
import { ComponentsModule } from '../../components/components.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    VantagensPageRoutingModule,
    SlickCarouselModule
  ],
  declarations: [VantagensPage]
})
export class VantagensPageModule {}
