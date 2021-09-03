import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { first, take, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from 'src/app/_helpers/common.utils';
import { DataService } from 'src/app/_services/dataservice';
import { AddProductVarientsComponent } from './add-product-varients/add-product-varients.component';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect; 
  createProductForm:FormGroup;
  public inputAccpets : string = ".jpeg, .jpg, .png";
  private file: string | null = null;
  public tmp_avatar_img;
  public message:string = '';
  protected _onDestroy = new Subject<void>();
  public isSubmit: boolean = false;
  public loader = false;
  public showLoader: boolean = true;
  public allergenList: any = [];
  public dietaryList: any = [];
  public productVarientList: any = [];
  public maxSelection:number = 0;
  public singleSelection: boolean = false;
  public chefList : any ;
  errorMsg: any;

  public AllergyMultiFilterCtrl: FormControl = new FormControl();
  public DietaryMultiFilterCtrl: FormControl = new FormControl();

  public varient_category: FormArray;	

  public filteredAllergyMulti: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  public filteredDietaryMulti: ReplaySubject<[]> = new ReplaySubject<[]>(1);

  userType : boolean;

  url :any ;

  constructor(
    public dialogRef                      : MatDialogRef<CreateProductComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data  : any,
    private _fb: FormBuilder,
    private _matSnackBar:MatSnackBar,
    private dataService :DataService,
    private currencyPipe : CurrencyPipe) { 
      
    this.getAllergen();
    this.getDietaries();
    this.varient_category = this._fb.array([]);
  }

  ngOnInit(): void {

    this.userType =JSON.parse(localStorage.getItem('userType'));
    this.getChefList();
  
    // this.getProducts();

    if(this.data!==null){

      this.message = 'Edit Product';
      let product_details = this.data._product_details;

      this.createProductForm = this._fb.group({
        name: this._fb.control(product_details.name,[Validators.required]),
        price: this._fb.control((product_details.price /100),[Validators.required,Validators.pattern("^([0-9]{1,2}){1}(\.[0-9]{1,2})?$")]),
        description: this._fb.control(product_details.description,[Validators.required]),
        allergense: this._fb.control(product_details.allergens),
        dietaries: this._fb.control(product_details.dietary),
        chef_id:this._fb.control(1),
        product_image: this._fb.control('')
      });

      this.createProductForm.addControl('varient_category', this.varient_category); 

      //Prepopulate allergense on edit page
      let allergenNameToDispaly: any = []; 
      product_details.allergens.forEach(allergen => {
        allergenNameToDispaly.push(allergen.allergens_id);
      });
      this.createProductForm.controls['allergense'].setValue(allergenNameToDispaly);
      
      //Prepopulate dietaries on edit page
      let dietaryNameToDispaly: any = []; 
      product_details.dietary.forEach(dietary => {
        dietaryNameToDispaly.push(dietary.dietary_id);
      });
      this.createProductForm.controls['dietaries'].setValue(dietaryNameToDispaly);

      //Prepopulate varients on edit page
      if(product_details.variants.length > 0) {

        product_details.variants.forEach((element,index) => {

          this.varient_category.push(this.createItemFormGroup(element));  
          console.log(this.varient_category);
          console.log(element.variant_options);
          // element.variant_options.forEach(element1 => {
          //   console.log(element1);
          //   console.log(this.varient_category.controls[index].value);
          //   // (this.varient_category.controls[index].value).productVarientList.push(this.createVarientFormGroup(element1));
          //   console.log(this.varient_category);
          //   // console.log((this.varient_category.controls[index].value).productVarientList.push(this.createVarientFormGroup(element1)))
          // });
        });
      }
 
      //Prepopulate Image on edit page
      this.tmp_avatar_img = product_details._product_media_of_product_details ? product_details._product_media_of_product_details.media_url.url : '';

    }else{

      this.message = 'Create New Product';

      this.createProductForm = this._fb.group({
        name: this._fb.control('',[Validators.required]),
        price: this._fb.control('',[Validators.required,Validators.pattern("^([0-9]{1,2}){1}(\.[0-9]{1,2})?$")]),
        description: this._fb.control('',[Validators.required]),
        allergense: this._fb.control([]),
        dietaries: this._fb.control([]),
        chef_id:this._fb.control(1),
        product_image: this._fb.control('')
      });

      this.createProductForm.addControl('varient_category', this.varient_category); 
    }
    this.AllergyMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAllergenMulti();
      });

      this.DietaryMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtereDietaryMulti();
      });
    
  }

  protected setInitialValue() {
    this.filteredAllergyMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a, b) => a && b && a.id === b.id;
      });
  }

  protected setInitialValue1() {
    this.filteredDietaryMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a, b) => a && b && a.id === b.id;
      });
  }

  
  protected filterAllergenMulti() {
    if (!this.allergenList) {
      return;
    }
    // get the search keyword
    let search = this.AllergyMultiFilterCtrl.value;
    if (!search) {
      this.filteredAllergyMulti.next(this.allergenList.slice());
      console.log(this.filteredAllergyMulti)
      return;
    } else { 
      search = search.toLowerCase();
    }
    // filter the cuisine
    this.filteredAllergyMulti.next(
      this.allergenList.filter(allergense => allergense.allergen_name.toLowerCase().indexOf(search) > -1)
    );
    console.log(this.allergenList.filter(allergense =>allergense.allergen_name.toLowerCase().indexOf(search) > -1));
  }

  protected filtereDietaryMulti() {
    if (!this.allergenList) {
      return;
    }
    // get the search keyword
    let search = this.DietaryMultiFilterCtrl.value;
    if (!search) {
      this.filteredDietaryMulti.next(this.dietaryList.slice());
      console.log(this.filtereDietaryMulti)
      return;
    } else { 
      search = search.toLowerCase();
    }
    // filter the cuisine
    this.filteredDietaryMulti.next(
      this.dietaryList.filter(dietary => dietary.dietary_name.toLowerCase().indexOf(search) > -1)
    );
    console.log(this.dietaryList.filter(dietary =>dietary.dietary_name.toLowerCase().indexOf(search) > -1));
  }

  // getProducts() {

  //   this.dataService.getAll({url:'product',isLoader:true})
  //   .subscribe(response =>{
  //     this.productVarientList = response;
  //   });
  // }

  // getmappedList(data) {
  //   let tempArr = [];
  //   data.forEach(element => {
  //       let obj = {};
  //       obj['product_id'] = element.id;
  //       obj['name'] = element._product_details?.name;
  //       obj['price'] = element._product_details?.price;
  //       tempArr.push(obj);
  //   });
  //   return tempArr;
  // }

  transformAmount(element){
    let formattedAmount = this.currencyPipe.transform(this.createProductForm.get('price').value, 'EUR');

    element.target.value = formattedAmount;
  }
  
  fileChangeEvent(event: any): void {
    const file = event && event.target.files[0] || null;
    // this.file = event.target.files[0];
    this.getBase64(event.target.files[0]);
  }

  getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file); // read file as data url

    reader.onload = (event: any) => { // called once readAsDataURL is completed
      this.file = event.target.result;
      this.tmp_avatar_img = event.target.result;
    }
  }

  getAllergen() {

    this.dataService.getAllergensDietaries({url:'product/allergen_info',isLoader:true})
    .subscribe(response =>{
      this.allergenList = response;
      this.filteredAllergyMulti.next(this.allergenList.slice());
      this.showLoader = false;
      console.log(this.allergenList);
    });
  }

  getDietaries() {

    this.dataService.getAllergensDietaries({url:'product/dietary_info',isLoader:true})
    .subscribe(response =>{
      this.dietaryList = response;
      this.filteredDietaryMulti.next(this.dietaryList.slice());
      this.showLoader = false;
      console.log(this.dietaryList);
    });
  }

  onSubmit(event) {
    let userType = localStorage.getItem('userType');
    let checkUserType = userType === 'true' ? true : false;
    if (checkUserType) {
        this.url = "?chef_id="+sessionStorage.getItem("chef_Id");
    }else{
        this.url ="";
    }

    event.preventDefault();
    event.stopPropagation();
    console.log('mediaInfo',this.createProductForm.value);
    console.log(this.varient_category.value);
      

    if (this.createProductForm.valid) {
      this.loader = true;
      let formValue = this.createProductForm.value;
      this.isSubmit = true;
      //Define formdata
      let mediaInfo = new FormData();
      let message = this.data!==null ? 'Product Edited successfully' : 'Product created successfully';
      let url = this.data!==null ? 'product/' + this.data.id : 'product/create';
      if(this.data!==null){
        mediaInfo.append('product_id',this.data.id);
      }

      //Image is optional parameter if select send
      if(this.file!== null) {
        mediaInfo.append('product_media',this.file);
      }
      
      let price = formValue.price * 100;
      mediaInfo.append('name',formValue.name);
      mediaInfo.append('price',price.toString());
      mediaInfo.append('description',formValue.description);

      if(checkUserType){
        mediaInfo.append('chef_id',sessionStorage.getItem("chef_Id"));
      }else{
        mediaInfo.append('chef_id',formValue.chef_id);
      }
      // mediaInfo.append('dietary_selection',JSON.stringify(formValue.dietaries));
      // mediaInfo.append('allergen_selection',JSON.stringify(formValue.allergense));

      //Allergens is optional parameter if select send
      if(formValue.allergense.length > 0){
        mediaInfo.append('allergen_selection',JSON.stringify(formValue.allergense));
      }
      //Dietaries is optional parameter if select send
      if(formValue.dietaries.length > 0){
        mediaInfo.append('dietary_selection',JSON.stringify(formValue.dietaries));
      }

      //Varients is optional parameter if select send
      let varientCategoryTemp = formValue.varient_category ? formValue.varient_category : [];
      varientCategoryTemp.forEach(element => {
        let options: any = [];
        element.productVarientList.forEach(element1 => {
          options.push(element1.value || element1);
        });
        element.options = options;
        delete element.productVarientList;
      });
      if(varientCategoryTemp.length > 0){
        mediaInfo.append('variants',JSON.stringify(varientCategoryTemp));
      }
    
      console.log('mediaInfo',mediaInfo);
      console.log(this.varient_category.value);
    
            
      this.dataService.saveMedia({url: url+this.url,data:mediaInfo, isLoader:true})
        .subscribe(uploadResponse=>{
          console.log(uploadResponse);
          
          // Show the success message
          this._matSnackBar.open(message, 'CLOSE', {
            verticalPosition: 'bottom',
            horizontalPosition:'center',
            duration        : 2000
        });
        this.dialogRef.close();
        this.isSubmit = false;
      },
      error => {
        // Show the error message
          this.loader = false;
          this.isSubmit = false;
          this._matSnackBar.open(error.error.message, 'RETRY', {
            verticalPosition: 'bottom',
            horizontalPosition:'center',
            duration        : 2000
        });
      });
    }else{
      CommonUtils.validateAllFormFields(this.createProductForm);
    }
  }

  RemovePicture() {
    this.tmp_avatar_img = '';
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  addEditVarient(data,type, index){

    console.log((this.varient_category.controls[index].value).productVarientList);
    
    let dialogRef = this.dialog.open(AddProductVarientsComponent, {
      data:{'type':type,rowdata:data , isEnableDefaultSingleSelection:(this.varient_category.controls[index].value).productVarientList},
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N'){
        
        if(result.type === 'add'){

          result.rowdata.id = this.productVarientList.length + 1;
          console.log('result.rowdata.id',result.rowdata.id);
          this.productVarientList.push(result.rowdata);
          // this.createProductForm.addControl('productVarientList',(this.varient_category.controls[index].value).productVarientList);
          // (this.varient_category.addControl('productVarientList',(this.varient_category.controls[index].value).productVarientList);
          (this.varient_category.controls[index].value).productVarientList.push(this.createVarientFormGroup(result.rowdata));
          console.log(this.varient_category.controls);
        }else if(result.type === 'edit'){

          console.log(index);
          console.log('result.rowdata',result.rowdata);
          console.log((this.varient_category.controls[index].value).productVarientList);
          let productVarientListTemp = (this.varient_category.controls[index].value).productVarientList;
          console.log('productVarientListTemp',productVarientListTemp);

          productVarientListTemp.forEach((item, idx) => {
              if(item?.id === result.rowdata.id ){
                console.log(idx);
                // (this.varient_category.controls[index].value).productVarientList[idx].setValue(result.rowdata);
                // this.productVarientList[idx] = result.rowdata;
                (this.varient_category.controls[index].value).productVarientList[idx].option_name = result.rowdata.product_variant_name;
                (this.varient_category.controls[index].value).productVarientList[idx].default = result.rowdata.default;
                (this.varient_category.controls[index].value).productVarientList[idx].price = result.rowdata.price;
                console.log((this.varient_category.controls[index].value).productVarientList[idx]);

              }else if(item?.value?.id === result.rowdata.id) {

                (this.varient_category.controls[index].value).productVarientList[idx].value.option_name = result.rowdata.product_variant_name;
                (this.varient_category.controls[index].value).productVarientList[idx].value.default = result.rowdata.default;
                (this.varient_category.controls[index].value).productVarientList[idx].value.price = result.rowdata.price;
                
              }
            });
        }

      }
    });
  }

  deleteVarient(idx, index){
    
    let productVarientListTemp = (this.varient_category.controls[index].value).productVarientList;
    productVarientListTemp = productVarientListTemp.splice(idx, 1);
    (this.varient_category.controls[index].value).get('productVarientList').setValue(productVarientListTemp);
  }

  toggleChangeValue(event,i, index) {

    (this.varient_category.controls[index].value).productVarientList[i].default = event.checked
    // this.productVarientList[i].default = event.checked;
    // this.checkSingleorMaxSelection();
  }

  changeSingleSelection(event, index) {

    this.varient_category.controls[index].get('single_selection').setValue(event.checked)
    // this.singleSelection = event.checked;
    // console.log(this.varient_category);
    // console.log(this.createProductForm);
    // console.log(this.varient_category.controls[index].get('single_selection').setValue(event.checked));
    // console.log((this.varient_category.controls[index].value).single_selection);
  }

  addEditVarientCategory(data, type, index) {

    let dialogRef = this.dialog.open(AddProductVarientsComponent, {
      data:{'type':'var_cat',rowdata:data},
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N'){
        
        if(type==='add'){
          this.varient_category.push(this.createItemFormGroup(result.rowdata));  
        }else {
          this.varient_category.controls[index].get('name').setValue(result.rowdata.variant_name);
          this.varient_category.controls[index].get('single_selection').setValue(result.rowdata.single_selection);
          this.varient_category.controls[index].get('max_selection').setValue(result.rowdata.max_selection);
        }
        
        console.log(this.varient_category);
      }
    });
  }

  createItemFormGroup(data): FormGroup {      
		return this._fb.group({
       name : this._fb.control(data.variant_name, Validators.required), 
       single_selection: this._fb.control(data.single_selection),
       productVarientList: this._fb.array(this.createProductVarientControls(data.variant_options)),
       max_selection: this._fb.control(data.max_selection),
       options: this._fb.control(data.variant_options)
		});
	}

  createProductVarientControls(data) {
    let tempArr = [];
    data.forEach(element => {
      tempArr.push(this.createVarientFormGroup(element));
    });
    return tempArr;
    
  }


  createVarientFormGroup(data): FormGroup {    
      console.log(data);
		return this._fb.group({
       option_name : this._fb.control(data.product_variant_name, Validators.required), 
       id: this._fb.control(data.id),
       price: this._fb.control(data.price,[Validators.required,Validators.pattern("^[0-9]*$")]),
       default: this._fb.control(data.default),
		});
	}

  onRemoveRow(idx) {    
		this.varient_category.removeAt(idx);
	}

  getChefList() {
   
    this.dataService.getAll({url:'admin/chefs', isLoader:true})
      .subscribe(response =>
                  {
                      this.showLoader = false;
                      this.chefList = response;
                      console.log(response);
                      
                  },
      error => this.errorMsg = error);
  }
  
  // checkSingleorMaxSelection(){
  //   this.maxSelection = 0;
  //   if(this.productVarientList.length > 0){
  //     this.productVarientList.forEach(element => {
  //       if(element.default===true){
  //         console.log(element.default);
  //         this.maxSelection = this.maxSelection + 1;
  //       }
  //     });
  //     console.log(this.maxSelection);
  //     this.singleSelection = this.maxSelection === 1 ? true : false;
  //     console.log(this.singleSelection);
  //   }
  // }

}
