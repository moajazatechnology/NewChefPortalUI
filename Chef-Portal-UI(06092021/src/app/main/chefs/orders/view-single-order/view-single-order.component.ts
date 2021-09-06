import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/_services/dataservice';
import { ViewOrderComponent } from '../view-order/view-order.component';

@Component({
  selector: 'app-view-single-order',
  templateUrl: './view-single-order.component.html',
  styleUrls: ['./view-single-order.component.scss']
})
export class ViewSingleOrderComponent implements OnInit {

  id: number = 0;
  ordereData: any = {};

  constructor(
    private _dataService: DataService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { 
    let data =  this.route.snapshot.params;
    this.id = data.id
    this.getSingleorder(data.id);
  }

  ngOnInit(): void {
    
  }

  getSingleorder(id) {

    this._dataService.getSingleOrder({url: 'order/get_single/' +id ,isLoader:true})
     .subscribe(res => {
        this.ordereData = res;
       console.log(res);
     });
   }

  viewOrder() {

    let dialogRef = this.dialog.open(ViewOrderComponent, {
      data:this.ordereData,
      width: '600px',
      height:'800px',
      disableClose:true
    });
    
  }

}
