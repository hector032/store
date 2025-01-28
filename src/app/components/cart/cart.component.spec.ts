import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    // Configuramos el entorno de pruebas para el componente CartComponent
    await TestBed.configureTestingModule({
      imports: [CartComponent], // Importamos el componente standalone
      providers: [
        provideHttpClient(), // HttpClient para servicios que lo requieran
        provideAnimations(), // Animaciones si el componente o sus hijos las usan
        provideRouter([]), // Mock de routing si el componente utiliza ActivatedRoute o routerLink
        AuthService, // Servicio de autenticación
        CartService, // Servicio de carrito
      ],
    }).compileComponents();

    // Creamos la instancia del componente para pruebas
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    // Disparamos la detección de cambios
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    // Validamos que la instancia sea válida
    expect(component).toBeTruthy();
  });
});
