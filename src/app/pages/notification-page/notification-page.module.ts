import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationPagePageRoutingModule } from './notification-page-routing.module';

import { NotificationPagePage } from './notification-page.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    NotificationPagePageRoutingModule
  ],
  declarations: [NotificationPagePage]
})
export class NotificationPagePageModule {}
