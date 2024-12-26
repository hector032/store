import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Importa MatProgressSpinnerModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent {}
