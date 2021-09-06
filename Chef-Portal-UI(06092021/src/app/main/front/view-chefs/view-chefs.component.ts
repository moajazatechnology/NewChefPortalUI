import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/_services/dataservice';
import { ActivatedRoute } from '@angular/router';

export interface ImageData{
  image: string;
  thumbImage: string;
  name: string;
}

@Component({
  selector: 'app-view-chefs',
  templateUrl: './view-chefs.component.html',
  styleUrls: ['./view-chefs.component.scss']
})
export class ViewChefsComponent implements OnInit {

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect; 
  @ViewChild('nav') slider: ViewChefsComponent;
  imageObject = [];
  public category_name: string = 'All';
  public chefsList: any = [];
  public allChefsList: any = [];
  public allCuisinesList: any = [];
  public allergenList: any = [];
  public dietaryList: any = [];
  public todaysDate: Date = new Date();
  public dateArr: any = [];
  
  public address;
  public lat:any;
  public lng:any;
  public isSearch: boolean = false;
  public AllergyMultiFilterCtrl: FormControl = new FormControl();
  public DietaryMultiFilterCtrl: FormControl = new FormControl();

  public filteredAllergyMulti: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  public filteredDietaryMulti: ReplaySubject<[]> = new ReplaySubject<[]>(1);

  protected _onDestroy = new Subject<void>();

  constructor(
    private dataService: DataService,private _activatedRoute:ActivatedRoute) {
      this._activatedRoute.queryParams.subscribe(
        (res:any)=>{
          this.lat = res['lat']
          this.lng= res['lng']
        }
      );  
      for(let i=1;i<=7;i++){
        var date = new Date();
        this.dateArr.push(date.setDate(date.getDate() + i));``
      }
      // this.todaysDate.setDate(this.todaysDate.getDate() + 7);
     }

  ngOnInit(): void {
    
    this.getAllCuisines();
    // this.getStoredAddress(); 
    this.getAllChefsWithParams();
    this.getAllergen();
    this.getDietaries();

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
    if (!this.dietaryList) {
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

  getStoredAddress(){
    // Subscribe to get updated result
    this.dataService.getAddressData().subscribe(addressData => {
      console.log(addressData);
      this.getAllChefs(addressData);

      var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-0.174848080291502, 51.4842512197085),
        new google.maps.LatLng(-0.172150119708498, 51.4869491802915));
      
      var input = document.getElementById('autocomplete1') as HTMLInputElement;
      
      var searchBox = new google.maps.places.SearchBox(input, {
        bounds: defaultBounds
      });
  
      });
    
  }

  getAllergen() {

    this.dataService.getAllAllergensDietaries({url:'product/allergen_info',isLoader:true})
    .subscribe(response =>{
      this.allergenList = response;
      this.filteredAllergyMulti.next(this.allergenList.slice());
      // this.showLoader = false;
      console.log(this.allergenList);
    });
  }

  getDietaries() {

    this.dataService.getAllAllergensDietaries({url:'product/dietary_info',isLoader:true})
    .subscribe(response =>{
      this.dietaryList = response;
      this.filteredDietaryMulti.next(this.dietaryList.slice());
      // this.showLoader = false;
      console.log(this.dietaryList);
    });
  }

  onAddressSearch() {

    if(this.isSearch){
     
      this.getStoredAddress();
    }   
  }

  getAllChefs(addressData) {

    let data = {user_location: {lat:addressData?.geometry?.location.lat() || 23, lng:addressData?.geometry?.location.lng() || 11}}
    this.dataService.getAllChefList({url: 'chef/get_list', data: data ,isLoader:true})
    .subscribe(response =>{
      let res = response as any;
      this.chefsList = res;
      this.allChefsList = this.chefsList;
      // this.applyDateModeFilter([new Date()]);
    });
  }

  getAllChefsWithParams() {
    let data = {user_location: {lat:this.lat, lng:this.lng}}
    this.dataService.getAllChefList({url: 'chef/get_list', data: data ,isLoader:true})
    .subscribe(response =>{
      let res = response as any;
      this.chefsList = res;
      this.allChefsList = this.chefsList;
      // this.applyDateModeFilter([new Date()]);
    });
  }

  getAllCuisines() {

    this.dataService.get({url: 'cuisines/options', isLoader:true})
    .subscribe(response =>{
      this.allCuisinesList = response;
      this.getJsonImageWithName(response);
      console.log(this.imageObject);
    });
  }

  getJsonImageWithName(data) {
    // let responseTempArr: any = dat;
    let ImageTempArr: any = [];

    data.forEach(element => {
      let obj:any = {};
      obj.image = element.image ? element.image.url : '';
      obj.thumbImage = element.image ? element.image.url : '';
      obj.title = element.name;
      obj.id = element.id
      ImageTempArr.push(obj);
    });

    this.imageObject = ImageTempArr;
  }

  //Filter Cuisines 
  onImageClick(index) {
    let imageObj: any = this.imageObject[index];
    this.category_name = imageObj.title;
    this.allChefsList = this.getFilteredCuisines(imageObj);
    console.log(imageObj);
  }

  getFilteredCuisines(imageObj) {

    let cuisineListTemp: any = [];
    
    this.chefsList.forEach(chef => {
        chef.cusines.forEach(cuisine => {
            if(cuisine.name === imageObj.title) {
              cuisineListTemp.push(chef);
            }
        });
    });

    return cuisineListTemp;
  }

  //Filter Delivery type
  applyDeliveryModeFilter(typeArr) {

    let chefsListTemp: any = [];
    this.category_name = 'All';

    typeArr.forEach(element => {
      this.chefsList.forEach(chef => {
        if(element === 'delivery'){
          if(chef.delivery){
            let duplicateChef = chefsListTemp.find(c => c.id === chef.id);
              if(duplicateChef === undefined){
                chefsListTemp.push(chef);
              }
          }
        }else if(element === 'collection') {
          if(chef.collection){
          let duplicateChef = chefsListTemp.find(c => c.id === chef.id);
             if(duplicateChef === undefined){
              chefsListTemp.push(chef);
             }
          }
        }
      });
    });

    this.allChefsList = typeArr.length > 0 ? chefsListTemp : this.chefsList;
  }

  applyAllergenModeFilter(idArr) {

console.log(idArr);
    this.category_name = 'All';
    let chefsListTemp: any = [];

  let chefTempArr:any = [];
    this.chefsList.forEach(chef => {
      idArr.forEach(id => {
        chef.allergens.forEach(element => {
          console.log(id);
          if(element.allergens_id === id){
            console.log('inner',id);
            let duplicateChef = chefsListTemp.find(c => c.id === chef.id);
            if(duplicateChef === undefined){
              console.log('push');
              chefsListTemp.push(chef);
            }
          }
        });
      });
    });
    chefTempArr= chefsListTemp;
    console.log(chefsListTemp);
    
    if(idArr.length > 0){
      let tempArr: any = [];
      let tempArrChefs: any = chefsListTemp;
      this.chefsList.forEach(element => {
        console.log(element);
        chefsListTemp.forEach((element1,index) => {
          console.log(element1);
          if(element.id === element1.id){
            // tempArr.push(element);
            // tempArrChefs.splice(index,1);
          }
        });
      });
      this.allChefsList = chefTempArr.length === 0 ? this.chefsList : tempArrChefs;
    }else {
      this.allChefsList = this.chefsList;
    }

    console.log(this.allChefsList);
  
  }

  applyDiateryModeFilter(idArr) {

    this.category_name = 'All';
    let chefsListTemp: any = [];

    this.chefsList.forEach(chef => {
      chef.dietary.forEach(element => {
        idArr.forEach(id => {
          if(element.dietary_id === id){
            console.log(id);
          let duplicateChef = chefsListTemp.find(c => c.id === chef.id);
          if(duplicateChef === undefined){
            chefsListTemp.push(chef);
          }
          }
        });
      });
    });
    this.allChefsList = idArr.length > 0 ? chefsListTemp : this.chefsList;
  }

  applyDateModeFilter(dateArr) {

    this.category_name = 'All';
    let chefsListTemp: any = [];

    this.chefsList.forEach(chef => {
      chef.availabilities.forEach(element => {
        console.log(new Date(element.available_date));
        dateArr.forEach(dateObj => {
          console.log(new Date(dateObj));
          console.log(this.dataService.getDateFormat(new Date(element.available_date)) === this.dataService.getDateFormat(new Date(dateObj)))
          if(this.dataService.getDateFormat(new Date(element.available_date)) === this.dataService.getDateFormat(new Date(dateObj))){
            console.log(this.dataService.getDateFormat(new Date(element.available_date)));
            console.log(this.dataService.getDateFormat(new Date(dateObj)));
            console.log(this.dataService.getDateFormat(new Date(element.available_date)) === this.dataService.getDateFormat(new Date(dateObj)));
            let duplicateChef = chefsListTemp.find(c => c.id === chef.id);
            if(duplicateChef === undefined){
              chefsListTemp.push(chef);
            }
          }
        });
      });
    });
    this.allChefsList = dateArr.length > 0 ? chefsListTemp : this.chefsList;
  }

   ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
