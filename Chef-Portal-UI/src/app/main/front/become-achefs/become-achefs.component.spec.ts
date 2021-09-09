import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAChefsComponent } from './become-achefs.component';

describe('BecomeAChefsComponent', () => {
  let component: BecomeAChefsComponent;
  let fixture: ComponentFixture<BecomeAChefsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BecomeAChefsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeAChefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
