import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationReportsComponent } from './registration-reports.component';

describe('RegistrationReportsComponent', () => {
  let component: RegistrationReportsComponent;
  let fixture: ComponentFixture<RegistrationReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
