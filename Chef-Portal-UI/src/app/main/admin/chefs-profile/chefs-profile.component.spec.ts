import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefsProfileComponent } from './chefs-profile.component';

describe('ChefsProfileComponent', () => {
  let component: ChefsProfileComponent;
  let fixture: ComponentFixture<ChefsProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChefsProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChefsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
