import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { DataService } from 'src/app/_services/dataservice';
import { EditChefProfileComponent } from './edit-chef-profile/edit-chef-profile.component';

@Component({
  selector: 'app-view-chef-profile',
  templateUrl: './view-chef-profile.component.html',
  styleUrls: ['./view-chef-profile.component.scss']
})
export class ViewChefProfileComponent implements OnInit {

  id;
  chefInfo: any = {};

  constructor(
    private route: ActivatedRoute,
    private _matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private _dataService: DataService) { 
    let data =  this.route.snapshot.params;
    this.id = data.id
    // this.getcurrentChef(data.id);
  }

  ngOnInit(): void {
    this.getcurrentChef(this.id);
  }

  getcurrentChef(id) {

    this._dataService.getWithBody({url:'chef?chef_id=' +id,isLoader:true})
      .pipe(first())
      .subscribe(
          data => {
              // Show the success message
              this.chefInfo = data;
          },
          error => {
              // Show the error message
              this._matSnackBar.open(error.error.message, 'Retry', {
                  verticalPosition: 'bottom',
                  horizontalPosition:'center',
                  duration        : 2000
              });
      });
  }

  editChefCommission(type) {
    this.openDialog(type);
  }

  editChefMaximumRadius(type) {
    this.openDialog(type);
  }
  
  openDialog(type) {
    let data = {type:type,profile_data:this.chefInfo};
    let dialogRef = this.dialog.open(EditChefProfileComponent, { 
      width:'500px',
      height:'auto',
      disableClose:true,
      data:data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N') {
        this.getcurrentChef(this.id);
      }
    });
  }

}
