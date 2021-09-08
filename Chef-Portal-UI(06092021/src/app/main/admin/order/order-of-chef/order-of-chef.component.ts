import { Component, OnInit , ViewChild} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import { DataService } from 'src/app/_services/dataservice';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-order-of-chef',
  templateUrl: './order-of-chef.component.html',
  styleUrls: ['./order-of-chef.component.scss']
})
export class OrderOfChefComponent implements OnInit {

  public errorMsg: any;
  public tableContents: any = [];
  public displayedColumns: any = [];  
  public columns = [];
  public statusList: any = [];
  public config_info: any;
  public dataSource: MatTableDataSource<any>;

  // MatPaginator Inputs
  length: number = 0;
  pageSize: number = 20;
  page: number = 1;
  sortColumn: string;
  sortDirection: string;
  public showLoader: boolean = true;

  userInfo : any ={};
  chefID :any ={};
  // MatPaginator Output
  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
      private _dataService: DataService,
      public datepipe: DatePipe,
      private router:Router,
      private _matSnackBar: MatSnackBar,
      private currencyPipe : CurrencyPipe,
      private _activatedRoute:ActivatedRoute) {
        this.columns = [
          {
            columnDef: 'id',
            header: 'Order ID',
            sortable: true
          },
          { 
            columnDef: 'status',
            header: 'Order Status',
            sortable: true
          },
          {
            columnDef: 'chef',
            header: 'Chef',
            sortable: true
          },
          {
            columnDef: 'customer',
            header: 'Customer',
            sortable: true
          },
          {
            columnDef: 'deliveryMode',
            header: 'Delivery Mode',
            sortable:true
          },
          {
            columnDef: 'orderDate',
            header:'Order Date',
            sortable:true
          },
          {
            columnDef: 'scheduleTime',
            header:'Slot',
            sortable:true
          },
          // {
          //   columnDef: 'paymentMethod',
          //   header:'Payment Method',
          //   sortable:true
          // },
          {
            columnDef: 'adress',
            header:'Address',
            sortable:true
          },
          {
            columnDef: 'account',
            header:'Amount',
            sortable:true
          },
          // {
          //   columnDef: 'rating',
          //   header:'Rating',
          //   sortable:true
          // }
      ];

  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(
      (res:any)=>{
        this.chefID = res['chef_id'];
      }
    )

    sessionStorage.setItem("chef_Id",this.chefID);
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.getList();
    this.getAllStatus();
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.tableContents);

    this.getCurrentChefInfo();
  }

  getCurrentChefInfo() {

    this._dataService.getChefInfo({url:'chef?chef_id=' + this.chefID , isLoader:true})
    .subscribe(response => {
      this.userInfo = response;
      this.showLoader = false;
    });
  }


  ngAfterViewInit() {
  	this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllStatus() {
    this._dataService.getAll({url:'order/status/options', isLoader:true})
      .subscribe(response =>
                  {
                    this.statusList = response;
                  },
      error => this.errorMsg = error);
  }

  viewSingleorder(id) {

    this.router.navigate(['/admin/chefs/view-order/',id]);
  }

  getList() {
   
    this._dataService.getAll({url:'order', isLoader:true})
      .subscribe(response =>
                  {
                      this.showLoader = false;
                      this.tableContents = this.formatElement(response);
                      this.dataSource = new MatTableDataSource(this.tableContents);
                      this.length = this.tableContents.length;
                  },
      error => this.errorMsg = error);
  }

  formatElement(data) {
    let tempArr : any[]= [];
    data.forEach(element => {
        let obj: any = {};
        obj['id'] = element.id;
        obj['status'] = element._order_status ? element._order_status.id : 0;
        obj['statusName'] = element._order_status ? element._order_status.status : '';
        obj['chef'] = element._chef.first_name + ' '+ element._chef.second_name;
        obj['customer'] = element._customer.first_name +' '+ element._customer.second_name;
        obj['deliveryMode'] = element.collection ? 'Collection' : 'Delivery';
        obj['orderDate'] = this.datepipe.transform(element.order_date, 'dd-MM-yyyy hh:mm');
        obj['scheduleTime'] = element.start_slot + ':00 - ' + element.end_slot + ':00';
        // obj['paymentMethod'] = element;
        obj['address'] = element._chef?._chef_store?.name;
        obj['account'] = this.currencyPipe.transform(element.order_total, 'GBP');
        // obj['rating'] = element;
        
        tempArr.push(obj);
    });
  	return tempArr;
  }


  sortData(sort: MatSort) {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction;
    this.getList();
  }

  getNextPrevious(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getList();
  }

  statusChange(event,order_id) {
    let data = {
      'order_id' : order_id,
      'status_id': event.value
    }
    this._dataService.save({url:'order/update_status',data:data,isLoader:true})
        .pipe(first())
        .subscribe(
            data => {
                // Show the success message
                this._matSnackBar.open('Status Changed Successfully', 'CLOSE', {
                  verticalPosition: 'bottom',
                  horizontalPosition:'center',
                  duration        : 2000
                });
            },
            error => {
                // Show the error message
                this._matSnackBar.open(error.error.message, 'Retry', {
                    verticalPosition: 'bottom',
                    horizontalPosition:'center',
                    duration        : 2000
                });
        });
  }

}
