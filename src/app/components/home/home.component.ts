import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  logout(): void {
    this.authService.logout();
  }

  // Datos iniciales para la gráfica
  single: any[] = [];
  view: [number, number] = [700, 400]; // Tamaño inicial

  // Opciones de gráfica
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Métrica';
  showYAxisLabel = true;
  yAxisLabel = 'Valor';

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  // Métricas disponibles
  metrics = {
    salesByProduct: [
      { name: 'Mens Cotton Jacket', value: 150 },
      { name: 'White Gold Plated Princess', value: 100 },
      { name: 'SanDisk SSD PLUS 1TB Internal SSD', value: 75 },
    ],
    salesByCategory: [
      { name: 'Electrónica', value: 500 },
      { name: 'Ropa', value: 300 },
      { name: 'Joyeria', value: 200 },
    ],
    inventoryByCategory: [
      { name: 'Electrónica', value: 60 },
      { name: 'Ropa', value: 320 },
      { name: 'Joyeria', value: 120 },
    ],
    salesByMonth: [
      { name: 'Enero', value: 1000 },
      { name: 'Febrero', value: 1200 },
      { name: 'Marzo', value: 900 },
    ],
  };

  // Ajustar el tamaño del gráfico dinámicamente
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateChartSize();
  }

  ngOnInit(): void {
    this.onMetricChange('salesByProduct'); // Muestra "Productos más vendidos" por defecto
    this.updateChartSize(); // Ajustar el tamaño del gráfico al cargar
  }

  updateChartSize(): void {
    const containerWidth =
      document.querySelector('.chart-section')?.clientWidth ||
      window.innerWidth;
    const width = Math.min(containerWidth * 0.9, 800); // Máximo 800px
    const height = Math.min(400, width * 0.5); // Mantener proporción
    this.view = [width, height];
  }

  // Cambiar la métrica mostrada
  onMetricChange(eventOrMetric: Event | keyof typeof this.metrics): void {
    let metric: keyof typeof this.metrics;

    if (typeof eventOrMetric === 'string') {
      metric = eventOrMetric;
    } else {
      const target = eventOrMetric.target as HTMLSelectElement;
      metric = target.value as keyof typeof this.metrics;
    }

    if (metric && metric in this.metrics) {
      this.single = this.metrics[metric];
      switch (metric) {
        case 'salesByProduct':
          this.xAxisLabel = 'Productos';
          this.yAxisLabel = 'Cantidad Vendida';
          break;
        case 'salesByCategory':
          this.xAxisLabel = 'Categorías';
          this.yAxisLabel = 'Ventas';
          break;
        case 'inventoryByCategory':
          this.xAxisLabel = 'Categorías';
          this.yAxisLabel = 'Inventario';
          break;
        case 'salesByMonth':
          this.xAxisLabel = 'Mes';
          this.yAxisLabel = 'Ventas';
          break;
      }
    }
  }

  onSelect(event: any): void {
    console.log('Elemento seleccionado:', event);
  }
}
