import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefPaymentComponent } from './chef-payment.component';

describe('ChefPaymentComponent', () => {
  let component: ChefPaymentComponent;
  let fixture: ComponentFixture<ChefPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChefPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChefPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
