import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsPagePageRoutingModule } from './news-page-routing.module';

import { ComponentsModule } from '../../components/components.module';

import { NewsPagePage } from './news-page.page';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    NewsPagePageRoutingModule
  ],
  declarations: [NewsPagePage]
})
export class NewsPagePageModule {}
