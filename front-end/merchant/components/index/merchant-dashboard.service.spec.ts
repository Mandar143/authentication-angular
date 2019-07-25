import { TestBed } from '@angular/core/testing';

import { MerchantDashboardService } from './merchant-dashboard.service';

describe('MerchantDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MerchantDashboardService = TestBed.get(MerchantDashboardService);
    expect(service).toBeTruthy();
  });
});
