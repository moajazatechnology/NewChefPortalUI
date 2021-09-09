import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductVarientsComponent } from './add-product-varients.component';

describe('AddProductVarientsComponent', () => {
  let component: AddProductVarientsComponent;
  let fixture: ComponentFixture<AddProductVarientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductVarientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductVarientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
