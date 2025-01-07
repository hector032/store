import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

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
  ],
})
export class HeaderComponent implements OnInit {
  categories: string[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  /*
   * Método onSearch: Maneja la búsqueda de productos.
   * Captura el término ingresado por el usuario y redirige a la ruta de productos,
   * pasando el término como parámetro de consulta (queryParams).
   */
  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.router.navigate(['/products'], {
      queryParams: { search: searchTerm },
    });
  }

  // Igual que onSearch, pero para la selección de categorías
  onSelectCategory(event: any): void {
    const selectedCategory = event.value;
    this.router.navigate(['/products'], {
      queryParams: { category: selectedCategory },
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
