import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContaPagePage } from './conta-page.page';

const routes: Routes = [
  {
    path: '',
    component: ContaPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContaPagePageRoutingModule {}
