import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent<T = unknown> {
  @Input() label: string = ''; // Etiqueta del input
  @Input() type: string = 'text'; // Tipo de input (texto, email, contraseña)
  @Input() placeholder: string = ''; // Placeholder
  @Input() model!: T; // Variable enlazada con ngModel
  @Input() name!: string; // Nombre del campo (requerido para ngModel)
  @Input() required: boolean = false; // Validación requerida

  @Output() modelChange: EventEmitter<T> = new EventEmitter<T>(); // Emisor de cambios

  // Método que actualiza y emite el valor
  onModelChange(value: T) {
    this.model = value;
    this.modelChange.emit(value);
  }
}
