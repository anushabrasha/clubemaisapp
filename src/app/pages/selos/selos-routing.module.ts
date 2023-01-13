import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelosPage } from './selos.page';

const routes: Routes = [
  {
    path: '',
    component: SelosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelosPageRoutingModule {}
