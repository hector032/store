import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../services/product.service';

@Injectable({
  providedIn: 'root', // Define que este servicio estará disponible en toda la aplicación como singleton.
})
export class CartService {
  // Signal que contiene el estado del carrito. Inicializa con los datos de localStorage (si existen).
  public cartItems = signal<Product[]>(this.loadCartFromStorage());

  // Computed para calcular el número total de productos en el carrito.
  totalItems = computed(() => this.cartItems().length);

  // Agregar un producto al carrito
  addToCart(product: Product): void {
    // Actualiza el estado del carrito con el nuevo producto
    const updatedCart = [...this.cartItems(), product];
    this.cartItems.set(updatedCart);

    // Guarda el carrito actualizado en localStorage
    this.saveCartToStorage(updatedCart);

    console.log('Producto agregado:', product);
    console.log('Estado actual del carrito:', this.cartItems());
  }

  // Obtener los productos actuales en el carrito
  getCartItems(): Product[] {
    return this.cartItems();
  }

  // Cargar el carrito desde localStorage
  private loadCartFromStorage(): Product[] {
    const storedCart = localStorage.getItem('cart'); // Obtiene el carrito almacenado
    return storedCart ? JSON.parse(storedCart) : []; // Si existe, lo parsea a un array; si no, devuelve un array vacío.
  }

  // Guardar el carrito en localStorage
  private saveCartToStorage(cart: Product[]): void {
    localStorage.setItem('cart', JSON.stringify(cart)); // Convierte el array en una cadena y lo guarda.
  }
}
