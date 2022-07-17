import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterConditionComponent } from './filter-condition.component';

describe('FilterConditonComponent', () => {
  let component: FilterConditionComponent;
  let fixture: ComponentFixture<FilterConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterConditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
