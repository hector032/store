import { Component } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MatProgressSpinnerModule,
    LoadingComponent,
    MatSnackBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'store';
  isLoading = false;

  constructor(private router: Router) {
    // Suscripción a los eventos de navegación del Router
    this.router.events
      .pipe(takeUntilDestroyed()) // Se destruye automáticamente cuando el componente es eliminado
      .subscribe((event) => {
        // Detectamos cuando la navegación inicia
        if (event instanceof NavigationStart) {
          this.isLoading = true;
        }
        // Detectamos cuando la navegación finaliza o se cancela
        else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          setTimeout(() => {
            this.isLoading = false; // Terminamos el estado de carga
          }, 1000); // Retraso de 1 segundo para simular carga
        }
      });
  }
}
