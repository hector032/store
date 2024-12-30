import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  user: any;

  constructor(private authService: AuthService, private router: Router) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
