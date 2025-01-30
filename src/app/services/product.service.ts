import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

// La API devuelve un array de strings para las categorías
export type Category = string;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';
  //private apiUrl = 'https://fakestoreapi.com/productsss'; // fake url para probar interceptor

  constructor(private http: HttpClient) {}

  // Método para obtener todos los productos desde la API
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Método para obtener un producto por su id.
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Método para obtener las categorías.
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
