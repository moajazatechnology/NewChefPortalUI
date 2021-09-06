import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileChefComponent } from './edit-profile-chef.component';

describe('EditProfileChefComponent', () => {
  let component: EditProfileChefComponent;
  let fixture: ComponentFixture<EditProfileChefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProfileChefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
