import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

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

  // Inyectamos ActivatedRoute y ProductService.
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Obtenemos el ID del producto desde la URL utilizando ActivatedRoute.
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    // Si existe un ID válido, solicitamos los detalles del producto al servicio.
    this.productService.getProductById(productId).subscribe((data: Product) => {
      this.product = data;
    });
  }
}
