import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CartComponent implements OnInit {
  cartItems: { product: Product; quantity: number }[] = []; // Lista de productos en el carrito.
  totalItems: number = 0; // Total de productos en el carrito.
  totalPrice: number = 0; // Precio total de los productos.

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Cargamos el estado inicial del carrito.
    this.refreshCart();
  }

  // Método para eliminar un producto del carrito.
  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.refreshCart();
  }

  // Método para actualizar la cantidad de un producto.
  updateQuantity(productId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const quantity = Math.max(1, +inputElement.value);
    this.cartService.updateQuantity(productId, quantity);
    this.refreshCart();
  }

  // Método para limpiar todo el carrito.
  clearCart(): void {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
      this.refreshCart();
    }
  }

  // Método para actualizar los datos del carrito.
  refreshCart(): void {
    this.cartItems = this.cartService.cartItems();
    this.totalItems = this.cartService.totalItems();
    this.totalPrice = this.cartService.totalPrice();
  }
}
