import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bill, BillCategory} from '../../../service/account-book.service';
import {MatDialog} from '@angular/material/dialog';
import {
  AddBillDialogComponent,
  DialogData,
} from '../add-bill-dialog/add-bill-dialog.component';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.less'],
})
export class AddBillComponent {
  @Input()
  categoryList: BillCategory[] = [];

  @Output()
  addSuccess = new EventEmitter<Bill>();

  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    const ref = this.dialog.open<AddBillDialogComponent, DialogData, Bill>(
      AddBillDialogComponent,
      {
        width: '480px',
        data: {categoryList: this.categoryList},
      }
    );
    ref.afterClosed().subscribe(res => {
      if (res) {
        this.addSuccess.emit(res)
      }
    })
  }
}
