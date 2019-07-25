import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetHomeBranchChangeRequestsComponent } from './get-home-branch-change-requests.component';

describe('GetHomeBranchChangeRequestsComponent', () => {
  let component: GetHomeBranchChangeRequestsComponent;
  let fixture: ComponentFixture<GetHomeBranchChangeRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetHomeBranchChangeRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetHomeBranchChangeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
