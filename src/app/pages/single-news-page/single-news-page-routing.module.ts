import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleNewsPagePage } from './single-news-page.page';

const routes: Routes = [
  {
    path: '',
    component: SingleNewsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleNewsPagePageRoutingModule {}
