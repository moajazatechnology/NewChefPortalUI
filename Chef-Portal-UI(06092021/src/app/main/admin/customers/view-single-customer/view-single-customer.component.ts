import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-view-single-customer',
  templateUrl: './view-single-customer.component.html',
  styleUrls: ['./view-single-customer.component.scss']
})
export class ViewSingleCustomerComponent implements OnInit {

  showLoader: boolean = true;
  customerData: any = {};

  constructor(
    private _dataService: DataService,
    private _matSnackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { 
    let data =  this.route.snapshot.params;
    this.getSingleCustomer(data.id);
  }

  ngOnInit(): void {
    
  }

  getSingleCustomer(id) {

    this._dataService.post({url: 'admin/customers/get_single',data: {customer_id:id},isLoader:true})
    .subscribe(data =>{
      this.customerData = data;
      this.showLoader = false;
    },error =>{
      this._matSnackBar.open(error.error.message, 'CLOSE', {
        verticalPosition: 'bottom',
        horizontalPosition:'center',
        duration        : 2000
      });
      this.showLoader = false;
    });
  }

}
