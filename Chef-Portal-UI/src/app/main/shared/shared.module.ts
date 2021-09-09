import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MaterialModule } from '../material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// export function HttpLoaderFactory(httpClient: HttpClient) {

//   // tslint:disable-next-line: max-line-length
//   let windowOrigin: string = (window.location.href).indexOf('weblagerng') === -1 ? window.location.origin : (window.location.origin + '/weblagerng');
//   windowOrigin = windowOrigin.replace('#/', '');
//   return new TranslateHttpLoader(httpClient, windowOrigin + '/assets/', '-lang.json');
// }

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxSpinnerModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // })
  ],
  exports:[
    ConfirmDialogComponent,
    LoaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
