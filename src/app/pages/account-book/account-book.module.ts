import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountBookRoutingModule } from './account-book-routing.module';
import { AccountBookComponent } from './account-book.component';
import { AddBillComponent } from './add-bill/add-bill.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterConditionComponent } from './filter-conditon/filter-condition.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AddBillDialogComponent } from './add-bill-dialog/add-bill-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

const DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM',
  },
  display: {
    dateInput: 'YYYY-MM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AccountBookComponent,
    AddBillComponent,
    FilterConditionComponent,
    AddBillDialogComponent,
  ],
  imports: [
    CommonModule,
    AccountBookRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
    [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    ],
  ],
})
export class AccountBookModule {}
