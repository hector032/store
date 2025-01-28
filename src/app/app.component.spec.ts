import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Importamos el componente standalone
      providers: [
        provideHttpClient(), // Configuramos HttpClient
        {
          provide: ActivatedRoute, // Mock de ActivatedRoute
          useValue: {
            snapshot: {
              params: {}, // Simulamos los parámetros de la ruta
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('debería crear el componente de la aplicación', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // Verificamos que se crea correctamente
  });

  it('debería tener como título "store"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('store'); // Verificamos el título
  });

  it('debería renderizar el componente app-header', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges(); // Detectar cambios en el componente
    const compiled = fixture.nativeElement as HTMLElement;

    // Validar que el componente app-header está presente
    expect(compiled.querySelector('app-header')).not.toBeNull();
  });
});
