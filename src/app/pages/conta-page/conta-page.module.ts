import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContaPagePageRoutingModule } from './conta-page-routing.module';

import { ContaPagePage } from './conta-page.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    ContaPagePageRoutingModule
  ],
  declarations: [ContaPagePage]
})
export class ContaPagePageModule {}
