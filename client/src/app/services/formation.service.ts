import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Get all trainings
  getTrainings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trainings`).pipe(
      catchError(error => {
        console.error('Error fetching trainings:', error);
        return throwError(error);
      })
    );
  }

  // Get a specific training by ID
  getTrainingById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/training/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching training with ID ${id}:`, error);
        return throwError(error);
      })
    );
  }

  // Create a new training
  createTraining(formData: FormData): Observable<any> {
    console.log('FormData being sent:', formData);  
    return this.http.post<any>(`${this.apiUrl}/training`, formData).pipe(
      catchError(error => {
        console.error('Error creating training:', error);
        return throwError(error);
      })
    );
  }

  // Update an existing training
  updateTraining(id: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/training/${id}`, updatedData).pipe(
      catchError(error => {
        console.error(`Error updating training with ID ${id}:`, error);
        return throwError(error);
      })
    );
  }

  // Delete a training by ID
  deleteTraining(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/training/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting training with ID ${id}:`, error);
        return throwError(error);
      })
    );
  }

  getFilteredTrainings(): Observable<any> {
  return this.http.get('http://localhost:8000/api/filtered-trainings', { withCredentials: true });
}
}
