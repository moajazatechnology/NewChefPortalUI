import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDividerModule} from '@angular/material/divider';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const modules = [
  CommonModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule ,
  ReactiveFormsModule,
  FormsModule,
  MatCheckboxModule,
  MatMenuModule,
  FlexLayoutModule,
  MatSnackBarModule,
  MatSelectModule,
  MatDialogModule,
  MatRadioModule,
  NgxMatSelectSearchModule,
  MatSlideToggleModule,
  MatDividerModule,
  MatDatepickerModule,
  MatTooltipModule,
  ColorPickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatPaginatorModule,
  NgxSpinnerModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: modules,
  exports: modules,
  declarations: [

  ],
})
export class MaterialModule { }
