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

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatGridListModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ProductService],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('500ms ease-in')]),
    ]),
  ],
})
export class ProductListComponent implements OnInit, OnDestroy {
  cols = 2;
  allProducts: Product[] = []; // Todos los productos (incluyendo duplicados)
  filteredProducts: Product[] = []; // Productos que cumplen los filtros activos
  visibleProducts: Product[] = []; // Productos visibles en la pantalla
  currentPage: number = 1; // Página actual para el scroll infinito
  itemsPerPage: number = 6; // Cantidad de productos por página
  isLoading: boolean = false; // Bandera para indicar si los datos se están cargando
  searchTerm: string = ''; // Término de búsqueda ingresado por el usuario
  selectedCategory: string = ''; // Categoría seleccionada por el usuario

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Detectar el tamaño de pantalla y ajustar el número de columnas
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .subscribe((result) => {
        this.cols = result.breakpoints[Breakpoints.Handset] ? 1 : 2;
      });

    // Escuchar cambios en los parámetros de búsqueda o categoría desde la URL
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || ''; // Obtener el término de búsqueda
      this.selectedCategory = params['category'] || ''; // Obtener la categoría seleccionada
      this.resetAndApplyFilters(); // Aplicar filtros y reiniciar el estado visible
    });

    // Agregar un listener para detectar el evento de scroll
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy(): void {
    // Eliminar el listener de scroll al destruir el componente
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  // Cargar todos los productos desde el servicio
  loadProducts(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      // Duplicar los productos para pruebas (simulación de una lista más grande)
      const duplicates = 5;
      this.allProducts = Array.from({ length: duplicates }, () => data).flat();

      // Truncar títulos y descripciones para evitar diseños desbordados
      this.allProducts = this.allProducts.map((product) => ({
        ...product,
        title:
          product.title.length > 50
            ? product.title.slice(0, 50) + '...'
            : product.title,
        description:
          product.description.length > 100
            ? product.description.slice(0, 100) + '...'
            : product.description,
      }));

      // Aplicar filtros iniciales a los productos cargados
      this.applyFilters();
    });
  }

  // Aplicar filtros según el término de búsqueda y la categoría seleccionada
  applyFilters(): void {
    this.filteredProducts = this.allProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) && // Filtro por término de búsqueda
        (this.selectedCategory
          ? product.category === this.selectedCategory // Filtro por categoría
          : true)
    );

    // Reiniciar los productos visibles al aplicar filtros
    this.visibleProducts = this.filteredProducts.slice(0, this.itemsPerPage);
  }

  // Resetear el estado visible y aplicar filtros
  resetAndApplyFilters(): void {
    this.currentPage = 1; // Reiniciar la página actual
    this.visibleProducts = []; // Vaciar los productos visibles
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
    if (
      this.isLoading || // Evitar múltiples cargas simultáneas
      this.visibleProducts.length >= this.filteredProducts.length // Detener si ya se cargaron todos los productos filtrados
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
    this.cartService.addToCartWithAuth(product); // Usar el método centralizado
  }
}
