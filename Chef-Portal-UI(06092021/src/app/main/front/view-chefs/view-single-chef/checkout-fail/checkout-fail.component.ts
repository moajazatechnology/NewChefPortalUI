import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout-fail',
  templateUrl: './checkout-fail.component.html',
  styleUrls: ['./checkout-fail.component.scss']
})
export class CheckoutFailComponent implements OnInit {
  isNavbarCollapsed=true;
  public showHideBasket:boolean= true;
  constructor() { }

  ngOnInit(): void {
  }
  showbasket(){
    this.showHideBasket = !this.showHideBasket;
  }
 hideBasket(){
   this.showHideBasket= false;
 }
}