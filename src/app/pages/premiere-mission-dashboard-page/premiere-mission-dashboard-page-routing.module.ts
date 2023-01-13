import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PremiereMissionDashboardPagePage } from './premiere-mission-dashboard-page.page';

const routes: Routes = [
  {
    path: '',
    component: PremiereMissionDashboardPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PremiereMissionDashboardPagePageRoutingModule {}
