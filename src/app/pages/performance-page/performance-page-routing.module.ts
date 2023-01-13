import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerformancePagePage } from './performance-page.page';

const routes: Routes = [
  {
    path: '',
    component: PerformancePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformancePagePageRoutingModule {}
