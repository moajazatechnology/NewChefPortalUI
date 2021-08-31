import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/_services/dataservice';
import { EditProfileComponent } from '../../chefs/profile/edit-profile/edit-profile.component';

@Component({
  selector: 'app-chefs-profile',
  templateUrl: './chefs-profile.component.html',
  styleUrls: ['./chefs-profile.component.scss']
})
export class ChefsProfileComponent implements OnInit {

  public userInfo: any = {};
  public cuisineNames: any = [];
  public showLoader:boolean = true;
  public chef_id: any = 0;

  constructor(
    private dialog: MatDialog,
    private _dataService: DataService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.chef_id = this.route.snapshot.params.id;
    sessionStorage.setItem("chef_Id",this.chef_id);

    if(this.chef_id) {

      this.getCurrentChefInfo();
      this.getCusineList();
    }
  }

  getCurrentChefInfo() {

    this._dataService.getChefInfo({url:'chef?chef_id=' + this.chef_id, isLoader:true})
    .subscribe(response => {
      this.userInfo = response;
      this.showLoader = false;
    });
  }

  getCusineList() {
    this._dataService.getAll({url:'chef/chef_store/cuisines?chef_id='+this.chef_id, isLoader:true})
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
