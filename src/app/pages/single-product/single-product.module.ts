import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleProductPageRoutingModule } from './single-product-routing.module';

import { SingleProductPage } from './single-product.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    BrMaskerModule,
    SingleProductPageRoutingModule
  ],
  declarations: [SingleProductPage]
})
export class SingleProductPageModule {}
