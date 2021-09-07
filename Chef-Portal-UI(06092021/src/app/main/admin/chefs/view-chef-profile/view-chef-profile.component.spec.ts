import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChefProfileComponent } from './view-chef-profile.component';

describe('ViewChefProfileComponent', () => {
  let component: ViewChefProfileComponent;
  let fixture: ComponentFixture<ViewChefProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewChefProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChefProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
