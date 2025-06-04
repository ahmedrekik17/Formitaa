import { Component } from '@angular/core';
import { EvaluationService } from '../services/evaluation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
 
  latestComments: any[] = []; 

  constructor(
    private evaluationService: EvaluationService 
  ) {}

  ngOnInit(): void {
    this.loadLatestComments();
  }

  // Method to fetch the latest comments
  private loadLatestComments(): void {
    this.evaluationService.getLatestEvaluations().subscribe(
      (data) => {
        this.latestComments = data; 
      },
      (error) => {
        console.error('Error fetching latest comments:', error);
      }
    );
  }
}
