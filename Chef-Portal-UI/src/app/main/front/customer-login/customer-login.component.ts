import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { CommonUtils } from 'src/app/_helpers/common.utils';
import { AuthService } from 'src/app/_services';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.scss']
})
export class CustomerLoginComponent implements OnInit {

  loginForm:FormGroup;
  pwdhide = true;
  public isSubmit: boolean = false;
  public loading: boolean = false;
  data: any = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _matSnackBar: MatSnackBar,
    private route: ActivatedRoute,
    private dataService: DataService,
    private authenticationService: AuthService,
    ) {

      this.data =  this.route.snapshot.params;
        // redirect to home if already logged in
      //   if (this.authenticationService.currentUserValue) { 
      //     this._router.navigate(['admin/dashboard']);
      // }
    }
// -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     ngOnInit(): void
     {
         this.loginForm = this._formBuilder.group({
             email   : ['', [Validators.required, Validators.email]],
             password: ['', Validators.required]
         });
     }
    onLogin(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.loginForm.valid)
      {
          this.isSubmit = true; 
          this.loading = true;
          let formValue = this.loginForm.value

        this.authenticationService.customerLogin(formValue.email, formValue.password,)
          .pipe(first())
          .subscribe(
              data => {
                  this.isSubmit = false;
                  this.loading = false;
                  this.getProfileDetails();
                 
              },
              error => {
                  this.isSubmit = false;
                  this.loading = false;
                  // Show the error message
                  this._matSnackBar.open('Incorrect username or password', 'Retry', {
                      verticalPosition: 'bottom',
                      horizontalPosition:'center',
                      duration        : 2000
                  });
                  this.loginForm.reset();
          });
      }else{
        CommonUtils.validateAllFormFields(this.loginForm);
      }

     }

     getProfileDetails() {

      this.dataService.getCustomerDetails({url: 'profile/details' , isLoader:true})
       .subscribe(res => {
          localStorage.setItem('customerInfo', JSON.stringify(res));
           // Show the success message
           this._matSnackBar.open('Login successfully', 'CLOSE', {
            verticalPosition: 'bottom',
            horizontalPosition:'center',
            duration        : 2000
        });

        if(this.data.type === 'checkout'){
          this._router.navigate(['/checkout']);
        }else {
          this._router.navigate(['/customer/profile']);
        }
          
         console.log(res);
       });
    }
}

