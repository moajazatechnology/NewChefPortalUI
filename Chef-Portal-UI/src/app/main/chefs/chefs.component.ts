import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-chefs',
  templateUrl: './chefs.component.html',
  styleUrls: ['./chefs.component.scss']
})
export class ChefsComponent implements OnInit {

  public showLoader:boolean = true;
  public route_list: Object = {
    home: "Overview",
    profile: "My Profile",
    orders: "My Orders",
    products: "My Products",
    menus: "My Menus",
    schedules: "My Schedules",
    payments: "Payment settings",
  }
  public current_route: String = this.route_list['home'];

  public userInfo: any = {};
  public chefName: String = "";
  public chefProfilePicture:String = "";

  constructor(
    private router:Router,
    private authService: AuthService,
    private _dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getCurrentChefInfo();
  }

  logout() {

    this.authService.logout();
  }

  updateRoute(route: string) {
    this.current_route = this.route_list[route];
  }

  getCurrentChefInfo() {
    this._dataService.getChefInfo({url:'chef', isLoader:true})
    .subscribe(response => {
      this.userInfo = response;
      this.chefName = this.userInfo?.first_name + " " + this.userInfo?.second_name;
      this.chefProfilePicture = this.userInfo?._chef_profile._chef_profile_image.media_url.url;
      this.showLoader = false;
      console.log("HAMZa")
      console.log(this.userInfo);
      console.log("HAMZa")
    });
  }


}
