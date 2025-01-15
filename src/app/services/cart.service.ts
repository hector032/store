import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../services/product.service';

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
    // Filtramos el producto por ID para eliminarlo del carrito.
    const updatedCart = this.cartItems().filter(
      (item) => item.product.id !== productId
    );
    this.cartItems.set(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  // Método para actualizar la cantidad de un producto en el carrito.
  updateQuantity(productId: number, quantity: number): void {
    // Recorremos los productos y actualizamos la cantidad del producto correspondiente.
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
    this.cartItems.set([]); // Vacía el estado del carrito.
    localStorage.removeItem('cart'); // Elimina el carrito del localStorage.
  }

  // Método para cargar el carrito desde localStorage.
  private loadCartFromStorage(): { product: Product; quantity: number }[] {
    const storedCart = localStorage.getItem('cart'); // Obtiene los datos del localStorage.
    return storedCart
      ? JSON.parse(storedCart).filter(
          (item: any) => item.product && item.product.price !== undefined
        ) // Validamos que los datos sean correctos.
      : [];
  }

  // Método para guardar el carrito en localStorage.
  private saveCartToStorage(
    cart: { product: Product; quantity: number }[]
  ): void {
    localStorage.setItem('cart', JSON.stringify(cart)); // Convierte el carrito a JSON y lo guarda.
  }
}
