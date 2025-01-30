import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ProductService, Product } from '../../services/product.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],

  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('500ms ease-in')]),
    ]),
  ],
})
export class ProductListComponent implements OnInit, OnDestroy {
  cols = 5; // Siempre 5 columnas para pantallas grandes
  allProducts: Product[] = []; // Todos los productos
  filteredProducts: Product[] = []; // Productos que cumplen los filtros activos
  visibleProducts: Product[] = []; // Productos visibles en la pantalla
  currentPage: number = 0; // Página actual para controlar las filas cargadas
  itemsPerPage: number = 5; // Número de productos por fila (5 productos)
  isLoading: boolean = false; // Bandera para evitar múltiples cargas simultáneas
  searchTerm: string = ''; // Término de búsqueda ingresado por el usuario
  selectedCategory: string = ''; // Categoría seleccionada por el usuario

  constructor(
    private cartService: CartService, // Servicio para manejar el carrito
    private authService: AuthService, // Servicio de autenticación
    private router: Router, // Servicio de enrutamiento
    private breakpointObserver: BreakpointObserver, // Observador para detectar tamaños de pantalla
    private productService: ProductService, // Servicio para obtener productos
    private route: ActivatedRoute, // Servicio para leer parámetros de la URL
    private destroyRef: DestroyRef // Referencia para destruir suscripciones
  ) {}

  ngOnInit(): void {
    // Detectar cambios en el tamaño de pantalla y ajustar las columnas
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .pipe(takeUntilDestroyed(this.destroyRef)) // Manejo automático de la destrucción
      .subscribe((result) => {
        this.cols = result.breakpoints[Breakpoints.Handset] ? 2 : 5; // 2 columnas en móvil, 5 en pantallas grandes
      });

    // Escuchar cambios en los parámetros de búsqueda o categoría en la URL
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef)) // Manejo automático de la destrucción
      .subscribe((params) => {
        this.searchTerm = params['search'] || ''; // Obtener el término de búsqueda
        this.selectedCategory = params['category'] || ''; // Obtener la categoría seleccionada
        this.resetAndApplyFilters(); // Aplicar filtros y reiniciar el estado visible
      });

    // Agregar un listener para el evento de scroll
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy(): void {
    // Eliminar el listener de scroll al destruir el componente
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  // Cargar todos los productos desde el servicio
  loadProducts(): void {
    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef)) // Manejo automático de la destrucción
      .subscribe((data: Product[]) => {
        //Duplicar productos para tener una lista más grande
        this.allProducts = Array.from({ length: 5 }, () => data).flat();

        //Truncar títulos y descripciones para evitar problemas de diseño
        this.allProducts = this.allProducts.map((product) => ({
          ...product,
          title:
            product.title.length > 20
              ? product.title.slice(0, 20) + '...'
              : product.title,
          description:
            product.description.length > 100
              ? product.description.slice(0, 100) + '...'
              : product.description,
        }));

        //Aplicar filtros iniciales a los productos cargados
        this.applyFilters();
      });
  }

  // Aplicar filtros según el término de búsqueda y la categoría seleccionada
  applyFilters(): void {
    this.filteredProducts = this.allProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) && // Filtrar por término de búsqueda
        (this.selectedCategory
          ? product.category === this.selectedCategory // Filtrar por categoría
          : true)
    );

    // Mostrar las 2 primeras filas (10 productos)
    this.visibleProducts = this.filteredProducts.slice(0, 10);
  }

  // Resetear el estado visible y aplicar filtros
  resetAndApplyFilters(): void {
    this.currentPage = 2; // Comienza con 2 páginas cargadas (10 productos)
    this.visibleProducts = []; // Reiniciar productos visibles
    this.loadProducts(); // Volver a cargar productos desde el servicio
  }

  // Detectar cuando el usuario llega al final de la página
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY; // Posición actual del scroll
    const threshold = document.body.offsetHeight - 100; // Umbral para cargar más productos

    // Si el usuario está cerca del final, cargar más productos
    if (scrollPosition >= threshold) {
      this.loadMoreProducts();
    }
  }

  // Cargar más productos visibles al hacer scroll
  loadMoreProducts(): void {
    // Evitar múltiples cargas o intentar cargar más productos de los disponibles
    if (
      this.isLoading || // Verificar si ya está cargando productos
      this.visibleProducts.length >= this.filteredProducts.length // Detener si todos los productos ya están visibles
    ) {
      return;
    }

    this.isLoading = true; // Activar bandera de carga

    // Simular un retardo para cargar más productos
    setTimeout(() => {
      const startIndex = this.currentPage * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;

      // Añadir más productos visibles desde la lista filtrada
      this.visibleProducts = [
        ...this.visibleProducts,
        ...this.filteredProducts.slice(startIndex, endIndex),
      ];

      this.currentPage++; // Incrementar la página actual
      this.isLoading = false; // Desactivar bandera de carga
    }, 500);
  }

  // Añadir un producto al carrito
  addToCart(product: Product): void {
    this.cartService.addToCartWithAuth(product); // Método centralizado para manejar el carrito
  }
}
