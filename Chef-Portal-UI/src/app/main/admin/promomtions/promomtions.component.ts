import { Component, OnInit, ViewChild } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/_services/dataservice';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CreatePromotionComponent } from './create-promotion/create-promotion.component';
import { EditPromocodeComponent } from './edit-promocode/edit-promocode.component';

@Component({
  selector: 'app-promomtions',
  templateUrl: './promomtions.component.html',
  styleUrls: ['./promomtions.component.scss']
})
export class PromomtionsComponent implements OnInit {

  showLoader: boolean = true;
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

  // MatPaginator Output
  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService:DataService,
    private _matSnackBar: MatSnackBar,
    private dialog: MatDialog) {
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
          columnDef: 'expiry_date',
          header: 'Expiry Date',
          sortable: true
        },
       {
          columnDef: 'max_uses',
          header: 'Max Uses',
          sortable: true
        },
        {
          columnDef: 'total_uses',
          header: 'Total Uses',
          sortable: true
        },
        {
          columnDef: 'enabled',
          header: 'Enabled',
          sortable: true
        },
        {
          columnDef: 'action',
          header: 'Action',
          sortable: true
        }
    ];

  }

  ngOnInit(): void {
    this.getPromoList();
    this.displayedColumns = this.columns.map(c => c.columnDef);
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.tableContents);
  }

  getPromoList() {
    this.dataService.getWithBody({url: 'promo/list',isLoader:true})
    .subscribe(data =>{

      this.showLoader = false;
      this.tableContents = data;
      this.dataSource = new MatTableDataSource(this.tableContents);
      this.length = this.tableContents.length;
    },error =>{
      this._matSnackBar.open(error.error.message, 'CLOSE', {
        verticalPosition: 'bottom',
        horizontalPosition:'center',
        duration        : 2000
      });
    })
  }

  ngAfterViewInit() {
  	this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  sortData(sort: MatSort) {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction;
    this.getPromoList;
  }

  getNextPrevious(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getPromoList();
  }

  changeToggle(element) {

    this.showLoader = true;

    let data ={
      'promo_code_id':element.id,
      'enabled':element.enabled
    }

    this.dataService.post({url: 'promo/enable',data: data,isLoader:true})
    .subscribe(data =>{

      this.showLoader = false;
      this.getPromoList();
    },error =>{
      this._matSnackBar.open(error.error.message, 'CLOSE', {
        verticalPosition: 'bottom',
        horizontalPosition:'center',
        duration        : 2000
      });
      this.showLoader = false;
    });
  }

  editSelectedPromocode(element) {
    
    this.dataService.getWithBody({url: 'promo/single?promo_id='+ element.id,isLoader:true})
    .subscribe(data =>{
      data['chef_list'] = [element.chefs[0].chef_id];
      let dialogRef = this.dialog.open(EditPromocodeComponent, {
        data: data,
        height: '700px',
        width: '600px',
        disableClose:true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result!=='N') {
          this.getPromoList();
        }
      });
      
    },error =>{
      this._matSnackBar.open(error.error.message, 'CLOSE', {
        verticalPosition: 'bottom',
        horizontalPosition:'center',
        duration        : 2000
      });
    })
  }

  createNewPromo() {

    let dialogRef = this.dialog.open(CreatePromotionComponent, {
      data:null,
      height: '700px',
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N') {
        this.getPromoList();
      }
    });

  }

  deletePromoRecord(id) {
    let message = 'Are you want delete this promo?'
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '400px', data: message, disableClose: true })
       .afterClosed().subscribe(result => {
         if (result == 'YES') {
          this.showLoader = true;
           this.deleteData(id);
         }
       });
   }
   deleteData(id) {

    this.dataService.delete({ url: 'promo/delete/' + id, isLoader: true })
      .subscribe((response: any) => {
       //  if(response === {}){
           // Show the success message
           this.showLoader = false;
           this._matSnackBar.open('Promo deleted successfully', 'CLOSE', {
             verticalPosition: 'bottom',
             horizontalPosition:'center',
             duration        : 2000
           });
           this.getPromoList();
       //  }
     });
  }

}
