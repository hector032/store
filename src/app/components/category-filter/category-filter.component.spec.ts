import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFilterComponent } from './category-filter.component';
import { ProductService } from '../../services/product.service';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatSelectChange } from '@angular/material/select'; // Importamos el tipo adecuado

describe('CategoryFilterComponent', () => {
  let component: CategoryFilterComponent;
  let fixture: ComponentFixture<CategoryFilterComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getCategories',
    ]);

    // Simulamos el retorno de getCategories
    productServiceSpy.getCategories.and.returnValue(
      of(['electronics', 'jewelery', 'men clothing'])
    );

    await TestBed.configureTestingModule({
      imports: [CategoryFilterComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        provideHttpClient(),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFilterComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar las categorías desde el servicio', () => {
    fixture.detectChanges(); // Dispara el ciclo de detección para cargar las categorías

    // Verificamos que las categorías se asignan correctamente
    expect(component.categories).toEqual([
      'electronics',
      'jewelery',
      'men clothing',
    ]);
    expect(productServiceSpy.getCategories).toHaveBeenCalled();
  });

  it('debería emitir la categoría seleccionada', () => {
    const mockCategory = 'electronics';
    spyOn(component.selectedCategory, 'emit'); // Espiamos el evento emit

    // Simulamos un evento de selección usando MatSelectChange
    const event: MatSelectChange = {
      value: mockCategory,
      source: {} as any,
    };

    component.onSelectCategory(event); // Llamamos al método para seleccionar la categoría

    // Verificamos que el evento se emite con la categoría correcta
    expect(component.selectedCategory.emit).toHaveBeenCalledWith(mockCategory);
  });
});
