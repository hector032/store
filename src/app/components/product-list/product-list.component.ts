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
  cols = 2; // Número de columnas en función del dispositivo
  allProducts: Product[] = []; // Todos los productos
  visibleProducts: Product[] = []; // Productos visibles en la página
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 6; // Productos por página
  isLoading: boolean = false; // Bandera para indicar si está cargando
  searchTerm: string = ''; // Término de búsqueda
  selectedCategory: string = ''; // Categoría seleccionada

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Detectar tamaño de pantalla
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .subscribe((result) => {
        if (result.matches) {
          this.cols = result.breakpoints[Breakpoints.Handset] ? 1 : 2;
        }
      });

    // Escuchar parámetros de búsqueda o categoría
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.loadProducts();
    });

    // Detectar el scroll
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy(): void {
    // Eliminar listener de scroll para evitar fugas de memoria
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  // Cargar todos los productos
  loadProducts(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      // Duplicar productos varias veces para simular más datos
      const duplicates = 5; // Cambia este número para duplicar más veces los productos
      this.allProducts = Array.from({ length: duplicates }, () => data).flat();

      // Truncar títulos y descripciones para mantener el diseño limpio
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

      // Inicialmente, mostrar los primeros productos
      this.visibleProducts = this.allProducts.slice(0, this.itemsPerPage);
    });
  }

  // Detectar cuando el usuario llega al final de la página
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY; // Posición actual del scroll
    const threshold = document.body.offsetHeight - 100; // Límite para cargar más productos

    if (scrollPosition >= threshold) {
      this.loadMoreProducts(); // Cargar más productos
    }
  }

  // Cargar más productos
  loadMoreProducts(): void {
    if (
      this.isLoading ||
      this.visibleProducts.length >= this.allProducts.length
    ) {
      return; // Evitar múltiples llamadas o cargar más de lo necesario
    }

    this.isLoading = true;

    setTimeout(() => {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;

      // Agregar más productos visibles
      this.visibleProducts = [
        ...this.visibleProducts,
        ...this.allProducts.slice(startIndex, endIndex),
      ];

      this.isLoading = false; // Finalizar carga
    }, 500); // Simulación de retardo para mejor UX
  }

  // Añadir al carrito
  addToCart(product: Product): void {
    if (this.authService.isAuthenticated()) {
      this.cartService.addToCart(product);
      console.log('Producto agregado al carrito:', product);
    } else {
      alert('Por favor, inicia sesión para agregar productos al carrito.');
      this.router.navigate(['/login']);
    }
  }
}
