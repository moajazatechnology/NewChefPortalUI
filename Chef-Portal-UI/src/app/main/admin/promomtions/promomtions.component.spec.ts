import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromomtionsComponent } from './promomtions.component';

describe('PromomtionsComponent', () => {
  let component: PromomtionsComponent;
  let fixture: ComponentFixture<PromomtionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromomtionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromomtionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
