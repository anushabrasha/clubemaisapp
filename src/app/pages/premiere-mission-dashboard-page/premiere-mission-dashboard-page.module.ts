import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PremiereMissionDashboardPagePageRoutingModule } from './premiere-mission-dashboard-page-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { PremiereMissionDashboardPagePage } from './premiere-mission-dashboard-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PremiereMissionDashboardPagePageRoutingModule
  ],
  declarations: [PremiereMissionDashboardPagePage]
})
export class PremiereMissionDashboardPagePageModule { }
