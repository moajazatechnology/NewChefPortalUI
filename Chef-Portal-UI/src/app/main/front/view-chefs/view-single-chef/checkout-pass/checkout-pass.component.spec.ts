import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPassComponent } from './checkout-pass.component';

describe('CheckoutPassComponent', () => {
  let component: CheckoutPassComponent;
  let fixture: ComponentFixture<CheckoutPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutPassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
