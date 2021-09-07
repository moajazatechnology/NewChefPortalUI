import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log(this.route.url);
  }

  logout() {

    this.authService.logout();
  }

}
