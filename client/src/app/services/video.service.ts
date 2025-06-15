import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private baseUrl = 'http://localhost:8000/api'; // Adjust as needed

  constructor(private http: HttpClient) {}

  /**
   * Upload a single video for a specific training
   */
  uploadVideo(trainingId: string, videoFile: File, title: string): Observable<any> {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);

    return this.http.post(`${this.baseUrl}/training/${trainingId}/videos`, formData);
  }

  /**
   * Get all videos for a specific training
   */
  getVideosByTraining(trainingId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/training/${trainingId}/videos`);
  }

  /**
   * Update a video's title
   */
  updateVideo(videoId: string, title: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/videos/${videoId}`, { title });
  }

  /**
   * Delete a video by ID
   */
  deleteVideo(videoId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/videos/${videoId}`);
  }
}
