import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  profile_data: any = {};
  showLoader: boolean = true;

  constructor(
    private _dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getProfileCompleteData();
  }

  getProfileCompleteData() {
    this._dataService.getAll({url:'admin/home',isLoader:true})
    .subscribe(res =>{
      this.profile_data = res;
      this.showLoader = false;
    })
}

}
