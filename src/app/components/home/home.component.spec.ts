import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent], // Importamos el componente standalone
      providers: [provideAnimations()], // Añadimos soporte para animaciones
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Prueba 1: Verifica que el componente se crea correctamente
  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Prueba 2: Verifica que el título o un elemento específico se renderice correctamente en el DOM
  it('debería renderizar el título', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toBe(
      '¡Bienvenido a Mi Tienda!'
    );
  });
});
