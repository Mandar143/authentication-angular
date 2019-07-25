import { TestBed } from '@angular/core/testing';

import { ManageCustomerListService } from './manage-customer-list.service';

describe('ManageCustomerListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageCustomerListService = TestBed.get(ManageCustomerListService);
    expect(service).toBeTruthy();
  });
});
