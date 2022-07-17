import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bill, BillCategory } from '../../../service/account-book.service';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MAT_DATE_FORMATS } from '@angular/material/core';

const DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-bill-dialog',
  templateUrl: './add-bill-dialog.component.html',
  styleUrls: ['./add-bill-dialog.component.less'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }],
})
export class AddBillDialogComponent implements OnInit {
  category = new FormControl('', Validators.required);
  amount = new FormControl('', [Validators.required,Validators.pattern(/-?(0|[1-9]\d*)(\.\d+)?/)]);
  time = new FormControl(moment(), Validators.required);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<AddBillDialogComponent, Bill>
  ) {}

  ngOnInit(): void {}

  confirm(): void {
    if (this.category.valid && this.amount.valid && this.time.valid) {
      this.dialogRef.close({
        category: this.category.value!,
        type: this.data.categoryList.find(
          (item) => item.id === this.category.value
        )!.type,
        amount: this.amount.value!,
        time: this.time.value!.toString(),
      });
    }
  }
}

export interface DialogData {
  categoryList: BillCategory[];
}
