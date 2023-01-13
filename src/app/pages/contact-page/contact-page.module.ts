import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactPagePageRoutingModule } from './contact-page-routing.module';

import { ContactPagePage } from './contact-page.page';
import { ComponentsModule } from '../../components/components.module';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    BrMaskerModule,
    IonicModule,
    ContactPagePageRoutingModule
  ],
  declarations: [ContactPagePage]
})
export class ContactPagePageModule {}
