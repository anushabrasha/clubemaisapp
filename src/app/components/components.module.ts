import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SideMenuComponent } from './side-menu/side-menu.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { NewsPageCardComponent } from './news-page-card/news-page-card.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { WeeklyReportComponent } from './weekly-report/weekly-report.component';
import { PerformanceRulesComponent } from './performance-rules/performance-rules.component';
import { AprendaArchiveCardComponent } from './aprenda-archive-card/aprenda-archive-card.component';
import { MissionTypeComponent } from './mission-type/mission-type.component';
import { MissioChartComponent } from './missio-chart/missio-chart.component';
import { UserCardInfoComponent } from "./user-card-info/user-card-info.component";

import { UserInfoComponent } from './user-info/user-info.component';
import { PipesModule } from "../pipes/pipes.module";
import { SelosCardComponent } from './selos-card/selos-card.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { VantagensCardComponent } from './vantagens-card/vantagens-card.component';
import { UserInfoHeaderComponent } from './user-info-header/user-info-header.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';

const allComponents = [SideMenuComponent, HeaderComponent, FooterComponent, AlertPopupComponent,
  NewsPageCardComponent, MonthlyReportComponent, WeeklyReportComponent, PerformanceRulesComponent, AprendaArchiveCardComponent,
  MissionTypeComponent, MissioChartComponent, UserCardInfoComponent, SelosCardComponent, VantagensCardComponent,
  UserInfoComponent, UserInfoHeaderComponent, UserAvatarComponent];

@NgModule({
  declarations: allComponents,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PipesModule,
    SlickCarouselModule,
    IonicModule.forRoot()
  ],
  exports: allComponents,
  entryComponents: []
})
export class ComponentsModule { }
