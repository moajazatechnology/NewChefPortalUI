import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  checkUserType: boolean = false;
  
  constructor(
    private router:Router
  ) {
    let userType = localStorage.getItem('userType');
    this.checkUserType = userType === 'true' ? true : false;
   }

  ngOnInit(): void {
  }

  logout() {

    localStorage.removeItem('userType');
    this.router.navigate(['/']);
  }

}
