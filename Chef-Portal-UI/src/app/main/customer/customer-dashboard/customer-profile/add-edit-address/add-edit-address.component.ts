import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServerURL } from 'src/app/_helpers';
import { CommonUtils } from 'src/app/_helpers/common.utils';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-add-edit-address',
  templateUrl: './add-edit-address.component.html',
  styleUrls: ['./add-edit-address.component.scss']
})
export class AddEditAddressComponent implements OnInit {

  addNewAddressFormGroup: FormGroup;
  editNameFormGroup: FormGroup;
  editEmailFormGroup: FormGroup;
  editPhoneNoFormGroup: FormGroup;
  editPasswordFormGroup: FormGroup;
  isSubmit: boolean = false;
  pwdhide: boolean = true;
  cpwdhide: boolean = true;
  loader = false;
  message: string = '';
  data: any = {};
  type;

  constructor(private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditAddressComponent>,
    private dataService: DataService,
    private _matSnackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public _data  : any) { 

      this.data = this._data.data;
      this.type = this._data.type;
    }

  ngOnInit() {

    if(this.type==='address') {

      this.message = 'Create new address';
      this.createAddressFormGroup();
    
    }else if(this.type==='name') {

      this.message = 'Edit Customer Name';
      this.createNameFormGroup();
    }else if(this.type==='email') {

      this.message = 'Edit Customer Email';
      this.createEmailFormGroup();
    }else if(this.type==='phone') {

      this.message = 'Edit Customer Phone number';
      this.createPhoneNoFormGroup();
    }else if(this.type==='password') {

      this.message = 'Edit Customer Password';
      this.createPasswordFormGroup();
    }
    
  }

  createNameFormGroup() {

    let first_name = '';
    let second_name = '';

    if(this.data) {
        first_name = this.data.first_name ? this.data.first_name : '';
        second_name = this.data.second_name ? this.data.second_name : '';
    }
    this.editNameFormGroup = this._fb.group({
      first_name: this._fb.control(first_name,[Validators.required]),
      second_name: this._fb.control(second_name,[Validators.required]),
    });
      
  }

  createEmailFormGroup() {

    let email = '';

    if(this.data) {
        email = this.data.email ? this.data.email : '';
    }
    this.editEmailFormGroup = this._fb.group({
      email: this._fb.control(email,[Validators.required, Validators.email]),
    });
      
  }

  createPhoneNoFormGroup() {

    let phone_number = '';

    if(this.data) {
      phone_number = this.data.phone_number ? this.data.phone_number : '';
    }
    this.editPhoneNoFormGroup = this._fb.group({
      phone_number: this._fb.control(phone_number,[Validators.required,Validators.pattern("^((\\+44-?)|0)?[0-9]{10}$")]),
    });
      
  }

  createPasswordFormGroup() {

    let password = '';
    let confirm_password = '';

    if(this.data) {
      password = this.data.password ? this.data.password : '';
      confirm_password = this.data.confirm_password ? this.data.confirm_password : '';
    }
    this.editPasswordFormGroup = this._fb.group({
      password: this._fb.control(password,[Validators.required]),
      confirm_password: this._fb.control(confirm_password,[Validators.required]),
    });
      
  }

  createAddressFormGroup() {

    let address_id = 0;
    let address_1 = '';
    let address_2 = '';
    let address_3 = '';
    let city = '';
    let country = '';
    let postcode = '';
    let county

    if(this.data) {
        address_id = this.data.id ? this.data.id : 0;
        address_1 = this.data.address_1 ? this.data.address_1 : '';
        address_2 = this.data.address_2 ? this.data.address_2 : '';
        address_3 = this.data.address_3 ? this.data.address_3 : '';
        city = this.data.city ? this.data.city : '';
        country = this.data.country ? this.data.country : '';
        county = this.data.county ? this.data.county : '';
        postcode = this.data.postcode ? this.data.postcode : '';
    }
    this.addNewAddressFormGroup = this._fb.group({
      address_id:this._fb.control(address_id),
      address_1: this._fb.control(address_1,[Validators.required]),
      address_2: this._fb.control(address_2),
      address_3: this._fb.control(address_3),
      city: this._fb.control(city,[Validators.required]),
      county: this._fb.control(county),
      country: this._fb.control(country,[Validators.required]),
      postcode: this._fb.control(postcode,[Validators.required])
    });
  }

  onClickEditName() {

    if(this.editNameFormGroup.valid){
       
      let url = 'profile/update_name';
      let message = 'Name updated successfully';
      this.postAPIToData(url, this.editNameFormGroup.value, message);
    }else {
      CommonUtils.validateAllFormFields(this.editNameFormGroup);
    }

  }

  emailSubmit() {

    if(this.editEmailFormGroup.valid){
       
      let url = 'profile/update_email';
      let message = 'Email updated successfully';
      this.postAPIToData(url, this.editEmailFormGroup.value, message);
    }else {
      CommonUtils.validateAllFormFields(this.editEmailFormGroup);
    }

  }

  phoneNumberSubmit() {

    if(this.editPhoneNoFormGroup.valid){
       
      let url = 'profile/update_phone';
      let message = 'Phone updated successfully';
      this.postAPIToData(url, this.editPhoneNoFormGroup.value, message);
    }else {
      CommonUtils.validateAllFormFields(this.editPhoneNoFormGroup);
    }

  }

  passwordSubmit() {

    if(this.editPasswordFormGroup.valid){
       
      let url = 'profile/update_password';
      let message = 'password updated successfully';
      this.postAPIToData(url, this.editPasswordFormGroup.value, message);
    }else {
      CommonUtils.validateAllFormFields(this.editPasswordFormGroup);
    }

  }

  createAddress() {

    if(this.addNewAddressFormGroup.valid){
       
      let url = this.data ? 'profile/address/update' :'profile/address/create';
      let message = this.data ? 'Address updated successfully' :'Address created successfully';
      this.postAPIToData(url, this.addNewAddressFormGroup.value, message);
    }else {
      CommonUtils.validateAllFormFields(this.addNewAddressFormGroup);
    }
    
  }

  postAPIToData(url, data, message) {

    this.isSubmit = true;
    this.loader = true;
    this.dataService.create({url: ServerURL.SERVER_URL_ENDPOINT_CUSTOMER + url, data:data, isLoader:true})
    .subscribe(
      data => {
        // Show the success message
        this._matSnackBar.open(message, 'CLOSE', {
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

  }

}
/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
 export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if ( !control.parent || !control )
  {
      return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('confirm_password');

  if ( !password || !passwordConfirm )
  {
      return null;
  }

  if ( passwordConfirm.value === '' )
  {
      return null;
  }

  if ((password && password.value && password.value.trim()) === (passwordConfirm && passwordConfirm.value && passwordConfirm.value.trim()))
  {
      return null;
  }

  return {passwordsNotMatching: true};
};
