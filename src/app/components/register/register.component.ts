import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (this.username && this.password) {
      const newUser = { username: this.username, password: this.password };
      this.authService.register(newUser).subscribe(
        () => {
          alert('Usuario registrado exitosamente');
          this.router.navigate(['/login']); // Redirige a login después de registrarse
        },
        (error) => {
          console.error(error);
          alert('Error al registrar el usuario');
        }
      );
    } else {
      alert('Por favor, complete todos los campos');
    }
  }
}
