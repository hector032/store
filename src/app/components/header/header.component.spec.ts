import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ProductService } from '../../services/product.service';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    // Configuramos el entorno de pruebas para HeaderComponent
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideHttpClient(), // HttpClient para ProductService
        provideAnimations(), // Animaciones si se utilizan
        provideRouter([]), // Mock de rutas
        ProductService, // Servicio de productos
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    // Validamos que el componente exista
    expect(component).toBeTruthy();
  });
});
