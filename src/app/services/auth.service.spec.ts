import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    // Creamos un espía para HttpClient
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy }, // Usamos el espía
        AuthService,
      ],
    });

    service = TestBed.inject(AuthService); // Inyectamos el servicio con el espía
  });

  it('debería autenticar y actualizar el estado correctamente', () => {
    const mockUser = { id: 1, username: 'testuser', password: 'testpassword' };

    // Simulamos la respuesta de la API
    httpClientSpy.get.and.returnValue(of([mockUser]));

    service.login('testuser', 'testpassword').subscribe((result) => {
      expect(result).toBeTrue(); // Verificamos que el resultado es true
      expect(sessionStorage.getItem('user')).toEqual(JSON.stringify(mockUser)); // Verificamos que se guarda el usuario
      expect(service.isAuthenticated()).toBeTrue(); // Verificamos que el estado se actualiza
    });

    // Verificamos que HttpClient.get fue llamado correctamente
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      'http://localhost:3000/users',
      { params: { username: 'testuser', password: 'testpassword' } }
    );
  });

  it('debería cerrar sesión y actualizar el estado correctamente', () => {
    // Simulamos un usuario autenticado en sessionStorage
    sessionStorage.setItem(
      'user',
      JSON.stringify({ id: 1, username: 'testuser', password: 'testpassword' })
    );

    // Verificamos que inicialmente está autenticado
    expect(service.isAuthenticated()).toBeTrue();

    // Llamamos al método logout
    service.logout();

    // Verificamos que sessionStorage se ha limpiado
    expect(sessionStorage.getItem('user')).toBeNull();

    // Verificamos que el estado de autenticación se ha actualizado
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('debería retornar true si el usuario está autenticado', () => {
    // Simulamos que hay un usuario en sessionStorage
    sessionStorage.setItem(
      'user',
      JSON.stringify({ id: 1, username: 'testuser', password: 'testpassword' })
    );

    // Verificamos que isAuthenticated retorna true
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('debería retornar true si el usuario está autenticado', () => {
    // Simulamos que hay un usuario en sessionStorage
    sessionStorage.setItem(
      'user',
      JSON.stringify({ id: 1, username: 'testuser', password: 'testpassword' })
    );

    // Verificamos que isAuthenticated retorna true
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('debería retornar false si el usuario no está autenticado', () => {
    // Limpiamos sessionStorage
    sessionStorage.removeItem('user');

    // Verificamos que isAuthenticated retorna false
    expect(service.isAuthenticated()).toBeFalse();
  });
});
