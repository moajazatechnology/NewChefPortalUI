import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/_services/dataservice';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public userInfo: any = {};
  public cuisineNames: any = [];
  public showLoader:boolean = true;

  constructor(
    private dialog: MatDialog,
    private _dataService: DataService) { }

  ngOnInit(): void {

    this.getCurrentChefInfo();
    this.getCusineList();
  }

  getCurrentChefInfo() {

    this._dataService.getChefInfo({url:'chef', isLoader:true})
    .subscribe(response => {
      this.userInfo = response;
      this.showLoader = false;
    });
  }

  getCusineList() {
    this._dataService.getAll({url:'chef/chef_store/cuisines', isLoader:true})
    .subscribe(response => {
      this.cuisineNames = response[0]._cuisines as any;
    });
  }

  editChefPassword(type) {
    this.openDialog(type);
  }

  editChefEmail(type) {
    this.openDialog(type);
  }

  editChefPhoneNo(type) {
    this.openDialog(type);
  }

  editChefStoreAddress(type) {
    this.openDialog(type);
  }

  editChefBiography(type) {
    this.openDialog(type);
  }

  editChefProfile(type) {
    this.openDialog(type);
  }

  editChefBanner(type) {
    this.openDialog(type);
  }

  editChefCuisine(type) {
    
    let data = {type:type,profile_data:this.userInfo,cuisineNames:this.cuisineNames};
    let dialogRef = this.dialog.open(EditProfileComponent, { 
      width:'500px',
      height:'auto',
      disableClose:true,
      data:data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N') {
        this.getCurrentChefInfo();
        this.getCusineList();
      }
    });
  }

  editCollectionDelivery(type) {
    this.openDialog(type);
  }

  editCollectionSlots(type) {
    this.openDialog(type);
  }

  editDeliverySlots(type) {
    this.openDialog(type);
  }

  editChefMinimunOrder(type) {
    this.openDialog(type);
  }
  
  openDialog(type) {
    let data = {type:type,profile_data:this.userInfo,cuisineNames: []};
    let dialogRef = this.dialog.open(EditProfileComponent, { 
      width:'500px',
      height:'auto',
      disableClose:true,
      data:data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N') {
        this.getCurrentChefInfo();
      }
    });
  }
}
