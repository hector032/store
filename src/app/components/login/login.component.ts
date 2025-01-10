import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  returnUrl: string = '/home'; // URL predeterminada si no hay `returnUrl`

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtén el valor de `returnUrl` de los parámetros de la ruta, si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }
  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl(this.returnUrl); // Redirige a `returnUrl`
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
