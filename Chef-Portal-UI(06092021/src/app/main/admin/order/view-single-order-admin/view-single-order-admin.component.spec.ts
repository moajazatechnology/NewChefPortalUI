import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSingleOrderAdminComponent } from './view-single-order-admin.component';

describe('ViewSingleOrderAdminComponent', () => {
  let component: ViewSingleOrderAdminComponent;
  let fixture: ComponentFixture<ViewSingleOrderAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSingleOrderAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSingleOrderAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
