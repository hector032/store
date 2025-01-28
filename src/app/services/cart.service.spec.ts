import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';

describe('CartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Proveer HttpClient
        AuthService, // CartService depende de AuthService
        CartService, // Servicio a probar
      ],
    });

    // Limpiamos localStorage antes de cada prueba
    localStorage.clear();

    // Reiniciamos el servicio
    const service = TestBed.inject(CartService);
    service.clearCart();
  });

  it('debería crearse correctamente', () => {
    // Inyectamos el servicio a probar
    const service = TestBed.inject(CartService);
    // Validamos que se haya creado sin errores
    expect(service).toBeTruthy();
  });

  it('debería agregar un producto al carrito', () => {
    const product = {
      id: 1,
      title: 'Producto 1',
      price: 100,
      category: 'Categoría 1',
      description: 'Descripción 1',
      image: 'imagen1.jpg',
    };

    const service = TestBed.inject(CartService);

    // Simulamos el localStorage usando un espía
    spyOn(localStorage, 'setItem').and.callFake(() => {}); // Espía para setItem

    // Llamamos al método para agregar al carrito
    service.addToCart(product);

    // Verificamos que el carrito tiene el producto
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].product).toEqual(product);
    expect(service.cartItems()[0].quantity).toBe(1);

    // Verificamos que los datos se guardaron en localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([{ product, quantity: 1 }])
    );
  });

  it('debería eliminar un producto del carrito', () => {
    const product1 = {
      id: 1,
      title: 'Producto 1',
      price: 100,
      category: 'Categoría 1',
      description: 'Descripción 1',
      image: 'imagen1.jpg',
    };

    const product2 = {
      id: 2,
      title: 'Producto 2',
      price: 200,
      category: 'Categoría 2',
      description: 'Descripción 2',
      image: 'imagen2.jpg',
    };

    const service = TestBed.inject(CartService);

    // Creamos un espía completo para localStorage.setItem
    const setItemSpy = spyOn(localStorage, 'setItem').and.callFake(() => {});

    // Agregamos productos al carrito inicialmente
    service.addToCart(product1);
    service.addToCart(product2);

    // Llamamos al método para eliminar un producto
    service.removeFromCart(product1.id);

    // Verificamos que el carrito ya no contiene el producto eliminado
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].product).toEqual(product2);

    // Verificamos que la última llamada a localStorage.setItem corresponde al estado final esperado
    const lastCall = setItemSpy.calls.mostRecent(); // Usamos el espía completo
    expect(lastCall.args).toEqual([
      'cart',
      JSON.stringify([{ product: product2, quantity: 1 }]),
    ]);
  });

  it('debería actualizar la cantidad de un producto en el carrito', () => {
    const product = {
      id: 1,
      title: 'Producto 1',
      price: 100,
      category: 'Categoría 1',
      description: 'Descripción 1',
      image: 'imagen1.jpg',
    };

    const service = TestBed.inject(CartService);

    // Simulamos localStorage con un espía
    spyOn(localStorage, 'setItem').and.callFake(() => {}); // Espía para setItem

    // Agregamos el producto al carrito
    service.addToCart(product);

    // Actualizamos la cantidad del producto
    service.updateQuantity(product.id, 5);

    // Verificamos que la cantidad del producto se haya actualizado
    expect(service.cartItems()[0].quantity).toBe(5);

    // Verificamos que los datos actualizados se guardaron en localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([{ product, quantity: 5 }])
    );
  });

  it('debería limpiar todo el carrito', () => {
    const product1 = {
      id: 1,
      title: 'Producto 1',
      price: 100,
      category: 'Categoría 1',
      description: 'Descripción 1',
      image: 'imagen1.jpg',
    };

    const product2 = {
      id: 2,
      title: 'Producto 2',
      price: 200,
      category: 'Categoría 2',
      description: 'Descripción 2',
      image: 'imagen2.jpg',
    };

    const service = TestBed.inject(CartService);

    // Simulamos localStorage con un espía
    spyOn(localStorage, 'removeItem').and.callFake(() => {}); // Espía para removeItem

    // Agregamos productos al carrito
    service.addToCart(product1);
    service.addToCart(product2);

    // Llamamos al método para limpiar el carrito
    service.clearCart();

    // Verificamos que el carrito esté vacío
    expect(service.cartItems().length).toBe(0);

    // Verificamos que se haya llamado a localStorage.removeItem
    expect(localStorage.removeItem).toHaveBeenCalledWith('cart');
  });
});
