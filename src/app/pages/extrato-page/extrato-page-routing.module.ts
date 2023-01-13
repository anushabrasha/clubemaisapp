import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtratoPagePage } from './extrato-page.page';

const routes: Routes = [
  {
    path: '',
    component: ExtratoPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtratoPagePageRoutingModule {}
