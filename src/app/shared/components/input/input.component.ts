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
export class InputComponent {
  @Input() label: string = ''; // Etiqueta del input
  @Input() type: string = 'text'; // Tipo de input (texto, email, contraseña)
  @Input() placeholder: string = ''; // Placeholder
  @Input() model!: any; // Variable enlazada con ngModel
  @Input() name!: string; // Nombre del campo (requerido para ngModel)
  @Input() required: boolean = false; // Validación requerida

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>(); // Emisor de cambios

  // Método que actualiza y emite el valor
  onModelChange(value: any) {
    this.model = value;
    this.modelChange.emit(value);
  }
}
