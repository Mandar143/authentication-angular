import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersCouponsListComponent } from './vouchers-coupons-list.component';

describe('VouchersCouponsListComponent', () => {
  let component: VouchersCouponsListComponent;
  let fixture: ComponentFixture<VouchersCouponsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchersCouponsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchersCouponsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
