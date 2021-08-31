import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServerURL } from 'src/app/_helpers';
import { DataService } from 'src/app/_services/dataservice';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AddEditAddressComponent } from './add-edit-address/add-edit-address.component';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {

  allAddressList: any  = [];
  customerDetails: any = {};
  showLoader: boolean = true;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private _matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // this.getAddresses();
    this.getProfileDetails();
  }

  getProfileDetails() {

    this.dataService.getCustomerDetails({url: 'profile/details' , isLoader:true})
     .subscribe(res => {
       this.customerDetails = res as any;
       localStorage.setItem('customerInfo', JSON.stringify(res));
       this.showLoader = false;
       console.log(res);
     });
  }

  getAddresses() {

    this.dataService.getAllList({url: 'checkout/addresses' ,data:{chef_id:1}, isLoader:true})
     .subscribe(res => {
       let response = res as any;
       this.allAddressList = response.eligible;
       console.log(res);
     });
  }

  addNewAddress() {
    let dialogRef = this.dialog.open(AddEditAddressComponent, {
      data:null,
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N') {
        this.getAddresses();
      }
    });
  }
  
  editprofileData(type) {
    let dialogRef = this.dialog.open(AddEditAddressComponent, {
      data: {data:this.customerDetails, type:type},
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N') {
        this.getProfileDetails();
      }
    });
  }

   /**Delete Selected**/
   deleteSelectedAddress(id) {

    let message = 'Are you want delete this address?'
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '400px', data: message, disableClose: true })
       .afterClosed().subscribe(result => {
         if (result == 'YES') {
          // this.showLoader = true;
           this.deleteData(id);
         }
       });
   }
 
   deleteData(id) {

     this.dataService.deleteRecord({ url: ServerURL.SERVER_URL_ENDPOINT_CUSTOMER + 'profile/address/delete/' + id, isLoader: true })
       .subscribe((response: any) => {
        //  if(response === {}){
            // Show the success message
            this._matSnackBar.open('Address deleted successfully', 'CLOSE', {
              verticalPosition: 'bottom',
              horizontalPosition:'center',
              duration        : 2000
            });
            this.getAddresses();
        //  }
      });
   }

}
