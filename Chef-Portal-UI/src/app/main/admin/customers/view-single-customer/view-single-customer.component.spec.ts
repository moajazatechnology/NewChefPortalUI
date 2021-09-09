import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSingleCustomerComponent } from './view-single-customer.component';

describe('ViewSingleCustomerComponent', () => {
  let component: ViewSingleCustomerComponent;
  let fixture: ComponentFixture<ViewSingleCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSingleCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSingleCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
