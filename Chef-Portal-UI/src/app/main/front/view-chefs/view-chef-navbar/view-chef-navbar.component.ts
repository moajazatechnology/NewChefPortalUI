import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-view-chef-navbar',
  templateUrl: './view-chef-navbar.component.html',
  styleUrls: ['./view-chef-navbar.component.scss']
})
export class ViewChefNavbarComponent implements OnInit {

  isSearch: boolean = false;
  customerToken: any;
  customerInfo: any = {};
  public isNavbarCollapsed:boolean = true;
  @Output() searchAddress = new EventEmitter();

  constructor(
    private dataService: DataService,
    private router: Router) { 
    this.customerToken = localStorage.getItem('customertoken');
    this.customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
  }

  ngOnInit(): void {
    this.initAutocomplete();
  }

  initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete1') as HTMLInputElement,
      {
        //types: ['address'],
        componentRestrictions: {'country': ['UK']},
        fields: ['geometry','name']
      }
    );

    let self_ref = this;
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place = autocomplete.getPlace();

        self_ref.isSearch = true;
        console.log(place);
        self_ref.dataService.setAddressData(place);
    });
  }

  onAddressSearch() {

    if(this.isSearch){
     
      // this.getStoredAddress();
      this.searchAddress.emit('');
    }   
  }

  logout() {
    localStorage.removeItem('customertoken');
    localStorage.removeItem('chefsInfo');
    localStorage.removeItem('customerInfo');
    localStorage.removeItem('chefsBasketedProduct');
    this.router.navigate(['/']);
  }
}
