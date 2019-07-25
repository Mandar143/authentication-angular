import { TestBed } from '@angular/core/testing';

import { GetMobileNumberChangeLogService } from './get-mobile-number-change-log.service';

describe('GetMobileNumberChangeLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetMobileNumberChangeLogService = TestBed.get(GetMobileNumberChangeLogService);
    expect(service).toBeTruthy();
  });
});
