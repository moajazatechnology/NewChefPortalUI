import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefsListForProductComponent } from './chefs-list-for-product.component';

describe('ChefsListForProductComponent', () => {
  let component: ChefsListForProductComponent;
  let fixture: ComponentFixture<ChefsListForProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChefsListForProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChefsListForProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
