import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/_services/dataservice';
import { CreateProductComponent } from '../../chefs/products/create-product/create-product.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productList:any = [];
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  public showLoader:boolean = true;
  chefList : any =[];
  errorMsg : any;
  chefid : any;
  token:any;
  userType : boolean;
  userInfo :any ={};
  constructor( private dialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private dataService: DataService,
    private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.chefid = this.activatedRoute.snapshot.params.id;
    sessionStorage.setItem("chef_Id", this.chefid);
    this.getProducts();
    this.token =JSON.parse(localStorage.getItem('token'))

    this.getCurrentChefInfo();
    // this.userType =JSON.parse(localStorage.getItem('userType'));
    // console.log("UserType  =>",this.userType)
    
  }
  getCurrentChefInfo() {

    this.dataService.getChefInfo({url:'chef?chef_id=' + this.chefid, isLoader:true})
    .subscribe(response => {
      this.userInfo = response;
      this.showLoader = false;
    });
  }

  getProducts() {
    let deta ={
      chef_id : this.chefid
    }
    this.dataService.getWithBody({url:'product?chef_id='+this.chefid,isLoader:true})
    .subscribe(response =>{
      this.productList = response;
      this.showLoader = false;
    });
  }

   /**Delete Selected**/
   deleteSelectedProduct(id) {

    let message = 'Are you want delete this product?'
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '400px', data: message, disableClose: true })
       .afterClosed().subscribe(result => {
         if (result == 'YES') {
          this.showLoader = true;
           this.deleteData(id);
         }
       });
   }
   deleteData(id) {

    this.dataService.delete({ url: 'product/' + id, isLoader: true })
      .subscribe((response: any) => {
       //  if(response === {}){
           // Show the success message
           this.showLoader = false;
           this._matSnackBar.open('Product deleted successfully', 'CLOSE', {
             verticalPosition: 'bottom',
             horizontalPosition:'center',
             duration        : 2000
           });
           this.getProducts();
       //  }
     });
  }

  openCreateProductDialog() {
    let dialogRef = this.dialog.open(CreateProductComponent, {
      data:null,
      height: '700px',
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProducts();
    });
  }

  getChefList() {
   
    this.dataService.getAll({url:'admin/chefs', isLoader:true})
      .subscribe(response =>
                  {
                      this.showLoader = false;
                      this.chefList = response;
                      console.log(response);
                      
                  },
      error => this.errorMsg = error);
  }

  openEditDialog(data){

    let dialogRef = this.dialog.open(CreateProductComponent, {
      data:data,
      height: '700px',
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProducts();
    });
  }
}
