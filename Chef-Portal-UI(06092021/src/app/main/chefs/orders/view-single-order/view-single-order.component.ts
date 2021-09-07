import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/_services/dataservice';
import { ViewOrderComponent } from '../view-order/view-order.component';

@Component({
  selector: 'app-view-single-order',
  templateUrl: './view-single-order.component.html',
  styleUrls: ['./view-single-order.component.scss']
})
export class ViewSingleOrderComponent implements OnInit {

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

   goBack() {
     this.router.navigate(['orders']);
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
