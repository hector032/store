import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('500ms ease-in')]),
    ]),
  ],
})

// El componente SearchBarComponent recibe un término de búsqueda y emite un evento
export class SearchBarComponent {
  @Output() searchTerm = new EventEmitter<string>();

  // El método onSearch emite el término de búsqueda
  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const term = inputElement.value;
    this.searchTerm.emit(term);
  }
}
