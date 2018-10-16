import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSlotsComponent } from './user-slots.component';

describe('UserSlotsComponent', () => {
  let component: UserSlotsComponent;
  let fixture: ComponentFixture<UserSlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
