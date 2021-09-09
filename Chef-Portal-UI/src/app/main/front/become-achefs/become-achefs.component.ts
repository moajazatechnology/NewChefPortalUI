import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import { CommonUtils } from 'src/app/_helpers/common.utils';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-become-achefs',
  templateUrl: './become-achefs.component.html',
  styleUrls: ['./become-achefs.component.scss']
})
export class BecomeAChefsComponent implements OnInit {

  @ViewChild('existsUsername', {static: true})
  existsUsername: ElementRef;

  @ViewChild('existsPhoneno', {static: true})
  existsPhoneno: ElementRef;

  public isSubmit: boolean = false;

  becomechefsForm= new FormGroup({
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
        if(!this.becomechefsForm.get('email').errors){
          // this.isSearching = true;
          this._dataService.checkAlreadyExist({url:'chef/check_email', data:{'email':userNameString}}).subscribe((res)=>{
            
              if(res.email_available==false){
                this.userNameReqmsg =  'This Email is already registered.Please,try another email';
                this.becomechefsForm.get('email').setErrors({'incorrect': true});
                this.becomechefsForm.get('email').markAsTouched();
              }
              else{
                this.userNameReqmsg = "Email is required!";
                this.becomechefsForm.get('email').setErrors(null);
              }
          // this.isSearching = false;
          },(err)=>{
            // this.isSearching = false;
          });
        }
        else if(this.becomechefsForm.get('email').errors.email){
          this.userNameReqmsg = "Email is invalid!";
        }
        else{
          this.userNameReqmsg = "Email is required!";
          this.becomechefsForm.get('email').setErrors(null);
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
        if(!this.becomechefsForm.get('phone_number').errors){
          // this.isSearching = true;
          this._dataService.checkAlreadyExist({url:'chef/check_phone', data:{'phone_number':phonenoString}}).subscribe((res)=>{
            
              if(res.phone_available==false){
                this.phoneNoReqmsg =  'This Phone no is already registered.Please,try another Phone no';
                this.becomechefsForm.get('phone_number').setErrors({'incorrect': true});
                this.becomechefsForm.get('phone_number').markAsTouched();
              }
              else{
                this.phoneNoReqmsg = "Phone no is required!";
                this.becomechefsForm.get('phone_number').setErrors(null);
              }
          // this.isSearching = false;
          },(err)=>{
            // this.isSearching = false;
          });
        }
        else if(this.becomechefsForm.get('phone_number').errors.pattern){
          this.phoneNoReqmsg = "Please, Enter 10 digit Mobile Number.";
        }
        else{
          this.phoneNoReqmsg = "Phone no is required!";
          this.becomechefsForm.get('phone_number').setErrors(null);
        }
    });
  }

  onSubmit(event){

    event.preventDefault();
    event.stopPropagation();
    if (this.becomechefsForm.valid)
    {
      this.isSubmit = true;
      let formValue = this.becomechefsForm.value

      this._dataService.post({url:'auth/create_chef',data:formValue,isLoader:true})
        .pipe(first())
        .subscribe(
            data => {
                // Show the success message
                this._matSnackBar.open('Success!', '', {
                    verticalPosition: 'bottom',
                    horizontalPosition:'center',
                    duration        : 2000
                });
                this._router.navigate(['/auth/login']);
                 this.isSubmit = false;
            },
            error => {
                // Show the error message
                this._matSnackBar.open('Error signing up', '', {
                    verticalPosition: 'bottom',
                    horizontalPosition:'center',
                    duration        : 2000
                });
                this.becomechefsForm.reset();
      });
    }else{
      CommonUtils.validateAllFormFields(this.becomechefsForm);
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


