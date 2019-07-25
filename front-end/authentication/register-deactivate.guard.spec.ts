import { TestBed, async, inject } from '@angular/core/testing';

import { RegisterDeactivateGuard } from './register-deactivate.guard';

describe('RegisterDeactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterDeactivateGuard]
    });
  });

  it('should ...', inject([RegisterDeactivateGuard], (guard: RegisterDeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
