import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarEvent } from 'angular-calendar';
import { CommonUtils } from 'src/app/_helpers/common.utils';
// import { MatColors } from 'src/app/mat-colors';
import { CalendarEventModel } from 'src/app/_models/event.model';
import { DataService } from 'src/app/_services/dataservice';
import { MenuService } from 'src/app/_services/menu.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class CalendarEventFormDialogComponent implements OnInit {

  action: string;
  event: CalendarEvent;
  eventForm: FormGroup;
  dialogTitle: string = '';
  // presetColors = MatColors.presets;
  startDate = new Date();
  endDate = new Date();
  menuList: any[] = [];
  inventoriesList: any = [];
  public isSubmit: boolean = false;
  public loader: boolean = false;
  public showLoader: boolean = true;
  public inventoriesListTemp: any = [];

  url :any;

  /**
   * Constructor
   *
   * @param {MatDialogRef<CalendarEventFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      public matDialogRef: MatDialogRef<CalendarEventFormDialogComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private _formBuilder: FormBuilder,
      private _manuService: MenuService,
      private _matSnackBar:MatSnackBar,
      private _dataService: DataService
  )
  {
    this.endDate.setDate(this.endDate.getDate() + 28);
    this.startDate.setDate(this.startDate.getDate() + 1);
    console.log(this._data);
    
  }
  ngOnInit() {
    this.getMenus();
  }

  fillFormValues(){
    
    let chef_id = this._data._product_menu ? this._data._product_menu.chef_id : 0;
    let menu_id = this._data._product_menu ? this._data._product_menu.id : 0;
    let available_date = this._data.available_date ? new Date(this._data.available_date) : new Date(this.startDate);
    let ispublic = this._data.public ? this._data.public : true;
    let availability_id = this._data.id ? this._data.id : 0;
    this.changeMenuSelection(menu_id);
    let arr = this.getProductInventories(this._data.product_menu_inventories) ;
    this.inventoriesList = arr;
    console.log(this.inventoriesList);
    this.eventForm = new FormGroup({
      chef_id : new FormControl(chef_id),
      menu_id : new FormControl(menu_id,[Validators.required]),
      available_date   : new FormControl(available_date,[Validators.required]),
      public : new FormControl(ispublic,[Validators.required]),
      availability_id: new FormControl(availability_id)
    });

    console.log(this.eventForm.value);
  }

  getMenus(): void
  {
    let userType = localStorage.getItem('userType');
            let checkUserType = userType === 'true' ? true : false;
            if (checkUserType) {
                this.url = "?chef_id="+sessionStorage.getItem("chef_Id");
            }else{
                this.url ="";
            }



    this._dataService.getAll({url:'menu'+this.url,isLoader:true})
      .subscribe(respose => {
        this.menuList = respose as any;
        this.showLoader = false;

        if ( this._data)
        {
            this.fillFormValues();
            this.dialogTitle = 'Edit Event';
            
        }
        else
        {
          this.eventForm = this.createEventForm(); 
          this.dialogTitle = 'New Event';
        }
      })
  }
  
  changeMenuSelection(id) {
    console.log(id);
    let menu_id = id;
    let menuIdSelectedDropdown = this.menuList.find((menu) => (menu.id === menu_id));
    console.log(menuIdSelectedDropdown);
    console.log(this.menuList);

    if(menuIdSelectedDropdown) {
      this.inventoriesList = this.getmappedList(menuIdSelectedDropdown._products);
      this.inventoriesListTemp = this.inventoriesList;
    }

    console.log(this.inventoriesList);
  }

  getmappedList(data) {
    let tempArr = [];
    data.forEach(element => {
        let obj = {};
        obj['product_id'] = element.product_id;
        obj['name'] = element.name;
        obj['limited'] = false;
        obj['count'] = 1;
        tempArr.push(obj);
    });
    return tempArr;
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create the event form
   *
   * @returns {FormGroup}
   */
  createEventForm(): FormGroup
  {
    console.log(this._data);

    return new FormGroup({
      chef_id : new FormControl(0),
      menu_id : new FormControl('',[Validators.required]),
      available_date   : new FormControl(new Date(this.startDate),[Validators.required]),
      public : new FormControl(true,[Validators.required]),
      // inventory: new FormArray([
      //   product_id:new FormControl(0)
      // ])
    });
  }

  getProductInventories(data){
    let tempArr = [];
    console.log(this.inventoriesListTemp);
    console.log(data);
    this.inventoriesListTemp.forEach(element => {
        data.forEach(element1 => {
            if(element.product_id===element1.product_id){
              
              element.limited = element1.limited;
              element.count = element1.inventory_count;
              console.log(element);
              tempArr.push(element);
            }
        });
    });
    return tempArr;
  }

  onClickAdd(event) {
    let userType = localStorage.getItem('userType');
    let checkUserType = userType === 'true' ? true : false;
    if (checkUserType) {
        this.url = "?chef_id="+sessionStorage.getItem("chef_Id");
    }else{
        this.url ="";
    }


    event.preventDefault();
    event.stopPropagation();
    if (this.eventForm.valid) {
      
      let formValue = this.eventForm.value;
      console.log(formValue);
      this.inventoriesList.forEach(element => {
        delete element.name;
      });
      formValue.inventory = this.inventoriesList;
      this.isSubmit = true;
      this.loader = true;
      //Define formdata
      let message = this._data!==null ? 'Schedule Edited successfully' : 'Schedule created successfully';
      let url = this._data!==null ? 'schedule/update' : 'schedule/create';
      
      if(checkUserType){
        formValue.chef_id = sessionStorage.getItem("chef_Id");
      }


      this._dataService.save({url: url+this.url, data:formValue,isLoader:true})
        .subscribe(uploadResponse=>{
          console.log(uploadResponse);
          this.matDialogRef.close();
          this.isSubmit = false;
          // Show the success message
          this._matSnackBar.open(message, 'CLOSE', {
            verticalPosition: 'bottom',
            horizontalPosition:'center',
            duration        : 2000
        });
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
      CommonUtils.validateAllFormFields(this.eventForm);
    }
    
  }

  removeInventory(index) {
    this.inventoriesList[index].count = 0;
    this.inventoriesList[index].limited = false;
  }

  changeLimited(event,index) {
    this.inventoriesList[index].limited = event.checked;
  }

  changeCount(event,i) {
    console.log(event.target.value);
    console.log(i);
    // if(type==='add'){
      this.inventoriesList[i].count = event.target.value;
    // }
    // else{
    //   this.inventoriesList[i].count = ++(this.inventoriesList[i].count);
    // }
  }
}
