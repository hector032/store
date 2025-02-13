import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    CommonModule,
    SearchBarComponent,
    CategoryFilterComponent,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    ButtonComponent,
    RouterModule,
    MatIconModule,
  ],
})
export class HeaderComponent implements OnInit {
  categories: string[] = [];
  menuOpened: boolean = false; // Estado del menú hamburguesa
  menuEnabled: boolean = true; // Controla si el menú hamburguesa debe estar activo
  showSearchAndCategories: boolean = false; // Mostrar campos de búsqueda solo en /products
  isAuthenticated: boolean = false; // Estado de autenticación del usuario

  constructor(
    private productService: ProductService,
    private router: Router,
    private destroyRef: DestroyRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribirse al estado de autenticación como observable
    this.authService.isAuthenticated$
      .pipe(takeUntilDestroyed(this.destroyRef)) // Manejo automático de la destrucción
      .subscribe((status) => {
        this.isAuthenticated = status;
        console.log('Estado de autenticación actualizado:', status);
      });

    // Cargar las categorías desde el servicio
    this.productService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef)) // Automatiza la destrucción de la suscripción
      .subscribe((data) => {
        this.categories = data;
        //console.log('Categorías cargadas:', data);
      });

    // Detectar cambios en la ruta para mostrar u ocultar búsqueda y categorías
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef)) // Automatiza la destrucción de la suscripción
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showSearchAndCategories = this.router.url.includes('/products');
          console.log(
            'Cambio de ruta, mostrar búsqueda:',
            this.showSearchAndCategories
          );
        }
      });
  }

  toggleMenu(): void {
    console.log('Menu toggled');
    this.menuOpened = !this.menuOpened; // Alterna el estado del menú
  }

  // Recibe el término de búsqueda desde el SearchBarComponent
  onSearch(searchTerm: string): void {
    console.log('Término de búsqueda:', searchTerm);
    this.router.navigate(['/products'], {
      queryParams: { search: searchTerm },
    });
  }

  // Recibe la categoría seleccionada desde el CategoryFilterComponent
  onSelectCategory(category: string): void {
    //console.log('Categoría seleccionada:', category);
    this.router.navigate(['/products'], { queryParams: { category } });
  }

  // Controla la navegación al home
  goToHome(): void {
    this.router.navigate(['/']);
  }

  closeMenu(): void {
    this.menuOpened = false;
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
    console.log('Sesión cerrada');
  }

  ngOnDestroy(): void {
    console.log('El componente ha sido destruido.');
  }
}
