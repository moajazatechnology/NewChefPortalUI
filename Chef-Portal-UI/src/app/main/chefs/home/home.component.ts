import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public profile_data: any = {};
  public showLoader: boolean = true;

  constructor(
    private _dataService : DataService
  ) { }

  ngOnInit(): void {

    this.getProfileCompleteData()
  }

  getProfileCompleteData() {
      this._dataService.getAll({url:'chef/account_progress',isLoader:true})
      .subscribe(res =>{
        this.profile_data = res;
        this.showLoader = false;
      })
  }

}
