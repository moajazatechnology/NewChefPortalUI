import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
// import { BehaviorSubject, Subject } from 'rxjs';
import { LoaderState } from '../_interface';

@Injectable({
  providedIn: 'root'
})

export class LoaderService {

  constructor(private spinner: NgxSpinnerService) {}

  start() {
    this.spinner.show();
  }

  stop() {
    this.spinner.hide();
  }
  // private loaderSubject = new Subject<LoaderState>();
  // loaderState = this.loaderSubject.asObservable();
  // constructor() { }

  // start() {
  //   console.log('loaderSubject',this.loaderSubject);
  //   console.log('loaderState',this.loaderState);
  //   console.log(this.loaderSubject.next({ show: true }))
  //   this.loaderSubject.next({ show: true });
  //   console.log('in loader');
  // }
  // stop() {
  //   this.loaderSubject.next(<LoaderState>{ show: false });
  // }
}
