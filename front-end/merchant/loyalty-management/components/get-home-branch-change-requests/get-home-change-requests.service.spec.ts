import { TestBed } from '@angular/core/testing';
import { GetHomeBranchChangeRequestsService } from './get-home-change-requests.service';


describe('GetHomeChangeRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetHomeBranchChangeRequestsService = TestBed.get(GetHomeBranchChangeRequestsService);
    expect(service).toBeTruthy();
  });
});
