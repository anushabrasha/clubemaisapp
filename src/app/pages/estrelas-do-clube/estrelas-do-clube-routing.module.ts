import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstrelasDoClubePage } from './estrelas-do-clube.page';

const routes: Routes = [
  {
    path: '',
    component: EstrelasDoClubePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstrelasDoClubePageRoutingModule {}
