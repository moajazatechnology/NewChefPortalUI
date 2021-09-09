import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewOrderComponent } from 'src/app/main/chefs/orders/view-order/view-order.component';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-view-single-order-admin',
  templateUrl: './view-single-order-admin.component.html',
  styleUrls: ['./view-single-order-admin.component.scss']
})
export class ViewSingleOrderAdminComponent implements OnInit {

  id: number = 0;
  orderData: any = {};

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
