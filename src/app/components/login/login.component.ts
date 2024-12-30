import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/home']); // Redirige a Home
        } else {
          alert('Credenciales inválidas');
        }
      },
      (error) => {
        console.error(error);
        alert('Error al iniciar sesión');
      }
    );
  }
}
