import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ChefsModule } from 'src/app/main/chefs/chefs.module';
import { ConfirmDialogComponent } from 'src/app/main/shared/components/confirm-dialog/confirm-dialog.component';
import { ServerURL } from 'src/app/_helpers';
import { DataService } from 'src/app/_services/dataservice';
import { AddQuantityComponent } from './add-quantity/add-quantity.component';
import { AddToBasketComponent } from './add-to-basket/add-to-basket.component';

@Component({
  selector: 'app-view-single-chef',
  templateUrl: './view-single-chef.component.html',
  styleUrls: ['./view-single-chef.component.scss']
})
export class ViewSingleChefComponent implements OnInit {

  public singleChefInfo:any = {};
  public dateArr: any = [];
  public selectedDate: Date = new Date();
  public showHideBasketBtn: boolean = true;
  public showHideMobileBasket: boolean = false;
  public isTooltipshow: boolean = false;
  public basketProductList: any = [];
  public showFilteredProductList: any = [];
  public chefsAvailableDate: any = [];
  public totalPrice: number = 0;
  public chef_id: number = 0;
  public customerToken: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if (window.screen.width < 800) { // 800px portrait
      if(this.showHideBasketBtn) {
        this.showHideBasketBtn = false;
        this.showHideMobileBasket = true;
      }else {
        this.showHideBasketBtn = false;
      }
    }else {
        if(this.showHideMobileBasket) {
          this.showHideMobileBasket = false;
          this.showHideBasketBtn = true;
        }
    }
    console.log(window.screen.width);
  
  }


  constructor(private dataService: DataService,
    private dialog:MatDialog,
    private router: Router,
    private _matSnackBar: MatSnackBar,
    private route: ActivatedRoute) {      
      this.customerToken = localStorage.getItem('customertoken');
      this.getScreenSize();
    }

  ngOnInit(): void {
    let data =  this.route.snapshot.params;
    this.getSingleChefInfo(data.id);

    console.log(window.screen.width);

    if (window.screen.width < 800) { // 800px portrait
      if(this.showHideBasketBtn) {
        this.showHideBasketBtn = false;
        this.showHideMobileBasket = true;
      }else {
        this.showHideBasketBtn = false;
      }
    }else {
        if(this.showHideMobileBasket) {
          this.showHideMobileBasket = false;
          this.showHideBasketBtn = true;
        }
    }
  }

  getSingleChefInfo(id) {

    this.chef_id = id;
    let data = {chef_id:id};

    this.dataService.getSingleChef({url: ServerURL.SERVER_URL_ENDPOINT_CUSTOMER + 'chef/get_single', data: data, isLoader:true})
    .subscribe(response =>{
      this.singleChefInfo = response;
      this.getFilterProducts(this.singleChefInfo.chef_availability[0]);
      this.getAvailableDates();
      this.getalreadySavedProduct();
      console.log(response);
    });
  }

  getAvailableDates() {

    this.singleChefInfo.chef_availability?.forEach(element => {

      let duplicateVariant = this.chefsAvailableDate.find(date => (this.dataService.getDateFormat(new Date(element)) === this.dataService.getDateFormat(new Date(date)))); 
      if(!duplicateVariant) { 
        this.chefsAvailableDate.push(element);
      }
    });

    console.log(this.chefsAvailableDate);
  }

  getalreadySavedProduct() {
    if(this.customerToken) {
      console.log(localStorage.getItem('chefsInfo'));
      let chefsInfo = JSON.parse(localStorage.getItem('chefsInfo'));
      console.log(chefsInfo.id);
      console.log(this.chef_id);
      let chefsBasketedProduct = JSON.parse(localStorage.getItem('chefsBasketedProduct'));
      if((chefsInfo.id).toString() === (this.chef_id).toString()) {

       if(this.singleChefInfo.menus.length > 0) {

        console.log(chefsBasketedProduct);
        this.basketProductList = chefsBasketedProduct;
        this.getTotalPrice(this.basketProductList);

       }else {
        this.basketProductList = [];
       }
       
      }else {
        this.basketProductList = [];
      }
    }
  }

  onSelectDate(date) {
    let message = 'Are you sure, do you want change date?'
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '400px', data: message, disableClose: true })
       .afterClosed().subscribe(result => {
         if (result == 'YES') {
          this.router.navigate(['/view-chef/'+ this.chef_id]);
          this.getFilterProducts(date);
           console.log(result);
         }
       });
  }
  
  getFilterProducts(date) {

    this.selectedDate = date;
    console.log(date);
    this.showFilteredProductList = [];
    this,this.basketProductList = [];
    let menus = this.singleChefInfo?.menus;
    console.log(menus);
    menus.forEach(element => {
      if(element.available_date === date){
        this.showFilteredProductList.push(element);
      }
    });
  }

  addToBasket(product,menu_id) {

    console.log(product);

    let productData = product;


    productData['menu_id'] = menu_id;
    let dialogRef = this.dialog.open(AddToBasketComponent, {
      data:productData,
      height: '700px',
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N') {

        let dialogRefInner = this.dialog.open(AddQuantityComponent, {
          data:result,
          height: '300px',
          width: '400px',
          disableClose:true
        });

        dialogRefInner.afterClosed().subscribe(result => {
          if(result!=='N') {
            let duplibateChef = this.basketProductList.find(c=>c.product_id === result.product_id);
            if(duplibateChef===undefined){
              this.basketProductList.push(result);
            }
            this.getTotalPrice(this.basketProductList);
          }
        });
      }
    });
  }

  getTotalPrice(product: any[]) {
    this.totalPrice = 0;
    product.forEach(element => {
      console.log(element);
      this.totalPrice += element.productTotalPrice;
    });
  }

  increaseDecreaseCount(type, index) {
    
    if(type === 'decrease') {

      if(this.basketProductList[index].count > 1){
        this.basketProductList[index].count = this.basketProductList[index].count - 1;
        this.basketProductList[index].productTotalPrice -= this.basketProductList[index].totalPrice;
        this.totalPrice -= this.basketProductList[index].totalPrice;

      }
    }else if(type === 'increase') {

      if(this.basketProductList[index].limited) {
        if(this.basketProductList[index].inventory_count > this.basketProductList[index].count) {
          this.basketProductList[index].count = this.basketProductList[index].count + 1;
          this.basketProductList[index].productTotalPrice += this.basketProductList[index].totalPrice;
          this.totalPrice += this.basketProductList[index].totalPrice;
        }else{
          this.isTooltipshow = true;
        }

      }else {
        this.basketProductList[index].count = this.basketProductList[index].count + 1;
        this.basketProductList[index].productTotalPrice += this.basketProductList[index].totalPrice;
        this.totalPrice += this.basketProductList[index].totalPrice;
      }
     
    }

  }

  showHideBasket() {
    if(window.screen.width < 800) {
      this.showHideBasketBtn = false;
      this.showHideMobileBasket = !this.showHideMobileBasket;
    }else {
      this.showHideBasketBtn = !this.showHideBasketBtn;
      this.showHideMobileBasket = false;
    }
   
  }

  deleteSelectedproduct(productArrindex) {
    this.basketProductList.splice(productArrindex, 1);
    localStorage.setItem('chefsBasketedProduct',JSON.stringify(this.basketProductList));
    console.log(this.basketProductList);
    this.getTotalPrice(this.basketProductList);
  }

  checkoutProduct() {
    
    console.log(this.customerToken);
    if(this.customerToken) {

      if(this.totalPrice >= this.singleChefInfo.minimum_order) {

        console.log('redirect to next page.');
        let chefInfo = this.singleChefInfo;
        chefInfo['selectedDate'] = this.selectedDate;
        chefInfo['allproductTotalPrice'] = this.totalPrice;
        console.log(chefInfo);
        localStorage.setItem('chefsInfo',JSON.stringify(chefInfo));
        localStorage.setItem('chefsBasketedProduct',JSON.stringify(this.basketProductList));
        
        this.router.navigate(['/checkout']);
      }else{
        this._matSnackBar.open('Your miminum order price must be ' +this.singleChefInfo.minimum_order, 'CLOSE', {
          verticalPosition: 'bottom',
          horizontalPosition:'center',
          duration        : 4000
        });
      }
    }else{ 
      let chefInfo = this.singleChefInfo;
      chefInfo['selectedDate'] = this.selectedDate;
      chefInfo['allproductTotalPrice'] = this.totalPrice;
      console.log(chefInfo);
      localStorage.setItem('chefsInfo',JSON.stringify(chefInfo));
      localStorage.setItem('chefsBasketedProduct',JSON.stringify(this.basketProductList));
      this.router.navigate(['/customer-login','checkout']);
    }
  }

}
