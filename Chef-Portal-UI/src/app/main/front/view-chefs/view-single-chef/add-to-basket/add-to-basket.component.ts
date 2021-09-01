import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-to-basket',
  templateUrl: './add-to-basket.component.html',
  styleUrls: ['./add-to-basket.component.scss']
})
export class AddToBasketComponent implements OnInit {

  product:any = {};
  count: number = 1;
  productTotalPrice: number = 0;
  maxNo: boolean = false;
  checkedProductVariantOptions: any = [];

  constructor(
    public dialogRef: MatDialogRef<AddToBasketComponent>,
    @Inject(MAT_DIALOG_DATA) public data  : any) { }

  ngOnInit(): void {
    this.product = this.data;
    this.productTotalPrice = this.product.price;
    this.checkedProductVariantOptions = [];

    this.addCheckedOptions();
  }

  addCheckedOptions() {

    this.product.variants?.forEach((variant,indx) => {
      variant?.options.forEach((element,index) => {
        
        if(element.default) {
          this.checkedProductVariantOptions.push(variant);
          this.checkedProductVariantOptions[indx]['checkedOptions']=[(variant.options[index])];
          this.productTotalPrice = this.productTotalPrice + variant.options[index].price;
        }
      });
    });
    console.log(this.checkedProductVariantOptions);
  }
  
  changeCheckboxSelection(varient,variantIdx, optionId, idx, event) {
    console.log(varient);
    console.log(idx);
    console.log(event);
    varient.options[idx].default = event.checked;
    console.log(variantIdx);

    if(event.checked) {

      if(varient.single_selection) {
        varient.options.forEach((element,index) => {
          
          if(optionId !==element.id){
            if(element.default){
              element.default = false;
              this.productTotalPrice = this.productTotalPrice - varient.options[idx].price;
            
            }else {

              this.checkedProductVariantOptions.forEach((variant,indx) => {
                variant?.checkedOptions.forEach((element,index) => {
                  
                  if(!element.default) {
                    this.productTotalPrice = this.productTotalPrice - varient.options[idx].price;
                    this.checkedProductVariantOptions[indx]['checkedOptions'].splice(index,1);
                  }
                });
              });

            }
          }
        });
        varient.options[idx].default = true;
        this.productTotalPrice = this.productTotalPrice + varient.options[idx].price;
      }else {

        let limit = 0;
        varient.options.forEach((element) => {
          if(element.default){
            limit = limit+1;
          }
        });

        console.log(limit);

        if(varient.max_selection >= limit) {
          this.productTotalPrice = this.productTotalPrice + varient.options[idx].price;
        }else {
          varient.options.forEach((element,index) => {
            if(optionId !==element.id){
              if(element.default){
                element.default = false;
                this.productTotalPrice = this.productTotalPrice - varient.options[idx].price;
            
              }else {

                this.checkedProductVariantOptions.forEach((variant,indx) => {
                  variant?.checkedOptions.forEach((element,index) => {
                    
                    if(!element.default) {

                      this.productTotalPrice = this.productTotalPrice - varient.options[idx].price;
                      this.checkedProductVariantOptions[indx]['checkedOptions'].splice(index,1);
                    }
                  });
                });
                
              }
            }
          });
          varient.options[idx].default = true;
          this.productTotalPrice = this.product.price + varient.options[idx].price;
        }
      }
      let duplicateVariant = this.checkedProductVariantOptions.find(v => v.id === varient.id);

      if(duplicateVariant) {
        let index = 0;
        this.checkedProductVariantOptions.forEach((element,indx) => {
          if(element.id=== varient.id){
            index = indx;
          }
        });
        this.checkedProductVariantOptions[index]['checkedOptions'].push(varient.options[idx]);
      }else{
        this.checkedProductVariantOptions.push(varient);
        let index = 0;
        this.checkedProductVariantOptions.forEach((element,indx) => {
          if(element.id=== varient.id){
            index = indx;
          }
        });
        console.log(this.checkedProductVariantOptions);
        this.checkedProductVariantOptions[index]['checkedOptions'] = [(varient.options[idx])];
      }

    }

  }

  addToBasket(product) {
    product['totalPrice'] = this.productTotalPrice;
    product['checkedProductVariantOptions'] = this.checkedProductVariantOptions;
    this.dialogRef.close(product);
  }

}
