import { TestBed } from '@angular/core/testing';

import { ErrorsInterceptorService } from './errors-interceptor.service';

describe('ErrorsInterceptorService', () => {
  let service: ErrorsInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorsInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
