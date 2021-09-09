import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {

  public isNavbarCollapsed:boolean = true;
  customerInfo: any = {};
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
    console.log(this.customerInfo);
   }

  ngOnInit(): void {
  }

  logout() {
   
    this.authService.logout();
  }
}
