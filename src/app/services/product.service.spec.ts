import { TestBed } from '@angular/core/testing';
import { ProductService, Product, Category } from './product.service';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { of } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    // Creamos el espía para HttpClient
    const spy = jasmine.createSpyObj('HttpClient', ['get']);

    // Configuramos el módulo de pruebas
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Proveer HttpClient
        ProductService, // Nuestro servicio de productos
        { provide: HttpClient, useValue: spy }, // Sustituimos HttpClient con el espía
      ],
    });

    service = TestBed.inject(ProductService); // Inyectamos el servicio
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>; // Inyectamos el espía
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy(); // Verifica que el servicio fue creado
  });

  it('debería obtener todos los productos desde la API', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: 'Producto 1',
        price: 100,
        category: 'Categoría 1',
        description: '',
        image: '',
      },
      {
        id: 2,
        title: 'Producto 2',
        price: 200,
        category: 'Categoría 2',
        description: '',
        image: '',
      },
    ];

    // Simulamos el retorno de datos para la solicitud HTTP
    httpClientSpy.get.and.returnValue(of(mockProducts));

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts); // Verificamos que los datos son correctos
    });

    expect(httpClientSpy.get).toHaveBeenCalledOnceWith(
      'https://fakestoreapi.com/products'
    );
  });

  it('debería obtener un producto por su ID desde la API', () => {
    const mockProduct: Product = {
      id: 1,
      title: 'Producto 1',
      price: 100,
      category: 'Categoría 1',
      description: 'Descripción 1',
      image: 'imagen1.jpg',
    };

    // Simulamos el retorno de datos para la solicitud HTTP
    httpClientSpy.get.and.returnValue(of(mockProduct));

    service.getProductById(1).subscribe((product) => {
      expect(product).toEqual(mockProduct); // Verificamos que el producto es correcto
    });

    expect(httpClientSpy.get).toHaveBeenCalledOnceWith(
      'https://fakestoreapi.com/products/1'
    );
  });

  it('debería obtener las categorías desde la API', () => {
    const mockCategories: Category[] = [
      'Categoría 1',
      'Categoría 2',
      'Categoría 3',
    ];

    // Simulamos el retorno de datos para la solicitud HTTP
    httpClientSpy.get.and.returnValue(of(mockCategories));

    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(mockCategories); // Verificamos que las categorías son correctas
    });

    expect(httpClientSpy.get).toHaveBeenCalledOnceWith(
      'https://fakestoreapi.com/products/categories'
    );
  });

  it('debería manejar errores al obtener productos', () => {
    const errorResponse = {
      status: 500,
      message: 'Error interno del servidor',
    };

    // Simulamos un error HTTP
    httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

    service.getProducts().subscribe(
      () => fail('Debería fallar con un error'), // Si no ocurre un error, el test falla
      (error) => {
        expect(error).toEqual(errorResponse); // Verifica que el error coincida con el esperado
      }
    );

    expect(httpClientSpy.get).toHaveBeenCalledOnceWith(
      'https://fakestoreapi.com/products'
    );
  });
});
