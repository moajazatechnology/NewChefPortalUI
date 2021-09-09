import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataService } from './_services/dataservice';
import { LoaderAuthInterceptor } from './_helpers/auth.interceptor';
import { ConfirmDialogComponent } from './main/shared/components/confirm-dialog/confirm-dialog.component';
import { MaterialModule } from './main/material.module';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LoaderComponent } from './main/shared/components/loader/loader.component';
import { LoaderService } from './_services/loaderservice';
import { SharedModule } from './main/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './_guards';
import { AuthService } from './_services';
import { appInitializer } from './_guards/appInitializer';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    FormsModule

    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // })
  ],
  exports: [
    LoaderComponent,
  ],
  providers: [DataService,
    AuthGuard,
    // { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService] },
    {
      provide : HTTP_INTERCEPTORS,
      useClass: LoaderAuthInterceptor,
      multi   : true,
    },
    DatePipe,
    LoaderService,
    CurrencyPipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
