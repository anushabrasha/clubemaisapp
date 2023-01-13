import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MissionPagePage } from './mission-page.page';

const routes: Routes = [
  {
    path: '',
    component: MissionPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MissionPagePageRoutingModule {}
