import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCartWithAuth']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent, HttpClientTestingModule],
      providers: [
        { provide: ProductService, useValue: {} },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: AuthService, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: (key: string) => '1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy(); // Verificamos que el componente se haya creado correctamente.
  });

  it('debería agregar el producto al carrito', () => {
    // Simulamos un producto cargado
    const mockProduct = {
      id: 1,
      title: 'Producto de prueba',
      price: 100,
      category: 'categoría',
      description: 'Descripción de prueba',
      image: 'imagen.jpg',
    };
    component.product = mockProduct; // Asignamos el producto al componente

    component.addToCart(); // Llamamos al método que agrega el producto al carrito

    // Verificamos que se haya llamado al servicio del carrito con el producto correcto
    expect(cartServiceSpy.addToCartWithAuth).toHaveBeenCalledWith(mockProduct);
  });

  it('no debería agregar el producto al carrito si no hay producto', () => {
    component.product = undefined; // Simulamos que no hay producto cargado
    spyOn(console, 'error'); // Espiamos la salida de consola

    component.addToCart(); // Llamamos al método de agregar al carrito

    // Verificamos que no se haya llamado al servicio del carrito
    expect(cartServiceSpy.addToCartWithAuth).not.toHaveBeenCalled();

    // Verificamos que se haya mostrado un error en la consola
    expect(console.error).toHaveBeenCalledWith(
      'El producto no está disponible para agregar al carrito.'
    );
  });
});
