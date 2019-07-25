import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GetMobileNumberChangeLogComponent } from './get-mobile-number-change-log.component';


describe('GetMobileNumberChangeLogComponentComponent', () => {
  let component: GetMobileNumberChangeLogComponent;
  let fixture: ComponentFixture<GetMobileNumberChangeLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetMobileNumberChangeLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetMobileNumberChangeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
