import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegulamentoPagePageRoutingModule } from './regulamento-page-routing.module';

import { RegulamentoPagePage } from './regulamento-page.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    RegulamentoPagePageRoutingModule
  ],
  declarations: [RegulamentoPagePage]
})
export class RegulamentoPagePageModule {}
