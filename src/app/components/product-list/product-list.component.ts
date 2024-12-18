import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ProductService],
  animations: [
    // Definición de la animación `fadeIn` para la entrada de los productos
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })), // estado inicial
      transition(':enter', [animate('500ms ease-in')]), // animacion de entrada
    ]),
  ],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';

  constructor(
    private productService: ProductService, // Servicio para obtener los productos de la API
    private route: ActivatedRoute // Servicio para obtener los parámetros de la URL
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Suscripción a los parámetros de la ruta para obtener filtros de búsqueda
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.loadProducts();
    });
  }

  // Método para cargar los productos desde el servicio y filtrarlos
  loadProducts(): void {
    // Llama al servicio para obtener los productos desde la API
    this.productService.getProducts().subscribe((data: Product[]) => {
      // Filtra los productos según el término de búsqueda y categoría seleccionada
      this.products = data.filter(
        (product: Product) =>
          product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
          (this.selectedCategory
            ? product.category === this.selectedCategory
            : true) // Si no hay categoría seleccionada, muestra todo
      );
    });
  }

  // Método que actualiza el término de búsqueda y recarga los productos
  onSearch(term: string): void {
    this.searchTerm = term; // Actualiza el término de búsqueda
    this.loadProducts(); // Recarga los productos aplicando el filtro
  }

  // Método para seleccionar una categoría de productos (de la API)
  onSelectCategory(category: string): void {
    this.selectedCategory = category;
    this.loadProducts();
  }

  // Método para obtener los productos filtrados por categoría
  get filteredProducts() {
    return this.products.filter(
      (product: Product) =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.selectedCategory
          ? product.category === this.selectedCategory
          : true)
    );
  }
}
