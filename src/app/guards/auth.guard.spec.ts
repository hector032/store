import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy }, // Mock del servicio de autenticación
        { provide: Router, useValue: routerSpy }, // Mock del router
        AuthGuard, // Guard a probar
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('debería permitir el acceso si el usuario está autenticado', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true); // Simulamos que el usuario está autenticado

    // Creamos mocks de ActivatedRouteSnapshot y RouterStateSnapshot
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/protected' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue(); // Verificamos que permite el acceso
    expect(routerSpy.navigate).not.toHaveBeenCalled(); // Verificamos que no redirige
  });

  it('debería redirigir al login si el usuario no está autenticado', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false); // Simulamos que el usuario no está autenticado

    const alertSpy = spyOn(window, 'alert'); // Espiamos el método alert

    // Creamos mocks de ActivatedRouteSnapshot y RouterStateSnapshot
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/protected' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state);

    // Verificamos que no permite el acceso
    expect(result).toBeFalse();

    // Verificamos que se mostró el mensaje de alerta
    expect(alertSpy).toHaveBeenCalledWith(
      'Necesitas iniciar sesión para realizar esta acción.'
    );

    // Verificamos que redirige al login con el returnUrl
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/protected' },
    });
  });
});
