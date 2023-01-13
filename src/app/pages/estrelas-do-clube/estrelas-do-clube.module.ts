import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstrelasDoClubePageRoutingModule } from './estrelas-do-clube-routing.module';

import { EstrelasDoClubePage } from './estrelas-do-clube.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    EstrelasDoClubePageRoutingModule
  ],
  declarations: [EstrelasDoClubePage]
})
export class EstrelasDoClubePageModule {}
