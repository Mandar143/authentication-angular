import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsLogComponent } from './order-details-log.component';

describe('OrderDetailsLogComponent', () => {
  let component: OrderDetailsLogComponent;
  let fixture: ComponentFixture<OrderDetailsLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
