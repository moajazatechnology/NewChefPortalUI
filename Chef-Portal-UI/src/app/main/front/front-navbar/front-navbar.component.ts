import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services';

@Component({
  selector: 'app-front-navbar',
  templateUrl: './front-navbar.component.html',
  styleUrls: ['./front-navbar.component.scss']
})
export class FrontNavbarComponent implements OnInit {

  public isNavbarCollapsed:boolean = true;
  customerToken: any;
  customerInfo: any = {};
  constructor(
    private router:Router,
    private authService: AuthService
    ) { 
    
  }

  ngOnInit(): void {
    this.customerToken = localStorage.getItem('token');
    this.customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  }

  logout() {

    this.authService.logout();
    this.ngOnInit();
  }

}
