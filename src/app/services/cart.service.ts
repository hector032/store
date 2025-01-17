import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../services/product.service';
import { AuthService } from './auth.service'; // Importar el servicio de autenticación
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root', // Este servicio estará disponible en toda la aplicación como un singleton.
})
export class CartService {
  // Signal que contiene el estado del carrito. Inicializa con los datos de localStorage.
  public cartItems = signal<{ product: Product; quantity: number }[]>(
    this.loadCartFromStorage()
  );

  // Computed para calcular el total de productos en el carrito.
  totalItems = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  // Computed para calcular el precio total de los productos en el carrito.
  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => {
      // Validamos que el producto y su precio existan antes de sumar.
      if (item.product && item.product.price) {
        return sum + item.product.price * item.quantity;
      }
      return sum; // Ignoramos elementos mal formateados.
    }, 0)
  );

  constructor(private authService: AuthService, private router: Router) {}

  // Método para agregar al carrito con autenticación
  addToCartWithAuth(product: Product): void {
    if (this.authService.isAuthenticated()) {
      // Si el usuario está autenticado, agregar al carrito
      this.addToCart(product);
    } else {
      // Si no está autenticado, redirigir al login
      alert('Por favor, inicia sesión para agregar productos al carrito.');
      this.router.navigate(['/login']);
    }
  }

  // Método para agregar un producto al carrito.
  addToCart(product: Product): void {
    // Verificamos si el producto ya existe en el carrito.
    const existingItem = this.cartItems().find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      // Si el producto ya existe, incrementamos su cantidad.
      existingItem.quantity += 1;
    } else {
      // Si no existe, lo añadimos al carrito con cantidad inicial de 1.
      this.cartItems.set([...this.cartItems(), { product, quantity: 1 }]);
    }

    // Guardamos el estado actualizado del carrito en localStorage.
    this.saveCartToStorage(this.cartItems());
  }

  // Método para eliminar un producto del carrito.
  removeFromCart(productId: number): void {
    const updatedCart = this.cartItems().filter(
      (item) => item.product.id !== productId
    );
    this.cartItems.set(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  // Método para actualizar la cantidad de un producto en el carrito.
  updateQuantity(productId: number, quantity: number): void {
    const updatedCart = this.cartItems().map((item) =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    this.cartItems.set(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  // Método para limpiar todo el carrito.
  clearCart(): void {
    this.cartItems.set([]);
    localStorage.removeItem('cart');
  }

  // Método para cargar el carrito desde localStorage.
  private loadCartFromStorage(): { product: Product; quantity: number }[] {
    const storedCart = localStorage.getItem('cart');
    return storedCart
      ? JSON.parse(storedCart).filter(
          (item: any) => item.product && item.product.price !== undefined
        )
      : [];
  }

  // Método para guardar el carrito en localStorage.
  private saveCartToStorage(
    cart: { product: Product; quantity: number }[]
  ): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}
