import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerformancePagePageRoutingModule } from './performance-page-routing.module';

import { PerformancePagePage } from './performance-page.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    PerformancePagePageRoutingModule
  ],
  declarations: [PerformancePagePage],
  exports: [PerformancePagePage]
})
export class PerformancePagePageModule {}
