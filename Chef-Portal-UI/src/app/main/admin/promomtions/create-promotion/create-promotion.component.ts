import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'src/app/_helpers/common.utils';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-create-promotion',
  templateUrl: './create-promotion.component.html',
  styleUrls: ['./create-promotion.component.scss']
})
export class CreatePromotionComponent implements OnInit {

  public isSubmit: boolean = false;
  public loader = false;
  public showLoader: boolean = true;
  isFlatDiscount: boolean = false;
  message: string = '';

  startDate = new Date();

  createPromoForm: FormGroup;

  chefsList: any  = [];
  promotypesList: any  = [];
  flat_discount: number = 0;
  minimum_order: number = 0;

  constructor(
    public dialogRef: MatDialogRef<CreatePromotionComponent>,
    private dataService: DataService,
    private _matSnackBar: MatSnackBar,
    private _fb: FormBuilder,
    private currencyPipe : CurrencyPipe
  ) { 
    this.message = "Create new promo code";
    this.startDate.setDate(this.startDate.getDate() + 1)
  }

  ngOnInit(): void {

    this.createPromoFormGroup();
    this.getChefsList();
    this.getPromoTypes();
  }

  createPromoFormGroup() {

    this.createPromoForm = this._fb.group({
        name: this._fb.control('',[Validators.required]),
        chef_list: this._fb.control([],[Validators.required]),
        promo_type: this._fb.control('',[Validators.required]),
        minimum_order: this._fb.control('',[Validators.required,Validators.pattern("^[0-9]*$")]),
        enabled: this._fb.control(false),
        is_flat_discount: this._fb.control(true),
        expiry_date: this._fb.control(this.startDate,[Validators.required]),
        max_uses: this._fb.control(0,[Validators.required,Validators.pattern("^[0-9]*$")]),
        flat_discount: this._fb.control(0,[Validators.required,Validators.pattern("^([0-9]{1,2}){1}(\.[0-9]{1,2})?$")]),
        percentage_discount: this._fb.control(0,[Validators.required,Validators.pattern("^([0-9]{1,2}){1}(\.[0-9]{1,2})?$")])
        // percentage_discount: this._fb.control(0,[Validators.required,Validators.pattern("^[0-9]$|^[1-9][0-9]$|^(100)$")])
    });
    
  }

  checkmaxFlatDiscount(){

    return 0
  }

  getChefsList() {

    this.dataService.getWithBody({url: 'promo/chef_list',isLoader:true})
    .subscribe(data =>{

      this.showLoader = false;
      this.chefsList = data;
     
    },error =>{
      this._matSnackBar.open(error.error.message, 'CLOSE', {
        verticalPosition: 'bottom',
        horizontalPosition:'center',
        duration        : 2000
      });
    });
  }

  getPromoTypes() {

    this.dataService.getWithBody({url: 'promo/type/list',isLoader:true})
    .subscribe(data =>{

      this.showLoader = false;
      this.promotypesList = data;
     
    },error =>{
      this._matSnackBar.open(error.error.message, 'CLOSE', {
        verticalPosition: 'bottom',
        horizontalPosition:'center',
        duration        : 2000
      });
    })
  }

  transformAmount(element){
    let formattedAmount = this.currencyPipe.transform(this.createPromoForm.get('minimum_order').value, 'GBP');

    console.log(formattedAmount);
    console.log(element.target.value);
    element.target.value = formattedAmount;
    
  }

  transformAmounttoPannies(element) {

    let formattedAmount = this.currencyPipe.transform(this.createPromoForm.get('flat_discount').value, 'GBP');

    element.target.value = formattedAmount;
  }


  transformAmounttoPercentage(element) {
    let formattedAmount = this.createPromoForm.get('percentage_discount').value + '%';

    element.target.value = formattedAmount;
  }

  changeDiscountPercentage() {

  }

  onSubmit(event) {
    
    if(this.createPromoForm.valid) {
      console.log(this.createPromoForm.value);
      this.loader = true;
      let formValue: any = {};
      formValue = this.createPromoForm.value;
      let data = formValue;

      data.is_flat_discount = this.flat_discount !== 0 ? true : false;
      data.flat_discount = this.flat_discount * 100;
      data.minimum_order = this.minimum_order * 100;

      this.isSubmit = true;

        this.dataService.post({url: 'promo/create', data: data, isLoader:true})
      .subscribe(data =>{

        this._matSnackBar.open('Promo code created successfully', 'CLOSE', {
          verticalPosition: 'bottom',
          horizontalPosition:'center',
          duration        : 2000
        });
        this.loader = false;
        this.isSubmit = false;
        this.dialogRef.close();
      
      },error =>{
        this.loader = false;
        this.isSubmit = false;
        this._matSnackBar.open(error.error.message, 'CLOSE', {
          verticalPosition: 'bottom',
          horizontalPosition:'center',
          duration        : 2000
        });
      })
    }else {
      CommonUtils.validateAllFormFields(this.createPromoForm);
    }
    
  }

}
