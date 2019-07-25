import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCouponsListComponent } from './offer-coupons-list.component';

describe('OfferCouponsListComponent', () => {
  let component: OfferCouponsListComponent;
  let fixture: ComponentFixture<OfferCouponsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferCouponsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferCouponsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
