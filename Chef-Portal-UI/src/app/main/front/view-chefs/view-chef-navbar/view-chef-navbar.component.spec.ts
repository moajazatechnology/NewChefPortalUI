import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChefNavbarComponent } from './view-chef-navbar.component';

describe('ViewChefNavbarComponent', () => {
  let component: ViewChefNavbarComponent;
  let fixture: ComponentFixture<ViewChefNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewChefNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChefNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
