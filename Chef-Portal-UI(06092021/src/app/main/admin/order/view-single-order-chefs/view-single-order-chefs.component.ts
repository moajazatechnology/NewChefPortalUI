import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewOrderComponent } from 'src/app/main/chefs/orders/view-order/view-order.component';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-view-single-order-chefs',
  templateUrl: './view-single-order-chefs.component.html',
  styleUrls: ['./view-single-order-chefs.component.scss']
})
export class ViewSingleOrderChefsComponent implements OnInit {
  id: number = 0;
  orderData: any = {};

  chef_id: string;

  constructor(
    private _dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { 
    let data =  this.route.snapshot.params;
    this.id = data.id
    this.getSingleorder(data.id);
  }

  ngOnInit(): void {

    this.chef_id = sessionStorage.getItem("chef_Id");
    
  }

  getSingleorder(id) {

    this._dataService.post({url: 'order/get_single', data: {order_id:id},isLoader:true})
     .subscribe(res => {
        this.orderData = res;
       console.log(res);
     });
   }

  viewOrder() {
    this.orderData['id'] = this.id;
    let dialogRef = this.dialog.open(ViewOrderComponent, {
      data:this.orderData,
      width: '600px',
      height:'800px',
      disableClose:true
    });
    
  }

}
