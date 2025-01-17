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

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    CommonModule,
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

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    // Cargar las categorías desde el servicio
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });

    // Detectar cambios en la ruta para mostrar u ocultar búsqueda y categorías
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showSearchAndCategories = this.router.url.includes('/products');
      }
    });
  }

  toggleMenu(): void {
    console.log('Menu toggled');
    this.menuOpened = !this.menuOpened; // Alterna el estado del menú
  }

  // Maneja la búsqueda de productos
  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.router.navigate(['/products'], {
      queryParams: { search: searchTerm },
    });
  }

  // Maneja la selección de categorías
  onSelectCategory(event: any): void {
    const selectedCategory = event.value;
    this.router.navigate(['/products'], {
      queryParams: { category: selectedCategory },
    });
  }

  // Controla la navegación al home
  goToHome(): void {
    this.router.navigate(['/']);
  }

  closeMenu(): void {
    this.menuOpened = false; // Cierra el menú al hacer clic en "Cerrar"
  }
}
