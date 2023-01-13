import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductTypePagePageRoutingModule } from './product-type-page-routing.module';

import { ProductTypePagePage } from './product-type-page.page';

import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    ProductTypePagePageRoutingModule
  ],
  declarations: [ProductTypePagePage]
})
export class ProductTypePagePageModule {}
