import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-chef-payment',
  templateUrl: './chef-payment.component.html',
  styleUrls: ['./chef-payment.component.scss']
})
export class ChefPaymentComponent implements OnInit {
  id:any;
  payment_status :any = {};
  public loader: boolean = false;
  showLoader : boolean;
  userInfo : any ={};
  
  constructor(private dataservice:DataService,private _activatedRoute:ActivatedRoute,
    private _matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(
      (res:any)=>{
        this.id = res['chef_id']
      }
    );

    sessionStorage.setItem("chef_Id",this.id);
    this.getPaymentStatus();
    this.getCurrentChefInfo();
  }

  getCurrentChefInfo() {

    this.dataservice.getChefInfo({url:'chef?chef_id=' + this.id , isLoader:true})
    .subscribe(response => {
      this.userInfo = response;
      this.showLoader = false;
    });
  }

  getPaymentStatus(){
      this.dataservice.getAll({url:'chef/stripe/account?chef_id='+this.id,isLoader:true}).subscribe(
        (res:any)=>{
          console.log("PAYMENTS RESPONCE ======>",res);
          this.payment_status = res;
        }
      )
  }



  paymentSignup() {
    this.loader = true;
    this.dataservice.getAll({url:'chef/stripe/account_link', isLoader:true})
    .subscribe(res => {
      
      this.getNewWindow(res.url);
      this.loader = false; 
    },
    error => {
       // Show the error message
       this.loader = false;
        this._matSnackBar.open(error.message, 'RETRY', {
          verticalPosition: 'bottom',
          horizontalPosition:'center',
          duration        : 2000
      });
    });
  }

  getNewWindow( url: any) {
    let pdfWindow: Window = window.open(url, "_blank", "top=0,left=0,fullscreen=yes,scrollbars=yes,resizable=yes,width=" + screen.width + ",height=" + (screen.height - 100));
  }
}
