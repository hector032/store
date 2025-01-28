import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>; // Espía para HttpClient

  beforeEach(async () => {
    // Creamos el espía para HttpClient
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy }, // Usamos el espía como proveedor
        provideAnimations(),
        provideRouter([]),
        AuthService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService); // Inyectamos AuthService con el espía
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería registrar un usuario correctamente', () => {
    const newUser = { id: 1, username: 'testuser', password: 'testpassword' };

    // Simulamos la respuesta de la API
    httpClientSpy.post.and.returnValue(of(newUser));

    // Simulamos la interacción del usuario
    component.username = 'testuser';
    component.password = 'testpassword';

    // Llamamos al método register del componente
    component.register();

    // Verificamos que HttpClient.post fue llamado con los datos correctos
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      'http://localhost:3000/users',
      { username: 'testuser', password: 'testpassword' }
    );
  });

  it('debería mostrar un mensaje si los campos están incompletos', () => {
    const alertSpy = spyOn(window, 'alert'); // Espiamos el método alert

    // Dejamos los campos vacíos
    component.username = '';
    component.password = '';

    // Llamamos al método register del componente
    component.register();

    // Verificamos que se muestra un mensaje de alerta
    expect(alertSpy).toHaveBeenCalledWith(
      'Por favor, complete todos los campos'
    );
  });

  it('debería manejar errores inesperados durante el registro', () => {
    const authServiceSpy = TestBed.inject(AuthService);
    spyOn(authServiceSpy, 'register').and.returnValue(
      throwError(() => new Error('Error inesperado')) // Simulamos un error inesperado
    );

    const alertSpy = spyOn(window, 'alert'); // Espiamos el método alert

    // Simulamos la interacción del usuario
    component.username = 'testuser';
    component.password = 'testpassword';

    // Llamamos al método register del componente
    component.register();

    // Verificamos que se muestra el mensaje de error
    expect(alertSpy).toHaveBeenCalledWith('Error al registrar el usuario');
  });
});
