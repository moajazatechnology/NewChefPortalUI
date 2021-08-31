import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { id } from 'date-fns/locale';
import { CommonUtils } from 'src/app/_helpers/common.utils';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-edit-promocode',
  templateUrl: './edit-promocode.component.html',
  styleUrls: ['./edit-promocode.component.scss']
})
export class EditPromocodeComponent implements OnInit {
  public isSubmit: boolean = false;
  public loader = false;
  public showLoader: boolean = true;
  message: string = '';

  startDate = new Date();

  editPromocodeForm: FormGroup;

  chefsList: any  = [];
  promotypesList: any  = [];

  constructor(
    public dialogRef: MatDialogRef<EditPromocodeComponent>,
    private dataService: DataService,
    private _matSnackBar: MatSnackBar,
    private _fb: FormBuilder,
    private currencyPipe : CurrencyPipe,
    @Inject(MAT_DIALOG_DATA) public data  : any,
  ) { 
    this.message = "Edit promo code #" + this.data.id;
    this.startDate.setDate(this.startDate.getDate() + 1)
  }

  ngOnInit(): void {

    this.getChefsList();
    this.getPromoTypes();

    console.log(this.data);

    if(this.data) {

      this.editPromocodeFormGroup();
    }
    
  }

  editPromocodeFormGroup() {

    let promo_code_id = 0;
    let name = '';
    let chef_list = [];
    let promo_type = '';
    let minimum_order = 0;
    let enabled = false;

    if(this.data) {

      promo_code_id = this.data.id ? this.data.id: 0;
      name = this.data.name ? this.data.name : '';
      chef_list = this.data.chef_list ? this.data.chef_list : [];
      promo_type = this.data.discount_type ? this.data.discount_type.id : '';
      minimum_order = this.data.minimum_order ? this.data.minimum_order : 0;
      enabled = this.data.enabled ? this.data.enabled : false;
    }

    this.editPromocodeForm = this._fb.group({
        promo_code_id: this._fb.control(promo_code_id),
        name: this._fb.control(name,[Validators.required]),
        chef_list: this._fb.control(chef_list,[Validators.required]),
        promo_code_type: this._fb.control(promo_type,[Validators.required]),
        minimum_order: this._fb.control(minimum_order,[Validators.required,Validators.pattern("^[0-9]*$")]),
        enabled: this._fb.control(enabled),
    });
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
    let formattedAmount = this.currencyPipe.transform(this.editPromocodeForm.get('minimum_order').value, 'EUR');

    console.log(formattedAmount);
    console.log(element.target.value);
    element.target.value = formattedAmount;
    
  }

  onSubmit(event) {
    
    if(this.editPromocodeForm.valid) {

      this.loader = true;
      let formValue = this.editPromocodeForm.value;
      formValue.minimum_order = formValue.minimum_order * 100;

      this.isSubmit = true;

        this.dataService.post({url: 'promo/update', data: formValue, isLoader:true})
      .subscribe(data =>{

        this._matSnackBar.open('Promo code updated successfully', 'CLOSE', {
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
      CommonUtils.validateAllFormFields(this.editPromocodeForm);
    }
    
  }

}
