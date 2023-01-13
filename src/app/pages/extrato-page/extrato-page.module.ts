import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtratoPagePageRoutingModule } from './extrato-page-routing.module';

import { ExtratoPagePage } from './extrato-page.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    PipesModule,
    IonicModule,
    ExtratoPagePageRoutingModule
  ],
  declarations: [ExtratoPagePage]
})
export class ExtratoPagePageModule { }
