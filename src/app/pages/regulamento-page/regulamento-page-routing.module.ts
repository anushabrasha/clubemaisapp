import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegulamentoPagePage } from './regulamento-page.page';

const routes: Routes = [
  {
    path: '',
    component: RegulamentoPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegulamentoPagePageRoutingModule {}
