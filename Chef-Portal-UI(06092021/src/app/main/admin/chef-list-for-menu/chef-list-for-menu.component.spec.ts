import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefListForMenuComponent } from './chef-list-for-menu.component';

describe('ChefListForMenuComponent', () => {
  let component: ChefListForMenuComponent;
  let fixture: ComponentFixture<ChefListForMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChefListForMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChefListForMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
