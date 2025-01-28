import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    // Configuramos el entorno de pruebas para SearchBarComponent
    await TestBed.configureTestingModule({
      imports: [
        SearchBarComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [provideAnimations()], // Necesario para animaciones o Angular Material
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    // Validamos que el componente exista
    expect(component).toBeTruthy();
  });

  it('debería emitir un término de búsqueda válido', () => {
    spyOn(component.searchTerm, 'emit'); // Espiamos el evento emit
    const mockSearchValue = 'angular testing';

    // Simulamos que el usuario escribe un término
    component.searchValue = mockSearchValue;

    // Llamamos al método emitSearch
    component.emitSearch();

    // Verificamos que el término fue emitido correctamente
    expect(component.searchTerm.emit).toHaveBeenCalledWith(mockSearchValue);
  });

  it('no debería emitir un término vacío o en blanco', () => {
    spyOn(component.searchTerm, 'emit'); // Espiamos el evento emit

    // Caso 1: Cadena vacía
    component.searchValue = '';
    component.emitSearch();
    expect(component.searchTerm.emit).not.toHaveBeenCalled();

    // Caso 2: Cadena en blanco
    component.searchValue = '   ';
    component.emitSearch();
    expect(component.searchTerm.emit).not.toHaveBeenCalled();
  });
});
