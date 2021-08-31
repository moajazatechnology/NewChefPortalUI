import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/dataservice';
import { CustomerSingleOrderComponent } from '../customer-single-order/customer-single-order.component';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss']
})
export class CustomerOrdersComponent implements OnInit {

  ordersList: any = [];
  showLoader: boolean = true;
  constructor(
    private router: Router,
    private dialog : MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {

    this.dataService.getAllList({url: 'orders/get_list' ,data:'', isLoader:true})
    .subscribe(res => {
      this.ordersList = res;
      this.showLoader = false;
      console.log(res);
    });
  }
  openOrderProductDialog() {
    this.router.navigate(['/view-chefs']);
  }

  viewOrder(id) {

    this.dataService.getAllList({url: 'orders/get_single' ,data:{order_id: id}, isLoader:true})
    .subscribe(res => {

        let dialogRef = this.dialog.open(CustomerSingleOrderComponent, {
          data:res,
          width: '600px',
          height:'800px',
          disableClose:true
        });
    
      console.log(res);
    });
  }

}
