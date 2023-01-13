import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramPagePage } from './program-page.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramPagePageRoutingModule {}
