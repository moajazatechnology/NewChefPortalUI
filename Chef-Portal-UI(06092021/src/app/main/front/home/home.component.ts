import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public address;
  public isSearch: boolean = false;

  constructor(
    private router: Router,
    private dataService: DataService
  ) {

  }


  initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete') as HTMLInputElement,
      {
        //types: ['address'],
        componentRestrictions: { 'country': ['UK'] },
        fields: ['geometry', 'name']
      }
    );

    let self_ref = this;
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place = autocomplete.getPlace();

      self_ref.isSearch = true;
      console.log(place);
      self_ref.address = place;
      self_ref.dataService.setAddressData(self_ref.address);
      console.log(self_ref.address)
    });
  }

  ngOnInit(): void {
    this.initAutocomplete();
  }

  searchAddress() {

    if (this.isSearch) {
      // this.router.navigate(['view-chefs'])
      const lat: number = this.address?.geometry?.location.lat();
      const lng: number = this.address?.geometry?.location.lng();
      this.router.navigate(['view-chefs'], { queryParams: { lat: lat, lng: lng } })
    }
    console.log(this.address);

  }

  scrollToTop() {
    window.scroll(0, 0);
  }
}
