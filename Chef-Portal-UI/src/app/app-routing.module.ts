import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './main/admin/admin.module';
import { ChefsModule } from './main/chefs/chefs.module';
import { CustomerDashboardModule } from './main/customer/customer-dashboard/customer-dashboard.module';
import { FrontModule } from './main/front/front.module';
import { PagesModule } from './main/pages/pages.module';

const routes: Routes = [
  {
    path        : '',
    loadChildren: () => import('./main/front/front.module').then(m => m.FrontModule),
    pathMatch: 'full'
  },
  {
    path        : 'auth',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path        : 'admin',
    loadChildren: () => import('./main/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path        : 'chef',
    loadChildren: () => import('./main/chefs/chefs.module').then(m => m.ChefsModule)
  },
  {
    path        : 'customer',
    loadChildren: () => import('./main/customer/customer-dashboard/customer-dashboard.module').then(m => m.CustomerDashboardModule)
  },
  // {
  //   path        : '**',
  //   redirectTo  : '/errors/error-404'
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    FrontModule,
    PagesModule,
    AdminModule,
    ChefsModule,
    CustomerDashboardModule
  ],
  exports: [
    RouterModule,
    FrontModule
  ]
})
export class AppRoutingModule { }
