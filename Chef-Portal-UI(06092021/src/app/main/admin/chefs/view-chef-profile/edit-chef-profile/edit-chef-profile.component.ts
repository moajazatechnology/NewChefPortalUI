import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { CommonUtils } from 'src/app/_helpers/common.utils';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-edit-chef-profile',
  templateUrl: './edit-chef-profile.component.html',
  styleUrls: ['./edit-chef-profile.component.scss']
})
export class EditChefProfileComponent implements OnInit {

  editCommissionForm: FormGroup;
  editMaximumradiusForm: FormGroup;
  isSubmit: boolean = false;
  loader: boolean = false;
  message: string = '';
  data: any = {};

  constructor(
    public dialogRef: MatDialogRef<EditChefProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private _fb: FormBuilder,
    private _matSnackBar:MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private _dataService :DataService,
     ) {
       this.data = this._data;
       console.log(this.data)
     }

  ngOnInit(): void {
    if(this.data.type === 'commission') {
      this.message = 'Edit Commission';
      this.EditCommissionFormGroup();
    }else if(this.data.type === 'maximumradius'){
      this.message = 'Edit Maximum radius';
      this.EditMaximumRadiusFormGroup();
    }
  }

  EditCommissionFormGroup() {

    this.editCommissionForm = this._fb.group({
      chef_id: this._fb.control(this.data.id),
      commission: this._fb.control('',[Validators.required,Validators.pattern("^([0-9]{1,2}){1}(\.[0-9]{1,2})?$")])


    });
  }

  EditMaximumRadiusFormGroup() {

    this.editMaximumradiusForm = this._fb.group({
      chef_id: this._fb.control(this.data.id),
      radius: this._fb.control('',[Validators.required,Validators.pattern("^[1-9]*$")])

    });
  }

  transformAmounttoPercentage(element) {
    let formattedAmount = this.editCommissionForm.get('commission').value + '%';

    element.target.value = formattedAmount;
  }

  commissionSubmit(event) {

    event.preventDefault();
    event.stopPropagation();
    if(this.editCommissionForm.valid) {
      this.loader = true;
      this.isSubmit = true
      let message = 'Commission Edited Successfully';
      this.postAPIResponse('admin/chef/set_commision', this.editCommissionForm.value, message);
    }else{
      CommonUtils.validateAllFormFields(this.editCommissionForm);
    }
  }

  radiusSubmit(event) {

    event.preventDefault();
    event.stopPropagation();
    if(this.editMaximumradiusForm.valid) {
      this.loader = true;
      this.isSubmit = true
      let message = 'Maximum radius Edited Successfully';
      this.postAPIResponse('admin/chef/set_radius', this.editMaximumradiusForm.value, message);
    }else{
      CommonUtils.validateAllFormFields(this.editMaximumradiusForm);
    }    
  }

  postAPIResponse(url, value, message){

    this._dataService.save({url:url,data:value,isLoader:true})
      .pipe(first())
      .subscribe(
          data => {
              // Show the success message
              this._matSnackBar.open(message, 'CLOSE', {
                verticalPosition: 'bottom',
                horizontalPosition:'center',
                duration        : 2000
              });
              this.dialogRef.close();
              this,this.isSubmit = false;
          },
          error => {
              // Show the error message
              this.loader = false;
              this.isSubmit = false;
              this._matSnackBar.open(error.error.message, 'Retry', {
                  verticalPosition: 'bottom',
                  horizontalPosition:'center',
                  duration        : 2000
              });
      });
  }
}
