import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Product } from '../services/product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Signal para almacenar los productos en el carrito
  public cartItems = signal<Product[]>([]);

  // Computed para calcular el total de productos
  totalItems = computed(() => this.cartItems().length);

  // Método para agregar un producto al carrito
  addToCart(product: Product): void {
    this.cartItems.set([...this.cartItems(), product]);
    console.log('Producto agregado:', product);
    console.log('Estado del carrito:', this.cartItems());
  }

  /*// Obtener los productos actuales del carrito
  getCartItems(): Product[] {
    console.log('Productos en el carrito:', this.cartItemsSignal());
    return this.cartItemsSignal();
  }
    */

  // Metodo para mostrar los productos en el carrito
  getCartItems(): Product[] {
    return this.cartItems();
  }
}
