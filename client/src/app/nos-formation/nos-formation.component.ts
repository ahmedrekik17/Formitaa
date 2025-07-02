// nos-formation.component.ts
import { Component, OnInit } from '@angular/core';
import { EvaluationService } from '../services/evaluation.service';
import { FormationService } from '../services/formation.service';
import { FormateurService } from '../services/formateur.service';

@Component({
  selector: 'app-nos-formation',
  templateUrl: './nos-formation.component.html',
  styleUrls: ['./nos-formation.component.css']
})
export class NosFormationComponent implements OnInit {
  filterMode: string = 'Nos Formations';
  latestComments: any[] = [];
  trainingIcons = [
    { name: 'Angular', icon: 'assets/images/angular.png' },
    { name: 'JavaScript', icon: 'assets/images/javascript.png' },
    { name: 'React', icon: 'assets/images/react.png' }
    // ...add more icons
  ];
  selectedTraining: string | null = null;
  trainers: any[] = [];

  constructor(
    private evaluationService: EvaluationService,
    private trainerService: FormateurService
  ) {}

  ngOnInit(): void {
    this.loadLatestComments();
  }

  loadLatestComments(): void {
    this.evaluationService.getLatestEvaluations().subscribe({
      next: (data) => (this.latestComments = data),
      error: (err) => console.error('Error fetching latest comments:', err)
    });
  }

  showTrainers(trainingName: string): void {
    this.selectedTraining = trainingName;
    this.trainerService.getTrainersBySpecialite(trainingName).subscribe({
      next: (trainers) => (this.trainers = trainers),
      error: (err) => console.error('Failed to fetch trainers:', err)
    });
  }

  // Add these properties to your component
showTrainersModal = false;

// Add these methods to your component class

openTrainersModal(trainingName: string) {
  this.selectedTraining = trainingName;
  this.showTrainers(trainingName);
  this.showTrainersModal = true;
}

closeTrainersModal() {
  this.showTrainersModal = false;
}

getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Keep your existing showTrainers method as is
}
