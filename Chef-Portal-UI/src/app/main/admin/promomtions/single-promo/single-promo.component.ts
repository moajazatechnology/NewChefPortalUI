import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/main/shared/components/confirm-dialog/confirm-dialog.component';
import { DataService } from 'src/app/_services/dataservice';
import { EditPromocodeComponent } from '../edit-promocode/edit-promocode.component';

@Component({
  selector: 'app-single-promo',
  templateUrl: './single-promo.component.html',
  styleUrls: ['./single-promo.component.scss']
})
export class SinglePromoComponent implements OnInit {

  showLoader: boolean = true;
  singlePromoInfo: any = {};

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private _matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    let data =  this.route.snapshot.params;
    this.getSinglePromo(data.id);
  }

  getSinglePromo(id) {
    this.dataService.getWithBody({url: 'promo/single?promo_id='+ id,isLoader:true})
    .subscribe(data =>{
      
      this.showLoader = false;
      this.singlePromoInfo = data;

    },error =>{
      this._matSnackBar.open(error.error.message, 'CLOSE', {
        verticalPosition: 'bottom',
        horizontalPosition:'center',
        duration        : 2000
      });
    })
  }

  editPromocode() {

    let dialogRef = this.dialog.open(EditPromocodeComponent, {
      data: this.singlePromoInfo,
      height: '700px',
      width: '600px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=='N') {
        this.getSinglePromo(this.singlePromoInfo.id);
      }
    });
  }

  deletePromo(id) {
    let message = 'Are you want delete this Promo?'
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
           this.router.navigate(['/admin/promotions']);
       //  }
     });
   }
}
