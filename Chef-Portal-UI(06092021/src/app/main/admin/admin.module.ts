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
import { AuthGuard } from 'src/app/_guards';
import { EditChefProfileComponent } from './chefs/view-chef-profile/edit-chef-profile/edit-chef-profile.component';

const routes = [
  {
    path     : '',
    component: AdminComponent,
      children : [
        {
          path     : 'adminhome',
          component: AdminHomeComponent,
          canActivate: [AuthGuard]
        },
        {
          path     : 'chefs',
          component: ChefsComponent,
          canActivate: [AuthGuard]
        },
        {
          path     : 'customers',
          component: CustomersComponent,
          canActivate: [AuthGuard]
        },
        {
          path     : 'orders',
          component: OrderComponent,
          canActivate: [AuthGuard]
        },
        {
          path : 'product',
          component : ChefsListForProductComponent,
          canActivate: [AuthGuard]
        },
        {
          path : 'view-profile/:id',
          component : ViewChefProfileComponent,
          canActivate: [AuthGuard]
        },
        {
          path : 'promotions',
          component : PromomtionsComponent,
          canActivate: [AuthGuard]
        },
        {
          path : 'single-promo/:id',
          component : SinglePromoComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'menu',
          component : ChefListForMenuComponent,
          canActivate: [AuthGuard]
        },
        {
          path : 'chefs/OrderOfChef',
          component : OrderOfChefComponent,
          canActivate: [AuthGuard]
        },
        {
          path : 'chefs/schedules/:id',
          component: SchedulesComponent,
          canActivate: [AuthGuard],
          resolve  : {
            events: CalendarService,
          }
        },
        {
          path     : 'chefs/home',
          component: HomeComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'chefs/ChefPayment',
          component : ChefPaymentComponent,
          canActivate: [AuthGuard]
        },
        {
          path : 'chefs/productBychefId/:id',
          component : ProductListComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'chefs/menuByChefid/:id',
          component : MenuComponent,
          canActivate: [AuthGuard]
        },
        {
          path     : 'chefs/profile/:id',
          component: ChefsProfileComponent,
          canActivate: [AuthGuard]
        },
        {
          path     : 'edit-profile-chef/:id',
          component: EditProfileChefComponent,
          canActivate: [AuthGuard]
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
    EditChefProfileComponent
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
