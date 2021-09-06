import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  public payment_status: any = {};
  public loader: boolean = false;


  constructor(
    private _dataService: DataService,
    private _matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.getPaymentStatus();
  }

  getPaymentStatus() {

    this._dataService.getAll({url:'chef/stripe/account', isLoader:true})
    .subscribe(res => {
      this.payment_status = res;
    })
  }

  paymentSignup() {
    this.loader = true;
    this._dataService.getAll({url:'chef/stripe/account_link', isLoader:true})
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
