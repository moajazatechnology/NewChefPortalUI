import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { AddEditAddressComponent } from './customer-profile/add-edit-address/add-edit-address.component';
import { CustomerOrdersComponent } from '../customer-orders/customer-orders.component';
import { CustomerSingleOrderComponent } from '../customer-single-order/customer-single-order.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { FooterModule } from '../../front/footer/footer.module';

const routes = [
  {
    path     : '',
    component: CustomerDashboardComponent,
      children : [
        {
          path : 'profile',
          component: CustomerProfileComponent
        },
        {
          path : 'orders',
          component: CustomerOrdersComponent
        }
      ]
  }
];

@NgModule({
  declarations: [
    CustomerDashboardComponent,
    CustomerProfileComponent,
    AddEditAddressComponent,
    CustomerOrdersComponent,
    CustomerSingleOrderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedModule,
    NgbModule,
    FooterModule
  ]
})
export class CustomerDashboardModule { }
