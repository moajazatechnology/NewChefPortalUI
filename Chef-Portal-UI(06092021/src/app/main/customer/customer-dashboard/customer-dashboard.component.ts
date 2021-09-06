import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {

  public isNavbarCollapsed:boolean = true;
  customerInfo: any = {};
  constructor(
    private router: Router
  ) {
    this.customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
    console.log(this.customerInfo);
   }

  ngOnInit(): void {
  }

  logout() {
    localStorage.removeItem('customertoken');
    localStorage.removeItem('chefsInfo');
    localStorage.removeItem('customerInfo');
    localStorage.removeItem('chefsBasketedProduct');
    this.router.navigate(['/']);
  }
}
