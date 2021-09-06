import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { MaterialModule } from '../../material.module';
import { Footer1Component } from './footer1/footer1.component';


@NgModule({
  declarations: [
    FooterComponent,
    Footer1Component
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    FooterComponent,
    Footer1Component
  ]
})
export class FooterModule { }
