import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private baseUrl = 'http://localhost:8000/api'; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  // Fetch evaluations by user ID
  getEvaluationsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/evaluations/user/${userId}`);
  }

  // Register a user for a training session
  registerUser(trainingId: string, userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/evaluations/register`, { trainingId, userId });
  }

  registerGuest(trainingId: string, name: string, email: string): Observable<any> {
    const guestData = { trainingId, name, email };
    // This endpoint must match the one you defined in your backend routes
    return this.http.post(`${this.baseUrl}/guest/register`, guestData);
  }

  // Update evaluation by trainingId and evaluationId
  updateEvaluation(trainingId: string, evaluationId: string, updatedEvaluation: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/evaluations/${evaluationId}`, updatedEvaluation);
  }

  getLatestEvaluations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/evaluations/latest`);
}
}
