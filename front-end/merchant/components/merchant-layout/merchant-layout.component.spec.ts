import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantLayoutComponent } from './merchant-layout.component';

describe('MerchantLayoutComponent', () => {
  let component: MerchantLayoutComponent;
  let fixture: ComponentFixture<MerchantLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
