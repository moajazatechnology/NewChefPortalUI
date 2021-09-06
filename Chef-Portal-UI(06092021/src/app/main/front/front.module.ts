import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FooterModule } from './footer/footer.module';
import { ViewChefsModule } from './view-chefs/view-chefs.module';
import { FrontNavbarModule } from './front-navbar/front-navbar.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FooterModule,
    ViewChefsModule,
    FrontNavbarModule
  ],
  exports: [RouterModule,SharedModule]
})
export class FrontModule { }
