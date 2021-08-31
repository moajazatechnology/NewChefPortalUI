import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './error404.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/main/material.module';

const routes = [
  {
      path     : 'errors/error-404',
      component: Error404Component
  }
];

@NgModule({
  declarations: [
    Error404Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class Error404Module { }
