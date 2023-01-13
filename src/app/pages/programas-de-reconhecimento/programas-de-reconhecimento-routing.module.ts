import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramasDeReconhecimentoPage } from './programas-de-reconhecimento.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramasDeReconhecimentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramasDeReconhecimentoPageRoutingModule {}
