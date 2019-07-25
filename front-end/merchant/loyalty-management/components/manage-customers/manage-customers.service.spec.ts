import { TestBed } from '@angular/core/testing';

import { ManageCustomersService } from './manage-customers.service';

describe('ManageCustomersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageCustomersService = TestBed.get(ManageCustomersService);
    expect(service).toBeTruthy();
  });
});
