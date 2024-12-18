import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts'; // Importa Color y ScaleType

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  single: any[] = [
    {
      name: 'Germany',
      value: 8940000,
    },
    {
      name: 'USA',
      value: 5000000,
    },
    {
      name: 'France',
      value: 7200000,
    },
  ];

  view: [number, number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal, // Usa ScaleType.Ordinal
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  onSelect(event: any): void {
    console.log(event);
  }
}
