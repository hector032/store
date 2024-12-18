import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  // Método para obtener todos los productos desde la API
  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Método para obtener un producto por su id.
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para obtener las categorías.
  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }
}
