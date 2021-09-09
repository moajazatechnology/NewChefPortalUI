import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer1',
  templateUrl: './footer1.component.html',
  styleUrls: ['./footer1.component.scss']
})
export class Footer1Component implements OnInit {

  customerToken: any = {};
  constructor(
    private router: Router
  ) { 
    this.customerToken = localStorage.getItem('token');
  }

  ngOnInit(): void {
  }

  customerLogin() {
    if(this.customerToken) {
      this.router.navigate(['/customer/profile']);
    }else{
      this.router.navigate(['/customer-login']);
    }
  }

}
