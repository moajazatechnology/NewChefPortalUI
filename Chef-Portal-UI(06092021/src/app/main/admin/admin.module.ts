import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoaderService } from 'src/app/_services/loaderservice';
import { HomeComponent } from './home/home.component';
import { ChefsComponent } from './chefs/chefs.component';
import { CustomersComponent } from './customers/customers.component';
import { OrderComponent } from './order/order.component';
import { AdminComponent } from './admin.component';
import { ChefsProfileComponent } from './chefs/chefs-profile/chefs-profile.component';
import { ProductListComponent } from './product-list/product-list.component';
import { MenuComponent } from './menu/menu.component';
import { EditProfileChefComponent } from './edit-profile-chef/edit-profile-chef/edit-profile-chef.component';
import { ChefsListForProductComponent } from './product-list/chefs-list-for-product/chefs-list-for-product.component';
import { ChefListForMenuComponent } from './menu/chef-list-for-menu/chef-list-for-menu.component';
import { OrderOfChefComponent } from './order/order-of-chef/order-of-chef.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { CalendarService } from 'src/app/_services/calender.service';
import { ChefPaymentComponent } from './chefs/chef-payment/chef-payment.component';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarEventFormDialogComponent } from './schedules/event-form/event-form.component';
import { PromomtionsComponent } from './promomtions/promomtions.component';
import { CreatePromotionComponent } from './promomtions/create-promotion/create-promotion.component';
import { SinglePromoComponent } from './promomtions/single-promo/single-promo.component';
import { EditPromocodeComponent } from './promomtions/edit-promocode/edit-promocode.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ViewChefProfileComponent } from './chefs/view-chef-profile/view-chef-profile.component';
import { ViewSingleCustomerComponent } from './customers/view-single-customer/view-single-customer.component';
import { ViewSingleOrderAdminComponent } from './order/view-single-order-admin/view-single-order-admin.component';
import { ViewSingleOrderChefsComponent } from './order/view-single-order-chefs/view-single-order-chefs.component';

const routes = [
  {
    path     : '',
    component: AdminComponent,
      children : [
        {
          path     : 'adminhome',
          component: AdminHomeComponent,
        },
        {
          path     : 'chefs',
          component: ChefsComponent
        },
        {
          path     : 'customers',
          component: CustomersComponent
        },
        {
          path     : 'view-customer/:id',
          component: ViewSingleCustomerComponent
        },
        {
          path     : 'orders',
          component: OrderComponent
        },
        {
          path     : 'view-order/:id',
          component: ViewSingleOrderAdminComponent
        },
        {
          path     : 'chefs/view-order/:id',
          component: ViewSingleOrderChefsComponent
        },
        {
          path : 'product',
          component : ChefsListForProductComponent
        },
        {
          path : 'view-profile/:id',
          component : ViewChefProfileComponent
        },
        {
          path : 'promotions',
          component : PromomtionsComponent
        },
        {
          path : 'single-promo/:id',
          component : SinglePromoComponent
        },
        {
          path: 'menu',
          component : ChefListForMenuComponent
        },
        {
          path : 'chefs/OrderOfChef',
          component : OrderOfChefComponent
        },
        {
          path : 'chefs/schedules/:id',
          component: SchedulesComponent,
          resolve  : {
            events: CalendarService,
          }
        },
        {
          path     : 'chefs/home',
          component: HomeComponent,
        },
        {
          path: 'chefs/ChefPayment',
          component : ChefPaymentComponent
        },
        {
          path : 'chefs/productBychefId/:id',
          component : ProductListComponent
        },
        {
          path: 'chefs/menuByChefid/:id',
          component : MenuComponent,
        },
        {
          path     : 'chefs/profile/:id',
          component: ChefsProfileComponent
        },
        {
          path     : 'edit-profile-chef/:id',
          component: EditProfileChefComponent
        }
      ]
  }
];


@NgModule({
  declarations: [
    AdminComponent,
    CustomersComponent,
    HomeComponent,
    OrderComponent,
    ChefsComponent,
    ChefsProfileComponent,
    ProductListComponent,
    MenuComponent,
    EditProfileChefComponent,
    ChefsListForProductComponent,
    ChefListForMenuComponent,
    OrderOfChefComponent,
    SchedulesComponent,
    ChefPaymentComponent,
    CalendarEventFormDialogComponent,
    PromomtionsComponent,
    CreatePromotionComponent,
    SinglePromoComponent,
    EditPromocodeComponent,
    AdminHomeComponent,
    ViewChefProfileComponent,
    ViewSingleCustomerComponent,
    ViewSingleOrderAdminComponent,
    ViewSingleOrderChefsComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedModule,
    AngularCalendarModule.forRoot({
      provide   : DateAdapter,
      useFactory: adapterFactory
  }),
  ],
  exports: [RouterModule],
  providers: [LoaderService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }
