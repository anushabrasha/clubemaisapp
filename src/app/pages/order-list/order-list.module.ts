import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderListPageRoutingModule } from './order-list-routing.module';

import { OrderListPage } from './order-list.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    PipesModule,
    IonicModule,
    OrderListPageRoutingModule
  ],
  declarations: [OrderListPage]
})
export class OrderListPageModule {}
