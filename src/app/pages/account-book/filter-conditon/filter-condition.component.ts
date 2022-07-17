import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BillCategory } from '../../../service/account-book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-filter-condition',
  templateUrl: './filter-condition.component.html',
  styleUrls: ['./filter-condition.component.less']
})
export class FilterConditionComponent implements OnInit {
  @Input()
  categoryList: BillCategory[] = [];

  @Output()
  filterConditionChange = new EventEmitter<FilterCondition>();

  date = moment('2019-12');
  category: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.initStateFromQuery();
    this.handleFilterConditionChange();
  }

  handleDateChange(e: Moment, dp: MatDatepicker<Moment>): void {
    this.date = e;
    this.router.navigate([], {
      queryParams: { date: e.format('YYYY-MM') },
      queryParamsHandling: 'merge',
    });
    dp.close();
    this.handleFilterConditionChange();
  }

  handleBillCategoryChange(e: string | null): void {
    this.category = e;
    this.router.navigate([], {
      queryParams: { category: e },
      queryParamsHandling: 'merge',
    });
    this.handleFilterConditionChange();
  }

  private initStateFromQuery(): void {
    const { queryParamMap } = this.route.snapshot;
    const dateFormQuery = queryParamMap.get('date');
    if (dateFormQuery && moment(dateFormQuery).isValid()) {
      this.date = moment(dateFormQuery);
    }
    const categoryFormQuery = queryParamMap.get('category');
    if (categoryFormQuery) {
      this.category = categoryFormQuery;
    }
  }

  private handleFilterConditionChange(): void {
    this.filterConditionChange.emit({
      date: this.date,
      category: this.category,
    });
  }
}

export interface FilterCondition {
  date: Moment;
  category: string | null;
}
