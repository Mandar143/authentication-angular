import { TestBed } from '@angular/core/testing';

import { MasterImportService } from './master-import.service';

describe('MasterImportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MasterImportService = TestBed.get(MasterImportService);
    expect(service).toBeTruthy();
  });
});
