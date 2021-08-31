import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderOfChefComponent } from './order-of-chef.component';

describe('OrderOfChefComponent', () => {
  let component: OrderOfChefComponent;
  let fixture: ComponentFixture<OrderOfChefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderOfChefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderOfChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
