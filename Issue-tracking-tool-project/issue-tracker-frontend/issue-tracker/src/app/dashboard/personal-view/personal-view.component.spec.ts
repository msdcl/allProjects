import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalViewComponent } from './personal-view.component';

describe('PersonalViewComponent', () => {
  let component: PersonalViewComponent;
  let fixture: ComponentFixture<PersonalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
