import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button'; // Tipo de botón
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary'; // Color de Material
  @Input() navigateTo: string | null = null; // Ruta para navegar

  constructor(private router: Router) {}

  handleClick(event: Event) {
    if (this.navigateTo) {
      this.router.navigate([this.navigateTo]);
    }
  }
}
