import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSingleOrderChefComponent } from './view-single-order-chef.component';

describe('ViewSingleOrderChefComponent', () => {
  let component: ViewSingleOrderChefComponent;
  let fixture: ComponentFixture<ViewSingleOrderChefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSingleOrderChefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSingleOrderChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
