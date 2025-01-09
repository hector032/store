import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ProductService, Product } from '../../services/product.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatGridListModule, MatCardModule],
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
  cols = 2;
  products: Product[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private productService: ProductService, // Servicio para obtener los productos de la API
    private route: ActivatedRoute // Servicio para obtener los parámetros de la URL
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .subscribe((result) => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.Handset]) {
            this.cols = 1; // 1 columna para móviles
          } else if (result.breakpoints[Breakpoints.Tablet]) {
            this.cols = 2; // 2 columnas para tablets
          } else if (result.breakpoints[Breakpoints.Web]) {
            this.cols = 2; // 2 columnas para pantallas grandes
          }
        }
      });

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
      const filteredProducts = data.filter(
        (product: Product) =>
          product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
          (this.selectedCategory
            ? product.category === this.selectedCategory
            : true) // Si no hay categoría seleccionada, muestra todo
      );

      // Ajusta la longitud del título y la descripción
      this.products = filteredProducts.map((product) => ({
        ...product,
        title:
          product.title.length > 50 // Trunca el título si tiene más de 50 caracteres
            ? product.title.slice(0, 50) + '...'
            : product.title,
        description:
          product.description.length > 100 // Trunca la descripción si tiene más de 100 caracteres
            ? product.description.slice(0, 100) + '...'
            : product.description,
      }));
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

  addToCart(product: Product): void {
    if (this.authService.isAuthenticated()) {
      // Si el usuario está autenticado, agrega al carrito
      this.cartService.addToCart(product);
      console.log('Producto agregado al carrito:', product);
    } else {
      // Si no está autenticado, redirige al login
      alert('Por favor, inicia sesión para agregar productos al carrito.');
      this.router.navigate(['/login']);
    }
  }
}
