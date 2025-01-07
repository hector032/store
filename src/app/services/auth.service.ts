import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  register(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users`, { params: { username, password } })
      .pipe(
        map((users) => {
          if (users.length > 0) {
            sessionStorage.setItem('user', JSON.stringify(users[0]));
            return true;
          }
          return false;
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('user');
  }

  getCurrentUser(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
