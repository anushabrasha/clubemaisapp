import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArchivePagePageRoutingModule } from './archive-page-routing.module';

import { ArchivePagePage } from './archive-page.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    ArchivePagePageRoutingModule
  ],
  declarations: [ArchivePagePage]
})
export class ArchivePagePageModule {}
