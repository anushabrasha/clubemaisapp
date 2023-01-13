import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleNewsPagePageRoutingModule } from './single-news-page-routing.module';

import { SingleNewsPagePage } from './single-news-page.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    SingleNewsPagePageRoutingModule
  ],
  declarations: [SingleNewsPagePage]
})
export class SingleNewsPagePageModule {}
