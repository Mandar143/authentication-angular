import { TestBed } from '@angular/core/testing';

import { CustomerTransactionsService } from './customer-transactions.service';

describe('CustomerTransactionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerTransactionsService = TestBed.get(CustomerTransactionsService);
    expect(service).toBeTruthy();
  });
});
