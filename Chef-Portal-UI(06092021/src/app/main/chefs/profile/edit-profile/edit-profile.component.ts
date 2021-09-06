import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { el } from 'date-fns/locale';
import { element } from 'protractor';
import { ReplaySubject, Subject } from 'rxjs';
import { first, take, takeUntil } from 'rxjs/operators';
import { SLOTS } from 'src/app/Constants/Slots';
import { CommonUtils } from 'src/app/_helpers/common.utils';
import { Slot } from 'src/app/_interface';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  public isSubmit: boolean = false;
  
  message: string = '';
  editEmailForm: FormGroup;
  editPasswordForm: FormGroup;
  editPhoneNoForm: FormGroup;
  editStoreAddressForm: FormGroup;
  editBiographyForm: FormGroup;
  editCuisineForm: FormGroup
  editCollectionDeliveryForm: FormGroup;
  editCollectionForm: FormGroup;
  editMinimumOrderForm: FormGroup;
  public slots : FormArray; 
  pwdhide: boolean = true;
  cpwdhide: boolean = true;
  public inputAccpets : string = ".jpeg, .jpg, .png";
  private file: string | null = null;
  public tmp_avatar_img;
  public showLoader:boolean = true;
  
  // public cuisineNamesList: any = [];

  /** list of cuisine */
  protected cuisineNamesList: any = [];
  public startSlotsList: any[] = SLOTS;
  public endSlotsList: any[] = [];
 
  public loader : boolean = false;

  /** control for the MatSelect filter keyword multi-selection */
  public cuisineMultiFilterCtrl: FormControl = new FormControl();

  /** list of cuisines filtered by search keyword */
  public filteredCuisinesMulti: ReplaySubject<[]> = new ReplaySubject<[]>(1);  
  
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  url :any;
  deliveryslotObj:any={};

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _matSnackBar:MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private _dataService :DataService,
     ) {

    this.slots = this._fb.array([]); 
    
    
   }

  ngOnInit(): void {

    console.log(this.data)

    if(this.data.type === 'email') {
      this.message = 'Edit Email';
      this.EditEmailFormGroup();
    }else if(this.data.type === 'password'){
      this.message = 'Edit Password';
      this.EditPasswordFormGroup();
    }else if(this.data.type === 'phoneNo'){
      this.message = 'Edit Phone Number';
      this.EditPhoneNoFormGroup();
    }else if(this.data.type === 'address'){
      this.message = 'Edit Store Address';
      this.EditStoreAddressFormGroup();
    }else if(this.data.type === 'biography'){
      this.message = 'Edit Biography';
      this.EditBiographyFormGroup();
    }else if(this.data.type === 'profile'){
      this.message = 'New Profile Picture';
    }else if(this.data.type === 'minimumorder') {
      this.message = 'Edit Minimum Order';
      this.EditMinimumOrderFormGroup();
    }else if(this.data.type === 'banner'){
      this.message = 'New Banner Picture';
    }else if(this.data.type === 'cuisine'){

      this.message = 'Edit Cuisines';
      this.EditCuisineFormGroup();
      this.getCuisineList();
      if(this.data.cuisineNames.length >0) {
        let cuisineNameToDispaly: any = [];
        this.data.cuisineNames.forEach(cuisine => {
          cuisineNameToDispaly.push(cuisine.cuisine_id);
        });
        this.editCuisineForm.controls['cuisines'].setValue(cuisineNameToDispaly)
      }

    }else if(this.data.type === 'collectionDelivery'){

      this.message = 'Edit Chef Collection/Delivery Enabled/Disabled';
      this.EditCollectionDeliveryFormGroup();

    }else if(this.data.type === 'collection'){

      this.message = 'Edit Chef Collection slots';
      // this.EditCollectionFormGroup();
      // this.editCollectionForm.addControl('slots', this.slots);
      let profile_data = this.data.profile_data;
      let slot_data = profile_data._chef_store?._chef_store_collection_slots;
      this.onAddExistingRow(slot_data);

    }else if(this.data.type === 'delivery'){

      this.message = 'Edit Chef Delivery Slots';
      // this.EditCollectionFormGroup();
      // this.editCollectionForm.addControl('slots', this.slots);
      let profile_data = this.data.profile_data;
      let slot_data = profile_data._chef_store?._chef_store_delivery_slots;
      this.onAddExistingRow(slot_data);

    }

    // listen for search field value changes
    this.cuisineMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCuisinesMulti();
      });
  }

  onAddSelectRow(index) {
    console.log('dhbjhsb')
    if(index<4){
      this.slots.push(this.createItemFormGroup(null));
      console.log(this.slots);
    }   
  }

  onAddExistingRow(rowData) {
    if(rowData.length > 0) {
      for (var i = 0; i <= rowData.length - 1; i++) {
        
        if(i===0){

          this.EditCollectionFormGroup(null);
          this.slots.push(this.createItemFormGroup(rowData[i]));
          
        }else{
          this.slots.push(this.createItemFormGroup(rowData[i]));
          
        }
        this.getStartSlots(rowData[i].start_hour, i);
        this.editCollectionForm.addControl('slots', this.slots);
      }

      console.log(this.slots);
    }
		else {
      this.EditCollectionFormGroup(null);
      this.editCollectionForm.addControl('slots', this.slots);
      this.slots.push(this.createItemFormGroup(null));
    }
	}
  createItemFormGroup(data): FormGroup {
    let start = '';
    let end = '';
    let startSlotsList = this.startSlotsList.length > 0 ? this.startSlotsList : [];
    console.log('in form')
    
    if(data){
      
      start = data.start_hour ? data.start_hour : '';
      end = data.end_hour ? data.end_hour : '';
    }
    return this._fb.group({
      start: this._fb.control(start),
      end: this._fb.control(end), 
      startSlotsList: this._fb.control(startSlotsList),
      endSlotsList : this._fb.control([])
    });
  }

  onRemoveRow(idx) {    
    this.slots.removeAt(idx);
  }

  /**
   * Sets the initial value after the filteredCuisines are loaded initially
   */
   protected setInitialValue() {
    this.filteredCuisinesMulti
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

  protected filterCuisinesMulti() {
    if (!this.cuisineNamesList) {
      return;
    }
    // get the search keyword
    let search = this.cuisineMultiFilterCtrl.value;
    if (!search) {
      this.filteredCuisinesMulti.next(this.cuisineNamesList.slice());
      console.log(this.filteredCuisinesMulti)
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the cuisine
    this.filteredCuisinesMulti.next(
      this.cuisineNamesList.filter(cuisine => cuisine.name.toLowerCase().indexOf(search) > -1)
    );
    console.log(this.cuisineNamesList.filter(cuisine => cuisine.name.toLowerCase().indexOf(search) > -1));
  }


  fileChangeEvent(event: any): void {
    const file = event && event.target.files[0] || null;
    this.file = event.target.files[0];
    this.getBase64(event.target.files[0]);
  }

  getBase64(file) {
    let userType = localStorage.getItem('userType');
    let checkUserType = userType === 'true' ? true : false;
    if (checkUserType) {
        this.url = "?chef_id="+this.data.profile_data.id;
    }else{
        this.url ="";
    }



    var reader = new FileReader();
    reader.readAsDataURL(file); // read file as data url

    reader.onload = (event: any) => { // called once readAsDataURL is completed
      // this.file = event.target.result;
      this.tmp_avatar_img = event.target.result;
      let mediaInfo = new FormData();
      mediaInfo.append('chef_profile_id',this.data.profile_data.chef_profile_id);
      if(this.data.type === 'profile'){
        let message = 'Profile Picture Edited Successfully';
        mediaInfo.append('profile_picture',this.file);
        this.postAPIResponse('chef/chef_profile/profile_picture'+this.url,mediaInfo,message);
      }else if(this.data.type === 'banner'){
        let message = 'Banner Picture Edited Successfully';
        mediaInfo.append('banner_picture',this.file);
        this.postAPIResponse('chef/chef_profile/banner_picture'+this.url,mediaInfo,message);
      }
    }
  }

  EditEmailFormGroup() {
    let email = this.data.profile_data !==null ? this.data.profile_data.email : '';
    this.editEmailForm = this._fb.group({
      email: this._fb.control(email, [Validators.required,Validators.email])
    });
  }

  EditMinimumOrderFormGroup() {
    this.editMinimumOrderForm = this._fb.group({
      chef_id: this._fb.control(0),
      minimum_order: this._fb.control(this.data.profile_data?._chef_store?.minimum_order,[Validators.required,Validators.pattern("^[0-9]*$")])
    });
  }

  EditPasswordFormGroup() {
    this.editPasswordForm = this._fb.group({
      password: this._fb.control('', [Validators.required,Validators.minLength(8)]),
      confirm_password: this._fb.control('',[Validators.required, confirmPasswordValidator])
    });
  }

  EditPhoneNoFormGroup() {
    let phoneNo = this.data.profile_data !==null ? this.data.profile_data.phone_number : '';
    this.editPhoneNoForm = this._fb.group({
      phone_number: this._fb.control(phoneNo, [Validators.required,Validators.pattern("^((\\+44-?)|0)?[0-9]{10}$")])
    });
  }

  EditBiographyFormGroup() {
    let biography = this.data.profile_data !==null ? this.data.profile_data?._chef_profile?.biography : '';
    this.editBiographyForm = this._fb.group({
      chef_profile_id: this._fb.control(this.data.profile_data.chef_profile_id),
      biography: this._fb.control(biography,[Validators.required,Validators.minLength(120)])
    });
  }

  EditStoreAddressFormGroup() {
    let address = this.data.profile_data?._chef_store?._chef_store_address;
    this.editStoreAddressForm = this._fb.group({
      address_1: this._fb.control(address.address_1, [Validators.required]),
      address_2: this._fb.control(address.address_2),
      address_3: this._fb.control(address.address_3),
      city: this._fb.control(address.city, [Validators.required]),
      country: this._fb.control(address.country, [Validators.required]),
      postcode: this._fb.control(address.postcode, [Validators.required, Validators.minLength(6),Validators.maxLength(9)]),
    });
  }

  EditCuisineFormGroup() {
    this.editCuisineForm = this._fb.group({
      cuisines: this._fb.control([])
    });
  }

  EditCollectionDeliveryFormGroup() {
    let profile_data = this.data.profile_data
    this.editCollectionDeliveryForm = this._fb.group({
      chef_id: this._fb.control(0),
      collection: this._fb.control(profile_data._chef_store.collection,[Validators.required]),
      delivery: this._fb.control(profile_data._chef_store.delivery,[Validators.required])
    });
  }

  EditCollectionFormGroup(slot_data) {
    console.log(slot_data);
    if(slot_data) {
      // this.getStartSlots(slot_data.start_hour);
      this.editCollectionForm = this._fb.group({
        chef_id: this._fb.control(slot_data.chef_store_id),
        // start: this._fb.control(slot_data.start_hour),
        // end: this._fb.control(slot_data.end_hour),
      });
    }else {
      this.editCollectionForm = this._fb.group({
        chef_id: this._fb.control(0),
        // start: this._fb.control(''),
        // end: this._fb.control(''),
      });
    }
    console.log(this.editCollectionForm.value);
  }

  getCuisineList() {
    this._dataService.get({url:'cuisines/options', isLoader:true})
    .subscribe(response => {
      this.showLoader= false;
      this.cuisineNamesList = response;
      this.filteredCuisinesMulti.next(this.cuisineNamesList.slice());
      console.log(response);
    });
  }

  emailSubmit(event) {
    let userType = localStorage.getItem('userType');
            let checkUserType = userType === 'true' ? true : false;
            if (checkUserType) {
                this.url = "?chef_id="+this.data.profile_data.id;
            }else{
                this.url ="";
            }

    event.preventDefault();
    event.stopPropagation();
    if(this.editEmailForm.valid) {
      this.loader = true;
      this.isSubmit = true
      let message = 'Email Edited Successfully';
      this.postAPIResponse('chef/details/email'+this.url,this.editEmailForm.value,message);
    }else{
      CommonUtils.validateAllFormFields(this.editEmailForm);
    }
  }

  mimimumOrderSubmit(event) {

    let userType = localStorage.getItem('userType');
    let checkUserType = userType === 'true' ? true : false;
    if (checkUserType) {
        this.url = "?chef_id="+this.data.profile_data.id;
    }else{
        this.url ="";
    }

    event.preventDefault();
    event.stopPropagation();
    if(this.editMinimumOrderForm.valid) {
      this.loader = true;
      this.isSubmit = true
      let message = 'Minimum order Edited Successfully';
      let data = this.editMinimumOrderForm.value;
      data.minimum_order = data.minimum_order * 100;
      this.postAPIResponse('chef/chef_store/minimum_order'+this.url, data, message);
    }else{
      CommonUtils.validateAllFormFields(this.editMinimumOrderForm);
    }
  }

  passwordSubmit(event) {
    let userType = localStorage.getItem('userType');
    let checkUserType = userType === 'true' ? true : false;
    if (checkUserType) {
        this.url = "?chef_id="+this.data.profile_data.id;
    }else{
        this.url ="";
    }


    event.preventDefault();
    event.stopPropagation();
    if(this.editPasswordForm.valid) {
      
      this.loader = true;
      this.isSubmit = true;
      let message = 'Password Edited Successfully';
      this.postAPIResponse('chef/details/password'+this.url,this.editPasswordForm.value,message);
    }else{
      CommonUtils.validateAllFormFields(this.editPasswordForm);
    }
  }

  phoneNoSubmit(event) {
    let userType = localStorage.getItem('userType');
    let checkUserType = userType === 'true' ? true : false;
    if (checkUserType) {
        this.url = "?chef_id="+this.data.profile_data.id;
    }else{
        this.url ="";
    }

    event.preventDefault();
    event.stopPropagation();
    if(this.editPhoneNoForm.valid) {
      
      this.loader = true;
      this.isSubmit = true
      let message = 'Phone No Edited Successfully';
      this.postAPIResponse('chef/details/phone_number'+this.url,this.editPhoneNoForm.value,message);
    }else{
      CommonUtils.validateAllFormFields(this.editPhoneNoForm);
    }
  }

  biographySubmit(event) {
    let userType = localStorage.getItem('userType');
    let checkUserType = userType === 'true' ? true : false;
    if (checkUserType) {
        this.url = "?chef_id="+this.data.profile_data.id;
    }else{
        this.url ="";
    }

    event.preventDefault();
    event.stopPropagation();
    if(this.editBiographyForm.valid) {
      this.loader = true;
      this.isSubmit = true
      let message = 'Saved';
      this.postAPIResponse('chef/chef_profile/bio'+this.url,this.editBiographyForm.value,message);
    }else{
      CommonUtils.validateAllFormFields(this.editBiographyForm);
    }
  }

  storeAddressSubmit(event) {
    let userType = localStorage.getItem('userType');
    let checkUserType = userType === 'true' ? true : false;
    if (checkUserType) {
        this.url = "?chef_id="+this.data.profile_data.id;
    }else{
        this.url ="";
    }

    event.preventDefault();
    event.stopPropagation();
    if(this.editStoreAddressForm.valid) {
  
      this.loader = true;
      this.isSubmit = true
      let message = 'Store Address Edited Successfully';
      this.postAPIResponse('chef/chef_store/address'+this.url,this.editStoreAddressForm.value,message);
    }else{
      CommonUtils.validateAllFormFields(this.editStoreAddressForm);
    }
    
  }

  CuisineSubmit(event) {
    let userType = localStorage.getItem('userType');
    let checkUserType = userType === 'true' ? true : false;
    if (checkUserType) {
        this.url = "?chef_id="+this.data.profile_data.id;
    }else{
        this.url ="";
    }

    event.preventDefault();
    event.stopPropagation();
    if(this.editCuisineForm.valid) {
      
      this.loader = true;
      this.isSubmit = true
      let message = 'Cuisines Edited Successfully';
      this.postAPIResponse('chef/chef_store/cuisines'+this.url,this.editCuisineForm.value,message);
    }else{
      CommonUtils.validateAllFormFields(this.editCuisineForm);
    }

  }

  collectionDeliverySubmit(event) {
    let userType = localStorage.getItem('userType');
    let checkUserType = userType === 'true' ? true : false;
    if (checkUserType) {
        this.url = "?chef_id="+this.data.profile_data.id;
         this.editCollectionDeliveryForm.value.chef_id = this.data.profile_data.id;
    }else{
        this.url ="";
    }


    event.preventDefault();
    event.stopPropagation();
    if(this.editCollectionDeliveryForm.valid) {
      
      this.loader = true;
      this.isSubmit = true
      let message = 'Collection/Delivery Edited Successfully';
      console.log("collectionDeliverySubmit  =>",this.editCollectionDeliveryForm.value);
      
       this.postAPIResponse('chef/chef_store/preference'+this.url,this.editCollectionDeliveryForm.value,message);
    }else{
      CommonUtils.validateAllFormFields(this.editCollectionDeliveryForm);
    }
  }

  collectionSubmit(event) {
    let userType = localStorage.getItem('userType');
    let checkUserType = userType === 'true' ? true : false;
    if (checkUserType) {
        this.url = "?chef_id="+this.data.profile_data.id;
       
    }else{
        this.url ="";
    }

    event.preventDefault();
    event.stopPropagation();
    if(this.editCollectionForm.valid) {
     
      this.loader = true;
      this.isSubmit = true
      let message = this.data.type === 'collection' ? 'Collection slots Edited Successfully' : 'Delivery slots Edited Successfully';
      let url = this.data.type === 'collection' ? 'chef/chef_store/collection/slot' : 'chef/chef_store/delivery/slot';
      // let formValue = this.editCollectionForm.value;
      let tmpArr: any = [];
      let slotArr = this.slots.value;
      slotArr.forEach(element => {
        let object: any = {};
        object['start'] = element.start;
        object['end'] = element.end;
        tmpArr.push(object);
      });0.
      // deliveryslotObj
      if(checkUserType){
        this.deliveryslotObj.chef_id = this.data.profile_data.id;
        this.deliveryslotObj.slots = tmpArr
      }else{
        this.deliveryslotObj.chef_id = 0;
        this.deliveryslotObj.slots = tmpArr
      }
      // {chef_id:0,slots:tmpArr}
      this.postAPIResponse(url+this.url,this.deliveryslotObj,message);
    }else{
      CommonUtils.validateAllFormFields(this.editCollectionForm);
    }
    
    
  }

  transformAmount(element){
    let formattedAmount = this.currencyPipe.transform(this.editMinimumOrderForm.get('minimum_order').value, 'GBP');

    console.log(formattedAmount);
    console.log(element.target.value);
    element.target.value = formattedAmount;
    
  }

  postAPIResponse(url, value, message){

    if(this.data.type!=='profile' && this.data.type!=='banner'){
      
      this._dataService.save({url:url,data:value,isLoader:true})
        .pipe(first())
        .subscribe(
            data => {
                // Show the success message
                this._matSnackBar.open(message, 'CLOSE', {
                  verticalPosition: 'bottom',
                  horizontalPosition:'center',
                  duration        : 2000
                });
                this.dialogRef.close();
                this,this.isSubmit = false;
            },
            error => {
                // Show the error message
                this.loader = false;
                this.isSubmit = false;
                this._matSnackBar.open(error.error.message, 'Retry', {
                    verticalPosition: 'bottom',
                    horizontalPosition:'center',
                    duration        : 2000
                });
        });
    }else{
      this._dataService.saveMedia({url:url,data:value,isLoader:true})
        .pipe(first())
        .subscribe(
            data => {
                // Show the success message
                this._matSnackBar.open(message, 'CLOSE', {
                    verticalPosition: 'bottom',
                    horizontalPosition:'center',
                    duration        : 2000
                });
                this.dialogRef.close();
            },
            error => {
                // Show the error message
                this.isSubmit= false;
                this.loader = false;
                this._matSnackBar.open('please try again', 'Retry', {
                    verticalPosition: 'bottom',
                    horizontalPosition:'center',
                    duration        : 2000
                });
        });
    }
  }

  RemovePicture() {
    this.tmp_avatar_img = '';
  }

  startSlotsChange(event, index) {
    this.getStartSlots(event.value, index);
  }

  getStartSlots(value,idx) {
    let index = this.startSlotsList.findIndex((x => x === value));

    let tmpArr: any = [];

    if(index!==-1){
      for(let i=index + 1;i<this.startSlotsList.length;i++){
        tmpArr.push(this.startSlotsList[i]);
      }

      this.slots.controls[idx].get('endSlotsList').setValue(tmpArr);
      this.endSlotsList = tmpArr;
    }
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
 export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if ( !control.parent || !control )
  {
      return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('confirm_password');

  if ( !password || !passwordConfirm )
  {
      return null;
  }

  if ( passwordConfirm.value === '' )
  {
      return null;
  }

  if ((password && password.value && password.value.trim()) === (passwordConfirm && passwordConfirm.value && passwordConfirm.value.trim()))
  {
      return null;
  }

  return {passwordsNotMatching: true};
};


