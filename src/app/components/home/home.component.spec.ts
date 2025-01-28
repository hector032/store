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

  // Prueba 2: Verifica que las propiedades de configuración de los gráficos son correctas
  it('debería tener las propiedades iniciales de los gráficos configuradas correctamente', () => {
    expect(component.showXAxis).toBeTrue();
    expect(component.showYAxis).toBeTrue();
    expect(component.gradient).toBeFalse();
    expect(component.xAxisLabel).toBe('Productos');
    expect(component.yAxisLabel).toBe('Cantidad Vendida');
  });

  // Prueba 3: Verifica que los datos de la gráfica estén inicializados
  it('debería inicializar los datos de la gráfica', () => {
    expect(component.single).toBeDefined();
    expect(component.single.length).toBe(3); // Suponemos que empieza vacío
  });

  // Prueba 4: Verifica que el esquema de colores sea el correcto
  it('debería tener configurado el esquema de colores', () => {
    expect(component.colorScheme.domain).toEqual([
      '#5AA454',
      '#A10A28',
      '#C7B42C',
      '#AAAAAA',
    ]);
  });
});
