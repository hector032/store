import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    // this.cartItems = this.cartService.getCartItems();
  }

  get cartItems() {
    const items = this.cartService.cartItems();
    console.log('Productos mostrados en el carrito:', items);
    return items;
  }
}
