import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MissionSinglePage } from './mission-single.page';

const routes: Routes = [
  {
    path: '',
    component: MissionSinglePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MissionSinglePageRoutingModule {}
