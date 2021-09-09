import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServerURL } from 'src/app/_helpers';
import { CommonUtils } from 'src/app/_helpers/common.utils';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-add-new-address',
  templateUrl: './add-new-address.component.html',
  styleUrls: ['./add-new-address.component.scss']
})
export class AddNewAddressComponent implements OnInit {

  addNewAddressFormGroup: FormGroup;
  isSubmit: boolean = false;
  loader = false;

  constructor(private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddNewAddressComponent>,
    private dataService: DataService,
    private _matSnackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data  : any) { }

  ngOnInit() {

    this.createFormGroup();
    
    
  }

  createFormGroup() {

    let address_id = 0;
    let address_1 = '';
    let address_2 = '';
    let address_3 = '';
    let city = '';
    let country = '';
    let postcode = '';

    if(this.data) {
        address_id = this.data.id ? this.data.id : 0;
        address_1 = this.data.address_1 ? this.data.address_1 : '';
        address_2 = this.data.address_2 ? this.data.address_2 : '';
        address_3 = this.data.address_3 ? this.data.address_3 : '';
        city = this.data.city ? this.data.city : '';
        country = this.data.country ? this.data.country : '';
        postcode = this.data.postcode ? this.data.postcode : '';
    }
    this.addNewAddressFormGroup = this._fb.group({
      address_id:this._fb.control(address_id),
      address_1: this._fb.control(address_1,[Validators.required]),
      address_2: this._fb.control(address_2),
      address_3: this._fb.control(address_3),
      city: this._fb.control(city,[Validators.required]),
      country: this._fb.control(country,[Validators.required]),
      postcode: this._fb.control(postcode,[Validators.required])
    });
  }

  createAddress() {

    if(this.addNewAddressFormGroup.valid){
       
      this.isSubmit = true;
      this.loader = true;
      let url = this.data ? 'profile/address/update' :'profile/address/create';
      this.dataService.create({url: ServerURL.SERVER_URL_ENDPOINT_CUSTOMER + url, data:this.addNewAddressFormGroup.value, isLoader:true})
      .subscribe(
       data => {
         // Show the success message
         this._matSnackBar.open('Address created', 'CLOSE', {
             verticalPosition: 'bottom',
             horizontalPosition:'center',
             duration        : 2000
         });
          this.isSubmit = false;
          this.dialogRef.close();
       },
       error => {
           // Show the error message
           this._matSnackBar.open(error.error.message, 'Retry', {
               verticalPosition: 'bottom',
               horizontalPosition:'center',
               duration        : 2000
           });
       });
    }else {
      CommonUtils.validateAllFormFields(this.addNewAddressFormGroup);
    }
    
  }

}
