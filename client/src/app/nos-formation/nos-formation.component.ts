import { Component, OnInit } from '@angular/core';
import { FormationService } from '../services/formation.service';
import { EvaluationService } from '../services/evaluation.service'; // Import the EvaluationService

@Component({
  selector: 'app-nos-formation',
  templateUrl: './nos-formation.component.html',
  styleUrls: ['./nos-formation.component.css']
})
export class NosFormationComponent implements OnInit {
  latestComments: any[] = []; 
  details: any[]=[];

  constructor(
    private formationService: FormationService,
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

  filterMode: string = 'Tous'; // Default filter


}