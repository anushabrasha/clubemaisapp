import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramPagePageRoutingModule } from './program-page-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { ProgramPagePage } from './program-page.page';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramPagePageRoutingModule
  ],
  declarations: [ProgramPagePage]
})
export class ProgramPagePageModule {}
