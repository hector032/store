import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service'; // Importamos el servicio del carrito
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule, // Funcionalidades comunes de Angular (ngIf, ngFor, etc.)
    CurrencyPipe, // Pipe para formatear valores numéricos como monedas
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [ProductService],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('500ms ease-in')]),
    ]),
  ],
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router, // Inyectamos el servicio de enrutamiento
    private authService: AuthService, // Inyectamos el servicio de autenticación
    private cartService: CartService, // Inyectamos el servicio del carrito
    private destroyRef: DestroyRef // Inyectamos la referencia de destrucción
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.productService
        .getProductById(productId)
        .pipe(takeUntilDestroyed(this.destroyRef)) // Manejo automático de la destrucción
        .subscribe((data: Product) => {
          this.product = data;
        });
    }
  }

  // Método para agregar el producto al carrito
  addToCart(): void {
    if (this.product) {
      this.cartService.addToCartWithAuth(this.product); // Usar el método centralizado del carrito con autenticación
    } else {
      console.error('El producto no está disponible para agregar al carrito.');
    }
  }
}
