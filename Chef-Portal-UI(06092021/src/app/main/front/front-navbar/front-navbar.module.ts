import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FrontNavbarComponent } from './front-navbar.component';
import { FooterModule } from '../footer/footer.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { CustomerLoginComponent } from '../customer-login/customer-login.component';
import { CustomerSignupComponent } from '../customer-signup/customer-signup.component';
import { BecomeAChefsComponent } from '../become-achefs/become-achefs.component';
import { ChefLoginComponent } from '../chef-login/chef-login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes = [
  {
    path     : '',
    component: FrontNavbarComponent,
      children : [
        {
          path     : '',
          component: HomeComponent,
        },
        {
          path     : 'customer-login',
          component: CustomerLoginComponent,
        },
        {
          path     : 'customer-login/:type',
          component: CustomerLoginComponent,
        },
        {
          path     : 'chef-login',
          component: ChefLoginComponent,
        },
        {
          path     : 'customer-signup',
          component: CustomerSignupComponent,
        },
        {
          path     : 'become-chefs',
          component: BecomeAChefsComponent,
        }
      ]
  }
];

@NgModule({
  declarations: [
    FrontNavbarComponent,
    HomeComponent,
    CustomerLoginComponent,
    CustomerSignupComponent,
    BecomeAChefsComponent,
    ChefLoginComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FooterModule,
    RouterModule.forChild(routes),
    NgbModule
  ],
  exports: [
    FrontNavbarComponent
  ]
})
export class FrontNavbarModule { }
