import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-single-order',
  templateUrl: './customer-single-order.component.html',
  styleUrls: ['./customer-single-order.component.scss']
})
export class CustomerSingleOrderComponent implements OnInit {

  order:any = {};

  constructor( 
    public dialogRef: MatDialogRef<CustomerSingleOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data  : any) {
      this.order = this.data;
     }

  ngOnInit(): void {
  }

}
