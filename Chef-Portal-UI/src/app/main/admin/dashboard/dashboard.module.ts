import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HomeComponent } from '../../chefs/home/home.component';
import { MenusComponent } from '../../chefs/menus/menus.component';
import { ChefsComponent } from '../chefs/chefs.component';
import { CustomersComponent } from '../customers/customers.component';
import { OrdersComponent } from '../../chefs/orders/orders.component';
import { ProductsComponent } from '../../chefs/products/products.component';
import { ProfileComponent } from '../../chefs/profile/profile.component';
import { SchedulesComponent } from '../../chefs/schedules/schedules.component';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarService } from 'src/app/_services/calender.service';
import { MenuService } from 'src/app/_services/menu.service';
import { PaymentComponent } from '../../chefs/payment/payment.component';
import { LoaderService } from 'src/app/_services/loaderservice';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../../shared/shared.module';

const routes = [
  {
      path     : 'dashboard',
      component: DashboardComponent,
      children : [
        {
          path     : '',
          component: HomeComponent,
        },
        {
          path     : 'menus',
          component: MenusComponent,
          resolve  : {
            chat: MenuService
          }
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
          path     : 'orders',
          component: OrdersComponent
        },
        {
          path     : 'products',
          component: ProductsComponent
        },
        {
          path     : 'profile',
          component: ProfileComponent
        },
        {
          path     : 'schedules',
          component: SchedulesComponent,
          resolve  : {
            events: CalendarService,
          }
        },
        {
          path     : 'payment',
          component: PaymentComponent,
        }
      ]
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    MenusComponent,
    ChefsComponent,
    CustomersComponent,
    OrdersComponent,
    ProductsComponent,
    ProfileComponent,
    SchedulesComponent,
    PaymentComponent
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
  providers: [CalendarService,MenuService,LoaderService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
