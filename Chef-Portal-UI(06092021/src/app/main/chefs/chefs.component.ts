import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services';

@Component({
  selector: 'app-chefs',
  templateUrl: './chefs.component.html',
  styleUrls: ['./chefs.component.scss']
})
export class ChefsComponent implements OnInit {

  constructor(
    private router:Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  logout() {

    this.authService.logout();
  }

}
