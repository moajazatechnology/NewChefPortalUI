import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/_services/dataservice';
import { MenuService } from 'src/app/_services/menu.service';
import { CreateMenuComponent } from '../../chefs/menus/create-menu/create-menu.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  refresh: Subject<any> = new Subject();
  menuList:any = [];
  public showLoader: boolean = true
  chefID:any;
  userInfo :any={};


  constructor(  private dialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _manuService: MenuService,
    private dataService: DataService,
    private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.chefID = this.activatedRoute.snapshot.params.id
    sessionStorage.setItem("chef_Id",this.chefID);
    /**
       * Watch re-render-refresh for updating db
       */
     this.refresh.subscribe(updateDB => {
      if ( updateDB )
      {
          this._manuService.updateMenus(this.menuList);
      }
    });

    this._manuService.onMenusUpdated.subscribe(menus => {
      console.log(menus);
        this.getMenus();
        this.refresh.next();
    });
    this.getMenus();
    this.getCurrentChefInfo();
  }

  getCurrentChefInfo() {

    this.dataService.getChefInfo({url:'chef?chef_id=' + this.chefID , isLoader:true})
    .subscribe(response => {
      this.userInfo = response;
      this.showLoader = false;
    });
  }

  getMenus(): void
  {
    
    this.dataService.getWithBody({url:'menu?chef_id='+this.chefID,isLoader:true})
    .subscribe(response =>{
      this.menuList = response;
      this.showLoader = false;
    });
  }


  openCreateMenuDialog() {
    let dialogRef = this.dialog.open(CreateMenuComponent, {
      data:null,
      height: '450px',
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMenus();
      this.refresh.next();
    });
  }

  openEditDialog(data){

    let dialogRef = this.dialog.open(CreateMenuComponent, {
      data: data,
      height: '700px',
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMenus();
      this.refresh.next();
    });
  }

  deleteSelectedMenu(id) {

    let message = 'Are you want delete this Menu?'
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '400px', data: message, disableClose: true })
       .afterClosed().subscribe(result => {
         if (result == 'YES') {
           this.showLoader = true;
           this.deleteData(id);
         }
       });
   }

   deleteData(id) {

    this.dataService.delete({ url: 'menu/delete/' + id+"?chef_id="+this.chefID, isLoader: true })
      .subscribe((response: any) => {
       //  if(response === {}){
           // Show the success message
           this.showLoader = false;
           this._matSnackBar.open('Menu deleted successfully', 'CLOSE', {
             verticalPosition: 'bottom',
             horizontalPosition:'center',
             duration        : 2000
           });
           this.getMenus();
           this.refresh.next();
       //  }
     });
  }
}
