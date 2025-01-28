import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DestroyRef } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

describe('ProductListComponent', () => {
  // Declaración de variables para el componente y sus dependencias
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>; // Espía para ProductService
  let cartServiceSpy: jasmine.SpyObj<CartService>; // Espía para CartService

  beforeEach(waitForAsync(() => {
    // Configuración inicial de los servicios espía
    const pServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']); // Espía para simular llamadas al método getProducts
    const cServiceSpy = jasmine.createSpyObj('CartService', [
      'addToCart',
      'addToCartWithAuth',
    ]); // Espía para simular el manejo del carrito

    // Simulamos el retorno de datos desde ProductService
    pServiceSpy.getProducts.and.returnValue(
      of([
        {
          id: 1,
          title: 'Producto 1',
          price: 10,
          category: 'cat1',
          description: '',
          image: '',
        },
        {
          id: 2,
          title: 'Producto 2',
          price: 20,
          category: 'cat2',
          description: '',
          image: '',
        },
      ])
    );

    // Configuración del módulo de pruebas
    TestBed.configureTestingModule({
      imports: [ProductListComponent], // Importamos el componente a probar
      providers: [
        provideHttpClient(), // Provisión de HttpClient para solicitudes HTTP
        provideAnimations(), // Provisión de animaciones (necesario para Angular Material)
        provideRouter([]), // Provisión de enrutador vacío
        { provide: ProductService, useValue: pServiceSpy }, // Inyectamos el espía para ProductService
        { provide: CartService, useValue: cServiceSpy }, // Inyectamos el espía para CartService
        AuthService, // Provisión del servicio de autenticación (sin espía, no se utiliza directamente en los tests)

        // Simulamos un DestroyRef que no cancela suscripciones en los tests
        {
          provide: DestroyRef,
          useValue: {
            onDestroy: () => {
              // Vacío intencionalmente; en los tests no queremos destruir nada
            },
          },
        },
      ],
    }).compileComponents(); // Compilamos los componentes y sus dependencias

    // Configuración del fixture y el componente
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;

    // Asignación de los servicios espía
    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;

    // Disparamos el ciclo de detección de cambios, lo que ejecuta ngOnInit()
    fixture.detectChanges();
  }));

  // Test: Verificar que el componente se crea correctamente
  it('debería crear el componente', () => {
    expect(component).toBeTruthy(); // Asegura que el componente se instanció correctamente
  });

  // Test: Verificar que los productos se cargan desde el servicio
  it('debería cargar productos desde el servicio', waitForAsync(() => {
    // fixture.whenStable() asegura que las operaciones asíncronas se completen
    fixture.whenStable().then(() => {
      // Verifica que el método getProducts del espía haya sido llamado
      expect(productServiceSpy.getProducts).toHaveBeenCalled();

      // Verifica que los productos se hayan cargado y procesado correctamente
      expect(component.allProducts.length).toBe(10); // 2 productos originales * 5 duplicados = 10
      expect(component.filteredProducts.length).toBe(10);
      expect(component.visibleProducts.length).toBe(10);
    });
  }));

  // Test: Verificar el filtrado de productos por término de búsqueda
  it('debería filtrar productos por término de búsqueda', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // Configuramos manualmente la lista de productos para este test
      component.allProducts = [
        {
          id: 1,
          title: 'Producto 1',
          price: 10,
          category: 'cat1',
          description: '',
          image: '',
        },
        {
          id: 2,
          title: 'Producto 2',
          price: 20,
          category: 'cat2',
          description: '',
          image: '',
        },
      ];

      // Asignamos el término de búsqueda
      component.searchTerm = 'Producto 1';
      component.applyFilters(); // Aplicamos el filtro
      fixture.detectChanges();

      // Verificamos que el filtro funcione correctamente
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].title).toBe('Producto 1');
    });
  }));

  // Test: Verificar que un producto se añade correctamente al carrito
  it('debería agregar un producto al carrito', waitForAsync(() => {
    fixture.whenStable().then(() => {
      // Creamos un producto simulado
      const product = {
        id: 1,
        title: 'Producto 1',
        price: 10,
        category: 'cat1',
        description: '',
        image: '',
      };

      // Llamamos al método addToCart del componente
      component.addToCart(product);

      // Verificamos que el método del servicio espía fue llamado con el producto correcto
      expect(cartServiceSpy.addToCartWithAuth).toHaveBeenCalledWith(product);
    });
  }));
});
