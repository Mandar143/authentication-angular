import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCustomersListComponent } from './manage-customers-list.component';

describe('ManageCustomersListComponent', () => {
  let component: ManageCustomersListComponent;
  let fixture: ComponentFixture<ManageCustomersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCustomersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCustomersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
