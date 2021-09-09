import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSingleOrderComponent } from './customer-single-order.component';

describe('CustomerSingleOrderComponent', () => {
  let component: CustomerSingleOrderComponent;
  let fixture: ComponentFixture<CustomerSingleOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSingleOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSingleOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
