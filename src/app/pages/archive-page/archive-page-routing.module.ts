import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchivePagePage } from './archive-page.page';

const routes: Routes = [
  {
    path: '',
    component: ArchivePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArchivePagePageRoutingModule {}
