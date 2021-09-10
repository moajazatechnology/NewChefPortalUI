import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/main/shared/components/confirm-dialog/confirm-dialog.component';
import { ServerURL } from 'src/app/_helpers';
import { CommonUtils } from 'src/app/_helpers/common.utils';
import { DataService } from 'src/app/_services/dataservice';
import { threadId } from 'worker_threads';
import { AddNewAddressComponent } from './add-new-address/add-new-address.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
 
  active = 1;
  public showHideBasketBtn:boolean= true;
  public isTooltipshow: boolean = false;
  public isSlotSelected: boolean = false;
  public showHideMobileBasket: boolean = false;
  public isSubmit: boolean = false;
  public loader = false;
  showPromoCode: boolean = false;
  promocodeLoader: boolean = false;
  singleChefInfo: any = {};
  basketProductList: any = [];
  allAddressList: any = [];
  allSlotsList: any = [];
  totalPrice: number =0;
  promocodeDelivery;
  promocodeCollection;
  deliveryCharges: number = 0;
  discount: number = 0;
  promocode: any = {};
  check_promo_type_response: any = {};
  productTotalPriceWithDeliveryCharges: number = 0;
  deliveryFormGroup: FormGroup;
  collectionFormGroup: FormGroup;

  public payment_button_disabled: boolean = false;

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

  
  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private _matSnackBar: MatSnackBar,
    private _fb: FormBuilder
  ) {
    this.singleChefInfo = JSON.parse(localStorage.getItem('chefsInfo'));
    console.log(this.singleChefInfo);
    this.basketProductList = JSON.parse(localStorage.getItem('chefsBasketedProduct'));

    this.getScreenSize();

   }

  ngOnInit(): void {
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
  

    this.totalPrice = this.singleChefInfo?.allproductTotalPrice;
    this.createDeliveryForm();
    this.createCollectionForm();
    
    this.getAddresses();
    this.getSlots();
  }

  createDeliveryForm() {

    this.deliveryFormGroup = this._fb.group({
      customer_address_id : this._fb.control(0,[Validators.required]),
      chef_store_slot_id: this._fb.control('',[Validators.required]),
      promocode: this._fb.control(''),
      notes: this._fb.control('')
    });
  }

  createCollectionForm() {

    this.collectionFormGroup = this._fb.group({
      name : this._fb.control('',[Validators.required]),
      email : this._fb.control('',[Validators.required]),
      phone_number : this._fb.control('',[Validators.required]),
      chef_store_slot_id_1: this._fb.control('',[Validators.required]),
      promocode: this._fb.control(''),
      notes: this._fb.control('')
    });
  }

  getAddresses() {

    this.dataService.getAllList({url: 'checkout/addresses' ,data:{chef_id:this.singleChefInfo?.id}, isLoader:true})
     .subscribe(res => {
       this.allAddressList = res;
       let addressId = this.allAddressList?.eligible?.length > 0 ? this.allAddressList?.eligible[0].id : 0;
       this.deliveryFormGroup.get('customer_address_id').setValue(addressId);
       console.log(res);
     });
  }

  getSlots() {
    this.dataService.getAllList({url: 'checkout/slots' ,data:{chef_id:this.singleChefInfo?.id}, isLoader:true})
    .subscribe(res => {
      this.allSlotsList = res;
      console.log(res);
    });
  }

  increaseDecreaseCount(type, index) {
    
    if(type === 'decrease') {

      if(this.basketProductList[index].count > 1){
        this.basketProductList[index].count = this.basketProductList[index].count - 1;
        this.basketProductList[index].productTotalPrice -= this.basketProductList[index].totalPrice;
        this.totalPrice -= this.basketProductList[index].totalPrice;
        this.calculateDiscount();
      }
    }else if(type === 'increase') {

      if(this.basketProductList[index].limited) {
        if(this.basketProductList[index].inventory_count > this.basketProductList[index].count) {
          this.basketProductList[index].count = this.basketProductList[index].count + 1;
          this.basketProductList[index].productTotalPrice += this.basketProductList[index].totalPrice;
          this.totalPrice += this.basketProductList[index].totalPrice;
          this.calculateDiscount();
        }else{
          this.isTooltipshow = true;
        }

      }else {
        this.basketProductList[index].count = this.basketProductList[index].count + 1;
        this.basketProductList[index].productTotalPrice += this.basketProductList[index].totalPrice;
        this.totalPrice += this.basketProductList[index].totalPrice;
        this.calculateDiscount();
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

  addNewAddress() {
    let dialogRef = this.dialog.open(AddNewAddressComponent, {
      data:null,
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N') {
        this.getAddresses();
      }
    });
  }
  
  editAddress(address) {
    let dialogRef = this.dialog.open(AddNewAddressComponent, {
      data:address,
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N') {
        this.getAddresses();
      }
    });
  }

  /**Delete Selected**/
  deleteSelectedAddress(id) {

    let message = 'Are you want delete this address?'
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '400px', data: message, disableClose: true })
       .afterClosed().subscribe(result => {
         if (result == 'YES') {
          // this.showLoader = true;
           this.deleteData(id);
         }
       });
   }
 
   deleteData(id) {

     this.dataService.deleteRecord({ url: ServerURL.SERVER_URL_ENDPOINT_CUSTOMER + 'profile/address/delete/' + id, isLoader: true })
       .subscribe((response: any) => {
        //  if(response === {}){
            // Show the success message
            this._matSnackBar.open('Address deleted successfully', 'CLOSE', {
              verticalPosition: 'bottom',
              horizontalPosition:'center',
              duration        : 2000
            });
            this.getAddresses();
        //  }
      });
   }

   checkPromoCode(type) {
    let data = {
      'name':type==='collection' ? this.promocodeCollection : this.promocodeDelivery,
      'chef_id':this.singleChefInfo.id,
      'collection': type==='collection' ? true : false,
      'order_total': this.totalPrice * 100
    }
    if(type === 'collection') {

      if(this.promocodeCollection) {
        this.promocodeLoader = true;
        this.postPromocodeAPI(data);
      }
    }else {

      if(this.promocodeDelivery) {
        this.promocodeLoader = true;
        this.postPromocodeAPI(data);
      }
    }

   
   }

   postPromocodeAPI(data) {

    this.dataService.getAllList({url: 'checkout/check_promo_code' ,data:data, isLoader:true})
    .subscribe(res => {
      let response = res as any;
      if(response.valid){

        this.promocode = response.details;
        this.showPromoCode = true;
        this.promocodeLoader = false;
        let dataOftypeCheck = {type: this.promocode.type}
        this.dataService.getAllList({url: 'checkout/check_promo_type' ,data:dataOftypeCheck, isLoader:true})
        .subscribe(res => {
          this.check_promo_type_response = res as any;
          this.calculateDiscount();
          
        });
      }else {
         // Show the error message
         this._matSnackBar.open('This promo code is not valid', '', {
          verticalPosition: 'bottom',
          horizontalPosition:'center',
          duration        : 2000
        });
        this.promocodeLoader = false;
      }
    },
    error =>{
      this.promocodeLoader = false;
       // Show the error message
       this._matSnackBar.open(error.error.message, '', {
        verticalPosition: 'bottom',
        horizontalPosition:'center',
        duration        : 2000
    });
    });
   }

   calculateDiscount() {

    let totalPriceTemp = (this.totalPrice /100);
    console.log(totalPriceTemp);
    if(this.check_promo_type_response.id === 1 && this.check_promo_type_response.name === 'DELIVERY'){
            
      if(this.promocode && this.promocode.is_flat_discount){
        if(this.deliveryCharges > (this.promocode.flat_discount / 100)) {
          this.discount = this.deliveryCharges - (this.promocode.flat_discount / 100);
        }
        
      }else {
        this.discount = (this.promocode.percentage_discount / 100) * this.deliveryCharges;
        console.log( 'discount',this.discount);
        console.log('charges',this.deliveryCharges);
        console.log(totalPriceTemp);
      }
    }else if(this.check_promo_type_response.id === 2 && this.check_promo_type_response.name === 'ORDER'){

      if(this.promocode && this.promocode.is_flat_discount){
        this.discount = (this.promocode.flat_discount / 100);
      }else {
        this.discount = (this.promocode.percentage_discount / 100) * totalPriceTemp;
        console.log(totalPriceTemp);
        console.log(this.discount);
      }
    }
    let total = totalPriceTemp + this.deliveryCharges;
    console.log('total',total)
    this.productTotalPriceWithDeliveryCharges = ((totalPriceTemp)  + this.deliveryCharges) - this.discount;
    console.log(this.productTotalPriceWithDeliveryCharges);
   }

   onChangeAddress(id) {

    let data = {chef_id:this.singleChefInfo.id, customer_address_id:id };
    this.dataService.getAllList({url: 'checkout/request_delivery' ,data:data, isLoader:true})
    .subscribe(res => {
      this.deliveryCharges = (res as any) / 100;
      this.promocodeDelivery = '';
      this.promocodeCollection = '';
      console.log(res);
    });
   }

   removeDiscount(){
     this.promocodeCollection = '';
     this.promocodeDelivery = '';
     this.showPromoCode = false;
     this.discount = 0;
     this.productTotalPriceWithDeliveryCharges = this.totalPrice + this.deliveryCharges;
   }

   deleteSelectedproduct(productArrindex) {
    this.basketProductList.splice(productArrindex, 1);
    localStorage.setItem('chefsBasketedProduct',JSON.stringify(this.basketProductList));
    console.log(this.basketProductList);
    this.getTotalPrice(this.basketProductList);
  }

  getTotalPrice(product: any[]) {
    this.totalPrice = 0;
    product.forEach(element => {
      console.log(element);
      this.totalPrice += element.productTotalPrice;
    });
  }

   onSlotChange(value) {
     if(value){
       this.isSlotSelected = true;
       this.promocodeCollection = '';
       this.promocodeDelivery = '';
     }
   }

   getProfileDetails() {

    this.dataService.getCustomerDetails({url: 'profile/details' , isLoader:true})
     .subscribe(res => {
        let response = res as any;
        this.collectionFormGroup.get('name').setValue(response.first_name + ' ' +response.second_name);
        this.collectionFormGroup.get('email').setValue(response.email);
        this.collectionFormGroup.get('phone_number').setValue(response.phone_number);
       console.log(res);
     });
  }

   changeTab() {

     this.isSlotSelected = false;
     this.productTotalPriceWithDeliveryCharges = 0;
     this.promocode = {};
     this.check_promo_type_response = {};
     this.showPromoCode = false;
     this.deliveryCharges = 0

     if(this.active===1){
        this.createDeliveryForm();
     }else {
       this.createCollectionForm();
       this.getProfileDetails();
     }

     console.log('change tab');
     console.log(this.active);
   }

   proceedToPayment() {
    
    console.log(this.basketProductList);

    let sendToData: any = {};
    let products: any = [];
    
    if(this.active===1) {

      if(this.deliveryFormGroup.valid){

        let formvalue = this.deliveryFormGroup.value;
        
        sendToData['chef_store_slot_id'] = formvalue.chef_store_slot_id;
        sendToData['customer_address_id'] = formvalue.customer_address_id;
        sendToData['notes'] = formvalue.notes;
        sendToData['collection'] = false;
        products = this.createProductJson();
        this.isSubmit = true;

      }else{
        CommonUtils.validateAllFormFields(this.deliveryFormGroup);
      }

    }else {

      if(this.collectionFormGroup.valid){

        let formvalue = this.collectionFormGroup.value;
        
        sendToData['chef_store_slot_id'] =  formvalue.chef_store_slot_id_1;
        sendToData['collection'] = true;
        products = this.createProductJson();

        let collection_details: any = {};
        collection_details['name'] = formvalue.name;
        collection_details['email'] = formvalue.email;
        collection_details['phone_number'] = formvalue.phone_number;
        sendToData['collection_details'] = collection_details;
        sendToData['notes'] = formvalue.notes;
        this.isSubmit = true;

      }else{
        CommonUtils.validateAllFormFields(this.collectionFormGroup);
      }
    }

    sendToData['products'] = products;
    sendToData['order_date'] = this.singleChefInfo.selectedDate;
    
    let data = {
      order_details:sendToData,
      chef_id: this.singleChefInfo.id,
      promo_code_name: this.active===1 ? this.promocodeDelivery : this.promocodeCollection
    }

    console.log(data);

    if(this.isSubmit) {
      this.payment_button_disabled = true;

      this.loader = true;
      this.dataService.getAllList({url: 'checkout/request_session' ,data:data, isLoader:true})
      .subscribe(res => {

        if(res.status === 200){

          // this.getNewWindow(res.url);
          this.openLinkOnSameWindow(res.url);
          this.loader = false;
        }
        console.log(res);
        
      },error => {
        this.payment_button_disabled = false;
        // Show the error message
          this.loader = false;
          this.isSubmit = false;
          this._matSnackBar.open(error.error.message, '', {
            verticalPosition: 'bottom',
            horizontalPosition:'center',
            duration        : 2000
        });
      });
    } 
   }
  
  openLinkOnSameWindow(url: any) {
    window.location.replace(url);
  }
   
  getNewWindow( url: any) {
    // let pdfWindow: Window = window.open(url, "_blank", "top=0,left=0,fullscreen=yes,scrollbars=yes,resizable=yes,width=" + screen.width + ",height=" + (screen.height - 100));
  }

   createProductJson(){
    let products: any = [];
    this.basketProductList.forEach(prod => {
      let prodObj: any = {};
      prodObj['product_id'] = prod.product_id;
      prodObj['quantity'] = prod.count;
      prodObj['menu_id'] = prod.menu_id;
      let variantsArr: any = [];
      prod.variants.forEach(variant => {
        let variantObj: any = {};
       
        let optionArr: any = [];
        console.log(variant);

        if(variant?.checkedOptions) {

          variantObj['variant_category_id'] = variant.id;
          variant.checkedOptions.forEach(option => {
            let optionObj: any = {};
            optionObj['option_id'] = option.id;
            optionObj['quantity'] = variant.checkedOptions.length;
            optionArr.push(optionObj);
            variantObj['options'] = optionArr;
          });
          variantsArr.push(variantObj);
        }
        
        
      });
      prodObj['variants'] = variantsArr;
      products.push(prodObj);
    });

    return products;
   }
   
}