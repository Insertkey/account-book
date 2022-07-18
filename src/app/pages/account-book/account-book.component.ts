import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  AccountBookService,
  bill,
  Bill,
  billCategory,
  BillCategory,
} from '../../service/account-book.service';
import {
  catchError,
  delay,
  EMPTY,
  finalize,
  first,
  forkJoin,
  map,
  merge,
  of,
} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FilterCondition } from './filter-conditon/filter-condition.component';
import * as moment from 'moment';
import Decimal from 'decimal.js';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-account-book',
  templateUrl: './account-book.component.html',
  styleUrls: ['./account-book.component.less'],
})
export class AccountBookComponent implements OnInit, AfterViewInit {
  rawBillList: Bill[] = [];
  dataSource = new MatTableDataSource<Bill>([]);
  categoryList: BillCategory[] = [];

  loading = false;
  displayedColumns: Array<keyof Bill> = ['category', 'type', 'time', 'amount'];
  filterCondition: FilterCondition | undefined;

  @ViewChild(MatSort) sort!: MatSort;

  get showTotal() {
    return this.dataSource.data.length > 0;
  }

  get totalIncome() {
    return this.dataSource.data
      .filter((item) => item.type === '1')
      .reduce(
        (acc, value) => new Decimal(value.amount).add(acc),
        new Decimal(0)
      )
      .toFixed(2);
  }

  get totalExpend() {
    return this.dataSource.data
      .filter((item) => item.type === '0')
      .reduce(
        (acc, value) => new Decimal(value.amount).add(acc),
        new Decimal(0)
      )
      .abs()
      .toFixed(2);
  }

  constructor(private accountBookService: AccountBookService) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin([this.getBillList(), this.getCategoryList()])
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        const [billList, categoryList] = res;
        this.rawBillList = billList;
        this.categoryList = categoryList;
        this.filterBillList();
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  handleAddSuccess(e: Bill): void {
    this.dataSource.data = [...this.dataSource.data, e];
  }

  handleFilterConditionChange(e: FilterCondition): void {
    this.filterCondition = e;
    this.filterBillList();
  }

  getCategoryName(categoryId: string): string {
    return this.categoryList.find((item) => item.id === categoryId)?.name ?? '';
  }

  getBillTypeName(type: string): string {
    switch (type) {
      case '0':
        return '支出';
      case '1':
        return '收入';
      default:
        return '';
    }
  }

  private getBillList() {
    // 请求失败时或超时，使用本地数据
    return merge(
      this.accountBookService.getBillList().pipe(catchError(() => EMPTY)),
      of(bill).pipe(delay(300))
    ).pipe(
      first(),
      map((res) => {
        const [, ...data] = res.split('\n');
        return data.map((item) => {
          const arr = item.split(',');
          return {
            type: arr[0],
            time: arr[1],
            category: arr[2],
            amount: arr[3],
          } as Bill;
        });
      })
    );
  }

  private getCategoryList() {
    return merge(
      this.accountBookService
        .getBillCategoryList()
        .pipe(catchError(() => EMPTY)),
      of(billCategory).pipe(delay(300))
    ).pipe(
      first(),
      map((res) => {
        const [, ...data] = res.split('\n');
        return data.map((item) => {
          const arr = item.split(',');
          return {
            id: arr[0],
            type: arr[1],
            name: arr[2],
          } as BillCategory;
        });
      })
    );
  }

  private filterBillList(): void {
    const { date, category } = this.filterCondition!;
    this.dataSource.data = this.rawBillList
      .filter((item) => date.isSame(moment(parseInt(item.time)), 'month'))
      .filter((item) => (category ? item.category === category : true));
  }
}
