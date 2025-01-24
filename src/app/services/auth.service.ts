import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

// Interfaz para los usuarios
interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  // BehaviorSubject para mantener el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  // Observable para que los componentes se suscriban a los cambios de autenticación
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(user: { username: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users`, { params: { username, password } })
      .pipe(
        map((users) => {
          if (users.length > 0) {
            sessionStorage.setItem('user', JSON.stringify(users[0]));
            this.isAuthenticatedSubject.next(true); // Actualizar el estado de autenticación
            return true;
          }
          return false;
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false); // Actualizar el estado
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('user');
  }

  getCurrentUser(): User | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
