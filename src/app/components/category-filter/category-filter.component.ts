import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css'],
})

// Componente para filtrar productos por categoría
export class CategoryFilterComponent {
  @Output() selectedCategory = new EventEmitter<string>();

  // Array de categorias (se obtendría de la API)
  categories: string[] = [];

  // categorias seleccionadas
  selectedCategoryValue: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  // Método para seleccionar una categoría
  onSelectCategory(event: any): void {
    const category = event.value;
    if (category) {
      this.selectedCategoryValue = category;
      this.selectedCategory.emit(category);
    }
  }
}
