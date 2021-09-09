import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-quantity',
  templateUrl: './add-quantity.component.html',
  styleUrls: ['./add-quantity.component.scss']
})
export class AddQuantityComponent implements OnInit {

  public count: number = 1;
  public productTotalPrice: number = 0
  isTooltipshow: boolean = false;
  public product;

  constructor(
    public dialogRef: MatDialogRef<AddQuantityComponent>,
    @Inject(MAT_DIALOG_DATA) public data  : any) { }

  ngOnInit(): void {
    this.product = this.data;
    this.productTotalPrice = this.product.totalPrice;
  }

  increaseDecreaseCount(type) {
    
    if(type === 'decrease') {

      if(this.count > 1){
        this.count = this.count - 1;
        this.productTotalPrice -= this.product.totalPrice;
      }
    }else if(type === 'increase') {
      
      if(this.product.limited) {
        if(this.product.inventory_count > this.count) {
          this.count = this.count + 1;
          this.productTotalPrice += this.product.totalPrice;
        }else{
          this.isTooltipshow = true;
        }

      }else {
        this.count = this.count + 1;
        this.productTotalPrice += this.product.totalPrice;
      }
     
    }
  }

  addQuantity() {
    let product = this.product
    product['productTotalPrice'] = this.productTotalPrice;
    product['count'] = this.count;
    this.dialogRef.close(product);
  }
}
