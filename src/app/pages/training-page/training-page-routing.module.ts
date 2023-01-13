import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingPagePage } from './training-page.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingPagePageRoutingModule {}
