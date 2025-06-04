import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl='http://localhost:8000/api'

  constructor(private http: HttpClient) {
  }
  updateUserProfile(userId: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${userId}`, user); // Ensure this URL matches the backend route
  }
  
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`); // Assuming this endpoint returns all users
  }
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${userId}`); // Updated URL
  }
}
