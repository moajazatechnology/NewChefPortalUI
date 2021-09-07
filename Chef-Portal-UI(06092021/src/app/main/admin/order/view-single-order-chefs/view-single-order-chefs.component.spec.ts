import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSingleOrderChefsComponent } from './view-single-order-chefs.component';

describe('ViewSingleOrderChefsComponent', () => {
  let component: ViewSingleOrderChefsComponent;
  let fixture: ComponentFixture<ViewSingleOrderChefsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSingleOrderChefsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSingleOrderChefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
