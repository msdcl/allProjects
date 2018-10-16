import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChoiceComponent } from './list-choice.component';

describe('ListChoiceComponent', () => {
  let component: ListChoiceComponent;
  let fixture: ComponentFixture<ListChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
