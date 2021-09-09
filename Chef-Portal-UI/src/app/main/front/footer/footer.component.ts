import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

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
