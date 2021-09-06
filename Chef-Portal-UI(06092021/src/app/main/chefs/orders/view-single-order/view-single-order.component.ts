import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/_services/dataservice';

@Component({
  selector: 'app-view-single-order',
  templateUrl: './view-single-order.component.html',
  styleUrls: ['./view-single-order.component.scss']
})
export class ViewSingleOrderComponent implements OnInit {

  constructor(
    private _dataService: DataService,
    private route: ActivatedRoute
  ) { 
    let data =  this.route.snapshot.params;
    this.getSingleorder(data.id);
  }

  ngOnInit(): void {
    
  }

  getSingleorder(id) {

    this._dataService.getSingleOrder({url: 'order/get_single/' +id ,isLoader:true})
     .subscribe(res => {
 
       console.log(res);
     });
   }

}
