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
    this.cartService.removeFromCart(productId); // Llamamos al servicio para eliminar el producto.
    this.refreshCart(); // Actualizamos los datos del carrito.
  }

  // Método para actualizar la cantidad de un producto.
  updateQuantity(productId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Convertimos el target al tipo HTMLInputElement.
    const quantity = Math.max(1, +inputElement.value); // Aseguramos que la cantidad sea >= 1.
    this.cartService.updateQuantity(productId, quantity); // Llamamos al servicio para actualizar.
    this.refreshCart(); // Actualizamos los datos del carrito.
  }

  // Método para limpiar todo el carrito.
  clearCart(): void {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart(); // Llamamos al servicio para limpiar el carrito.
      this.refreshCart(); // Actualizamos los datos del carrito.
    }
  }

  // Método para actualizar los datos del carrito.
  refreshCart(): void {
    this.cartItems = this.cartService.cartItems(); // Obtenemos los productos.
    this.totalItems = this.cartService.totalItems(); // Calculamos el total de productos.
    this.totalPrice = this.cartService.totalPrice(); // Calculamos el precio total.
  }
}
