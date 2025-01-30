import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.snackBar.open(
        'Necesitas iniciar sesión para realizar esta acción.',
        'Cerrar',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }
      );
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }
}
