import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChefsComponent } from './view-chefs.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { SharedModule } from '../../shared/shared.module';
import { ViewSingleChefComponent } from './view-single-chef/view-single-chef.component';
import { ViewChefNavbarComponent } from './view-chef-navbar/view-chef-navbar.component';
import { FooterModule } from '../footer/footer.module';
import { AddToBasketComponent } from './view-single-chef/add-to-basket/add-to-basket.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutComponent } from './view-single-chef/checkout/checkout.component';
import { CheckoutPassComponent } from './view-single-chef/checkout-pass/checkout-pass.component';
import { CheckoutFailComponent } from './view-single-chef/checkout-fail/checkout-fail.component';
import { AddQuantityComponent } from './view-single-chef/add-quantity/add-quantity.component';
import { AddNewAddressComponent } from './view-single-chef/checkout/add-new-address/add-new-address.component';
import { AuthGuard } from 'src/app/_guards';

const routes = [
  {
    path     : 'view-chefs',
    component: ViewChefsComponent
  },
  {
    path     : 'view-chef/:id',
    component: ViewSingleChefComponent
  },
  {
    path     : 'checkout',
    component:CheckoutComponent,
    // canActivate: [AuthGuard]
  },
  {
    path     : 'checkout/success',
    component:CheckoutPassComponent,
    canActivate: [AuthGuard]
  },
  {
    path     : 'checkout/fail',
    component:CheckoutFailComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    ViewChefsComponent,
    ViewSingleChefComponent,
    ViewChefNavbarComponent,
    AddToBasketComponent,
    CheckoutComponent,
    CheckoutPassComponent,
    CheckoutFailComponent,
    AddQuantityComponent,
    AddNewAddressComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedModule,
    NgImageSliderModule,
    FooterModule,
    NgbModule,
  ],
  exports:[
    ViewChefNavbarComponent
  ]
})
export class ViewChefsModule { }
