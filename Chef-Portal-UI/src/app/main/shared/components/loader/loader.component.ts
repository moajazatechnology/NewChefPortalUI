import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { LoaderState } from 'src/app/_interface';
import { LoaderService } from 'src/app/_services/loaderservice';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  show = false;
  // private subscription: Subscription;
  // constructor(private loaderService: LoaderService) { }
  ngOnInit() {
    console.log('iloader ')
    // this.subscription = this.loaderService.loaderState
    // .subscribe((state: LoaderState) => {
    //   console.log(state);
    //   this.show = state.show;
    //   console.log(this.show);
    // });
  }
  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
}
