import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FormateurService {

    private apiUrl = 'http://localhost:8000/api'; // Assuming this is the endpoint for formateurs

    constructor(private http: HttpClient) { }

    getFormateurs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/formateurs`);
    }

    getFormateurById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/formateur/${id}`);
    }
    deleteFormateur(id: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/formateur/${id}`);
    }
    createFormateur(formateur: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/formateur`, formateur);
    }
    updateFormateur(id: string, formateur: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/formateur/${id}`, formateur);
    }
}