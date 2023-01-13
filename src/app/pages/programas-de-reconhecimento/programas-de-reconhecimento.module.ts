import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicModule } from '@ionic/angular';

import { ProgramasDeReconhecimentoPageRoutingModule } from './programas-de-reconhecimento-routing.module';

import { ProgramasDeReconhecimentoPage } from './programas-de-reconhecimento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramasDeReconhecimentoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProgramasDeReconhecimentoPage]
})
export class ProgramasDeReconhecimentoPageModule {}
