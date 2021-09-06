import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import { CommonUtils } from 'src/app/_helpers/common.utils';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-customer-signup',
  templateUrl: './customer-signup.component.html',
  styleUrls: ['./customer-signup.component.scss']
})
export class CustomerSignupComponent implements OnInit {

  toggle_options = {disabled: false, checked:true};
  toggleEmailCommunication(ev: MatSlideToggleChange) {
    this.toggle_options.checked = ev.checked;
  }
  
  @ViewChild('existsUsername', {static: true})
  existsUsername: ElementRef;

  @ViewChild('existsPhoneno', {static: true})
  existsPhoneno: ElementRef;

  public isSubmit: boolean = false;

  customersForm= new FormGroup({
    first_name: new FormControl('', Validators.required),
    second_name: new FormControl('', Validators.required),
    phone_number: new FormControl('', [Validators.required,Validators.pattern("^((\\+44-?)|0)?[0-9]{10}$")]),
    password: new FormControl('', [Validators.required,Validators.minLength(8)]),
    confirm_password: new FormControl('',[Validators.required, confirmPasswordValidator]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  pwdhide:boolean = true;
  cpwdhide: boolean = true;
  userNameReqmsg:string="Email is required!";
  phoneNoReqmsg:string="Phone no is required!";

  constructor(
    private _formBuilder:FormBuilder,
    private _router:Router,
    private _matSnackBar: MatSnackBar,
    private _dataService:DataService
  ) { }

  ngOnInit(): void {
    //email check exists on add / edit form
    fromEvent(this.existsUsername.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      ,filter(res => res.length > 2)
      ,debounceTime(500)        
      ,distinctUntilChanged()
      // subscription for response
      ).subscribe((userNameString: string) => {
        if(!this.customersForm.get('email').errors){
          // this.isSearching = true;
          this._dataService.checkAlreadyExist({url:'chef/check_email', data:{'email':userNameString}}).subscribe((res)=>{
            
              if(res.email_available==false){
                this.userNameReqmsg =  'This Email is already registered.Please,try another email';
                this.customersForm.get('email').setErrors({'incorrect': true});
                this.customersForm.get('email').markAsTouched();
              }
              else{
                this.userNameReqmsg = "Email is required!";
                this.customersForm.get('email').setErrors(null);
              }
          // this.isSearching = false;
          },(err)=>{
            // this.isSearching = false;
          });
        }
        else if(this.customersForm.get('email').errors.email){
          this.userNameReqmsg = "Email is invalid!";
        }
        else{
          this.userNameReqmsg = "Email is required!";
          this.customersForm.get('email').setErrors(null);
        }
    });

    //phone no check exists on add / edit form
    fromEvent(this.existsPhoneno.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      ,filter(res => res.length > 2)
      ,debounceTime(500)        
      ,distinctUntilChanged()
      // subscription for response
      ).subscribe((phonenoString: string) => {
        if(!this.customersForm.get('phone_number').errors){
          // this.isSearching = true;
          this._dataService.checkAlreadyExist({url:'chef/check_phone', data:{'phone_number':phonenoString}}).subscribe((res)=>{
            
              if(res.phone_available==false){
                this.phoneNoReqmsg =  'This Phone no is already registered.Please,try another Phone no';
                this.customersForm.get('phone_number').setErrors({'incorrect': true});
                this.customersForm.get('phone_number').markAsTouched();
              }
              else{
                this.phoneNoReqmsg = "Phone no is required!";
                this.customersForm.get('phone_number').setErrors(null);
              }
          // this.isSearching = false;
          },(err)=>{
            // this.isSearching = false;
          });
        }
        else if(this.customersForm.get('phone_number').errors.pattern){
          this.phoneNoReqmsg = "Please, Enter 10 digit Mobile Number.";
        }
        else{
          this.phoneNoReqmsg = "Phone no is required!";
          this.customersForm.get('phone_number').setErrors(null);
        }
    });
  }

  onSubmit(event){
    this.toggle_options.disabled = true;
    // event.preventDefault();
    // event.stopPropagation();
    if (this.customersForm.valid)
    {
      this.isSubmit = true;
      let formValue = this.customersForm.value
      formValue.enable_emails = this.toggle_options.checked;
      this._dataService.customerpost({url:'auth/create_customer',data:formValue,isLoader:true})
        .pipe(first())
        .subscribe(
            data => {
                // Show the success message
                this._matSnackBar.open('Success!', '', {
                    verticalPosition: 'bottom',
                    horizontalPosition:'center',
                    duration        : 2000
                });
                this._router.navigate(['/customer-login']);
                 this.isSubmit = false;
                 this.customersForm.reset();
            },
            error => {
                // Show the error message
                this._matSnackBar.open(error.error.message, '', {
                    verticalPosition: 'bottom',
                    horizontalPosition:'center',
                    duration        : 4000
                });
      });
    }else{
      CommonUtils.validateAllFormFields(this.customersForm);
    }
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

