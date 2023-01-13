import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductTypePagePage } from './product-type-page.page';

const routes: Routes = [
  {
    path: '',
    component: ProductTypePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductTypePagePageRoutingModule {}
