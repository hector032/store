import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css'],
  encapsulation: ViewEncapsulation.None, // Desactiva encapsulación de estilos
})

// Componente para filtrar productos por categoría
export class CategoryFilterComponent {
  @Output() selectedCategory = new EventEmitter<string>(); // Evento para emitir la categoría seleccionada

  categories: string[] = []; // Array de categorias (se obtendría de la API)
  selectedCategoryValue: string = ''; // categorias seleccionadas

  constructor(private productService: ProductService) {
    const destroyRef = inject(DestroyRef); // Inyectamos DestroyRef para el ciclo de vida del componente
    this.productService
      .getCategories()
      .pipe(takeUntilDestroyed(destroyRef)) // Usamos DestroyRef en takeUntilDestroyed para destruir la suscripción
      .subscribe((data) => {
        console.log('Categorías recibidas:', data);
        this.categories = data; // Actualizamos la lista de categorías
      });
  }

  // Método para seleccionar una categoría
  onSelectCategory(event: MatSelectChange): void {
    const category = event.value;
    this.selectedCategory.emit(category); // Emitimos la categoría seleccionada al componente padre (product-list) para poder filtrar
  }

  ngOnDestroy(): void {
    console.log('El componente ha sido destruido.');
  }
}
