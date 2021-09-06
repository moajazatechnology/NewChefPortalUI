import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-chefs-list-for-product',
  templateUrl: './chefs-list-for-product.component.html',
  styleUrls: ['./chefs-list-for-product.component.scss']
})
export class ChefsListForProductComponent implements OnInit {

  public errorMsg: any;
  public tableContents: any = [];
  public displayedColumns: any = [];  
  public columns = [];
  public dataSource: MatTableDataSource<any>;
  // MatPaginator Inputs
  length: number = 0;
  pageSize: number = 20;
  page: number = 1;
  sortColumn: string;
  sortDirection: string;
  public showLoader: boolean = true;

  // MatPaginator Output
  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
      private _dataService: DataService,
      public datepipe: DatePipe) {
        this.columns = [
          {
            columnDef: 'id',
            header: ' ID',
            sortable: true
          },
          { 
            columnDef: 'name',
            header: 'Name',
            sortable: true
          },
          {
            columnDef: 'email',
            header: 'Email',
            sortable: true
          },
          {
            columnDef: 'phone_no',
            header: 'Phone Number',
            sortable: true
          },
          {
            columnDef: 'address',
            header: 'Address',
            sortable: true
          },
          {
            columnDef: 'enabled',
            header: 'Enabled',
            sortable: true
          }
      ];

  }

  ngOnInit() {
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.getList();
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.tableContents);
  }

  ngAfterViewInit() {
  	this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getList() {
   
    this._dataService.getAll({url:'admin/chefs', isLoader:true})
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
        obj['name'] = element.first_name + ' '+ element.second_name;
        obj['email'] = element.email;
        obj['address'] = (element._chef_store_address.address_1 && element._chef_store_address.address_1) + (element._chef_store_address.address_2!=='' ? ','+ element._chef_store_address.address_2 :'')+ (element._chef_store_address.address_3!=='' ? ','+element._chef_store_address.address_3:'' )+(element._chef_store_address.city!=='' ? ','+element._chef_store_address.city: '')+(element._chef_store_address.country!=='' ? ','+element._chef_store_address.country:'')+(element._chef_store_address.postcode!=='' ? ','+element._chef_store_address.postcode:'');
        obj['phone_no'] = element.phone_number;
        obj['enabled'] = element.enabled;

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

}
