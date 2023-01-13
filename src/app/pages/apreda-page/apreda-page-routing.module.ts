import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApredaPagePage } from './apreda-page.page';

const routes: Routes = [
  {
    path: '',
    component: ApredaPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApredaPagePageRoutingModule {}
