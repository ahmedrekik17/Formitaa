// src/app/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Userinfo } from './userinfo';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private Url = 'http://localhost:8000/api';

  // Authentication based on the presence of HttpOnly cookie which can't be accessed by JS
  isAuthenticated(): boolean {
    return false;
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.Url}/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          console.log('Login Response:', response); // Add this line
        })
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.Url}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          // when the user logout, the server should be responsible to destroy the cookie
        }),
        catchError((error) => {
          console.error('Logout failed:', error);
          return throwError(() => new Error('Logout failed'));
        })
      );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.Url}/register`, user);
  }

  getLoggedInUser(): Observable<Userinfo | null> {
    return this.http
      .get<Userinfo>(`${this.Url}/loggeduser`, { withCredentials: true })
      .pipe(
        catchError((error) => {
          // Silently fail if not logged in
          if (error.status === 400 || error.status === 401) {
            return of(null); // not logged in
          }
          console.error('Error fetching logged-in user:', error);
          return of(null);
        })
      );
  }

  updateUserProfile(userId: string, user: any): Observable<any> {
    return this.http.put(`http://localhost:8000/api/user/${userId}`, user); // Ensure this URL matches the backend route
  }
}
