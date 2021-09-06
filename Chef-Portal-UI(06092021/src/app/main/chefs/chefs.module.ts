import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChefsComponent } from './chefs.component';
import { HomeComponent } from './home/home.component';
import { MenusComponent } from './menus/menus.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { PaymentComponent } from './payment/payment.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarService } from 'src/app/_services/calender.service';
import { MenuService } from 'src/app/_services/menu.service';
import { LoaderService } from 'src/app/_services/loaderservice';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { CreateMenuComponent } from './menus/create-menu/create-menu.component';
import { CalendarEventFormDialogComponent } from './schedules/event-form/event-form.component';
import { AddProductVarientsComponent } from './products/create-product/add-product-varients/add-product-varients.component';
import { ViewSingleOrderComponent } from './orders/view-single-order/view-single-order.component';

const routes = [
  {
    path     : '',
    component: ChefsComponent,
      children : [
        {
          path     : 'home',
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
          path     : 'orders',
          component: OrdersComponent
        },
        {
          path     : 'order/single/:id',
          component: ViewSingleOrderComponent
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
    ChefsComponent,
    HomeComponent,
    MenusComponent,
    OrdersComponent,
    ProductsComponent,
    ProfileComponent,
    SchedulesComponent,
    PaymentComponent,
    CreateProductComponent,
    EditProfileComponent,
    CreateMenuComponent,
    CalendarEventFormDialogComponent,
    AddProductVarientsComponent,
    ViewSingleOrderComponent,
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
export class ChefsModule { }
