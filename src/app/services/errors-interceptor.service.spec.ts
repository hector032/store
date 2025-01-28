import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { errorsInterceptor } from './errors-interceptor.service';

describe('ErrorsInterceptor', () => {
  it('debería crearse correctamente', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useValue: errorsInterceptor,
          multi: true,
        },
      ],
    });

    const interceptor = TestBed.inject(HTTP_INTERCEPTORS);
    expect(interceptor).toBeTruthy(); // Verifica que el interceptor esté definido
  });
});
