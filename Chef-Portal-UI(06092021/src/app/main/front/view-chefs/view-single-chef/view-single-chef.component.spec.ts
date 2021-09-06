import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSingleChefComponent } from './view-single-chef.component';

describe('ViewSingleChefComponent', () => {
  let component: ViewSingleChefComponent;
  let fixture: ComponentFixture<ViewSingleChefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSingleChefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSingleChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
