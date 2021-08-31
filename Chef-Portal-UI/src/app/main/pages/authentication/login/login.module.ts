import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/main/material.module';
import { SharedModule } from 'src/app/main/shared/shared.module';

const routes = [
  {
      path     : 'login',
      component: LoginComponent
  }
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})
export class LoginModule { }
