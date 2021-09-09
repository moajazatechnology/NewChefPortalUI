import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChefsComponent } from './view-chefs.component';

describe('ViewChefsComponent', () => {
  let component: ViewChefsComponent;
  let fixture: ComponentFixture<ViewChefsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewChefsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
