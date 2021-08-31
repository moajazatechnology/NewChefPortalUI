import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-navbar',
  templateUrl: './front-navbar.component.html',
  styleUrls: ['./front-navbar.component.scss']
})
export class FrontNavbarComponent implements OnInit {

  public isNavbarCollapsed:boolean = true;
  customerToken: any;
  customerInfo: any = {};
  constructor(private router:Router) { 
    
  }

  ngOnInit(): void {
    this.customerToken = localStorage.getItem('customertoken');
    this.customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  }

  logout() {

    localStorage.removeItem('customertoken');
    localStorage.removeItem('chefsInfo');
    localStorage.removeItem('customerInfo');
    localStorage.removeItem('chefsBasketedProduct');
    this.router.navigate(['/']);
    this.ngOnInit();
  }

}
