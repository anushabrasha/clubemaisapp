import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login-page/login-page.module').then(m => m.LoginPagePageModule)
    //loadChildren: () => import('./pages/pre-login/pre-login.module').then(m => m.PreLoginPageModule)
  },
  {
    path: 'login-page',
    loadChildren: () => import('./pages/login-page/login-page.module').then(m => m.LoginPagePageModule)
  },
  {
    path: 'register-page',
    loadChildren: () => import('./pages/register-page/register-page.module').then(m => m.RegisterPagePageModule)
  },
  {
    path: 'register-page/:isProfile',
    loadChildren: () => import('./pages/register-page/register-page.module').then(m => m.RegisterPagePageModule)
  },
  {
    path: 'forget-password-page',
    loadChildren: () => import('./pages/forget-password-page/forget-password-page.module').then(m => m.ForgetPasswordPagePageModule)
  },
  {
    path: 'forget-password-page/:token',
    loadChildren: () => import('./pages/forget-password-page/forget-password-page.module').then(m => m.ForgetPasswordPagePageModule)
  },
  {
    path: 'access-page',
    loadChildren: () => import('./pages/access-page/access-page.module').then(m => m.AccessPagePageModule)
  },
  {
    path: 'dash-board',
    loadChildren: () => import('./pages/dash-board/dash-board.module').then(m => m.DashBoardPageModule)
  },
  {
    path: 'program',
    loadChildren: () => import('./pages/program-page/program-page.module').then(m => m.ProgramPagePageModule)
  },
  {
    path: 'program-page',
    loadChildren: () => import('./pages/program-page/program-page.module').then(m => m.ProgramPagePageModule)
  },
  {
    path: 'news-categories/category1',
    loadChildren: () => import('./pages/news-page/news-page.module').then(m => m.NewsPagePageModule)
  },
  {
    path: 'news-page',
    loadChildren: () => import('./pages/news-page/news-page.module').then(m => m.NewsPagePageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./pages/news-page/news-page.module').then(m => m.NewsPagePageModule)
  },
  {
    path: 'mission',
    loadChildren: () => import('./pages/mission-page/mission-page.module').then(m => m.MissionPagePageModule)
  },
  {
    path: 'mission-page',
    loadChildren: () => import('./pages/mission-page/mission-page.module').then(m => m.MissionPagePageModule)
  },
  {
    path: 'mission/',
    loadChildren: () => import('./pages/mission-page/mission-page.module').then(m => m.MissionPagePageModule)
  },
  {
    path: 'mission/?game=true',
    loadChildren: () => import('./pages/mission-page/mission-page.module').then(m => m.MissionPagePageModule)
  },
  {
    path: 'game-mission-page',
    loadChildren: () => import('./pages/mission-page/mission-page.module').then(m => m.MissionPagePageModule)
  },
  {
    path: 'apreda-page',
    loadChildren: () => import('./pages/apreda-page/apreda-page.module').then(m => m.ApredaPagePageModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./pages/shop/shop.module').then(m => m.ShopPageModule)
  },
  {
    path: 'training-page',
    loadChildren: () => import('./pages/training-page/training-page.module').then(m => m.TrainingPagePageModule)
  },
  {
    path: 'course-category/category1',
    loadChildren: () => import('./pages/training-page/training-page.module').then(m => m.TrainingPagePageModule)
  },
  {
    path: 'aprenda-2/',
    loadChildren: () => import('./pages/training-page/training-page.module').then(m => m.TrainingPagePageModule)
  },
  {
    path: 'badges',
    loadChildren: () => import('./pages/badges/badges.module').then(m => m.BadgesPageModule)
  },
  {
    path: 'contact-page',
    loadChildren: () => import('./pages/contact-page/contact-page.module').then(m => m.ContactPagePageModule)
  },
  {
    path: 'extrato-page',
    loadChildren: () => import('./pages/extrato-page/extrato-page.module').then(m => m.ExtratoPagePageModule)
  },
  {
    path: 'extrato',
    loadChildren: () => import('./pages/extrato-page/extrato-page.module').then(m => m.ExtratoPagePageModule)
  },
  {
    path: 'mission-single',
    loadChildren: () => import('./pages/mission-single/mission-single.module').then(m => m.MissionSinglePageModule)
  },
  {
    path: 'single-product',
    loadChildren: () => import('./pages/single-product/single-product.module').then(m => m.SingleProductPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule)
  },
  {
    path: 'archive-page',
    loadChildren: () => import('./pages/archive-page/archive-page.module').then(m => m.ArchivePagePageModule)
  },
  {
    path: 'performance-page/:isConstelacao=true',
    loadChildren: () => import('./pages/performance-page/performance-page.module').then(m => m.PerformancePagePageModule)
  },
  {
    path: 'performance-page',
    loadChildren: () => import('./pages/performance-page/performance-page.module').then(m => m.PerformancePagePageModule)
  },
  {
    path: 'single-news-page',
    loadChildren: () => import('./pages/single-news-page/single-news-page.module').then(m => m.SingleNewsPagePageModule)
  },
  {
    path: 'notification-page',
    loadChildren: () => import('./pages/notification-page/notification-page.module').then(m => m.NotificationPagePageModule)
  },
  {
    path: 'order-list',
    loadChildren: () => import('./pages/order-list/order-list.module').then(m => m.OrderListPageModule)
  },
  {
    path: 'conta-page',
    loadChildren: () => import('./pages/conta-page/conta-page.module').then(m => m.ContaPagePageModule)
  },
  {
    path: 'product-type-page',
    loadChildren: () => import('./pages/product-type-page/product-type-page.module').then(m => m.ProductTypePagePageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqPageModule)
  },
  {
    path: 'regulamento-page',
    loadChildren: () => import('./pages/regulamento-page/regulamento-page.module').then(m => m.RegulamentoPagePageModule)
  },
  {
    path: 'pre-login',
    loadChildren: () => import('./pages/pre-login/pre-login.module').then(m => m.PreLoginPageModule)
  },
  {
    path: 'vantagens',
    loadChildren: () => import('./pages/vantagens/vantagens.module').then(m => m.VantagensPageModule)
  },
  {
    path: 'selos',
    loadChildren: () => import('./pages/badges/badges.module').then(m => m.BadgesPageModule)
  },
  {
    path: 'estrelas-do-clube',
    loadChildren: () => import('./pages/estrelas-do-clube/estrelas-do-clube.module').then(m => m.EstrelasDoClubePageModule)
  },
  {
    path: 'premiere-mission-dashboard-page',
    loadChildren: () => import('./pages/premiere-mission-dashboard-page/premiere-mission-dashboard-page.module').then(m => m.PremiereMissionDashboardPagePageModule)
  },
  {
    path: 'programas-de-reconhecimento',
    loadChildren: () => import('./pages/programas-de-reconhecimento/programas-de-reconhecimento.module').then(m => m.ProgramasDeReconhecimentoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
