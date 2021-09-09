import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChefProfileComponent } from './edit-chef-profile.component';

describe('EditChefProfileComponent', () => {
  let component: EditChefProfileComponent;
  let fixture: ComponentFixture<EditChefProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditChefProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChefProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
