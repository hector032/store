import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    // Configuramos el entorno de pruebas para LoginComponent
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(), // Para AuthService
        provideAnimations(), // Si hay animaciones o Angular Material
        provideRouter([]), // Mock de rutas si se necesita
        AuthService, // Servicio de autenticación
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    // Verificamos que el componente se inicialice
    expect(component).toBeTruthy();
  });

  it('debería autenticar al usuario correctamente y redirigir', () => {
    const authServiceSpy = TestBed.inject(AuthService);
    spyOn(authServiceSpy, 'login').and.returnValue(of(true)); // Simulamos un login exitoso

    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl'); // Espiamos la navegación

    // Simulamos la interacción del usuario
    component.username = 'testuser';
    component.password = 'testpassword';

    // Llamamos al método de login del componente
    component.login();

    // Verificamos que AuthService.login fue llamado con los datos correctos
    expect(authServiceSpy.login).toHaveBeenCalledWith(
      'testuser',
      'testpassword'
    );

    // Verificamos que redirige correctamente
    expect(routerSpy).toHaveBeenCalledWith('/home'); // Redirige al returnUrl predeterminado
  });

  it('debería mostrar un mensaje de error si las credenciales son incorrectas', () => {
    const authServiceSpy = TestBed.inject(AuthService);
    spyOn(authServiceSpy, 'login').and.returnValue(of(false)); // Simulamos un login fallido

    const alertSpy = spyOn(window, 'alert'); // Espiamos el método alert

    // Simulamos la interacción del usuario
    component.username = 'wronguser';
    component.password = 'wrongpassword';

    // Llamamos al método de login del componente
    component.login();

    // Verificamos que AuthService.login fue llamado con los datos correctos
    expect(authServiceSpy.login).toHaveBeenCalledWith(
      'wronguser',
      'wrongpassword'
    );

    // Verificamos que se mostró el mensaje de error
    expect(alertSpy).toHaveBeenCalledWith('Credenciales inválidas');
  });

  it('debería manejar errores inesperados durante el inicio de sesión', () => {
    const authServiceSpy = TestBed.inject(AuthService);
    spyOn(authServiceSpy, 'login').and.returnValue(
      throwError(() => new Error('Error inesperado')) // Simulamos un error inesperado
    );

    const alertSpy = spyOn(window, 'alert'); // Espiamos el método alert

    // Simulamos la interacción del usuario
    component.username = 'testuser';
    component.password = 'testpassword';

    // Llamamos al método de login del componente
    component.login();

    // Verificamos que AuthService.login fue llamado con los datos correctos
    expect(authServiceSpy.login).toHaveBeenCalledWith(
      'testuser',
      'testpassword'
    );

    // Verificamos que se mostró el mensaje de error
    expect(alertSpy).toHaveBeenCalledWith('Error al iniciar sesión');
  });
});
