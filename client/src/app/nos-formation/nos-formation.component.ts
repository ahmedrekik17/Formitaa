import { Component, OnInit } from '@angular/core';
import { EvaluationService } from '../services/evaluation.service';
import { FormateurService } from '../services/formateur.service';
import { HttpClient } from '@angular/common/http';
import { Userinfo } from '../services/userinfo';
import { AuthService } from '../services/auth.service';

interface WeeklyFormation {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  location: string;
}

@Component({
  selector: 'app-nos-formation',
  templateUrl: './nos-formation.component.html',
  styleUrls: ['./nos-formation.component.css']
})
export class NosFormationComponent implements OnInit {
  filterMode: string = 'Nos Formations';
  latestComments: any[] = [];
  selectedTraining: string | null = null;
  showTrainersModal = false;
  trainers: any[] = [];

  trainingIcons = [
    { name: 'Angular', icon: 'assets/images/angular.png' },
    { name: 'JavaScript', icon: 'assets/images/javascript.png' },
    { name: 'React', icon: 'assets/images/react.png' },
    { name: 'Spring Boot', icon: 'assets/images/sp.png' },
        { name: 'Java', icon: 'assets/images/java.png' },

    // Add more icons as needed
  ];

  days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  hours = Array.from({ length: 12 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`);
  formationsByDay: { [key: string]: WeeklyFormation[] } = {};
  public user: Userinfo | null = null;

  constructor(
    private evaluationService: EvaluationService,
    private trainerService: FormateurService,

  ) {}

  // Variable to hold the user ID



  ngOnInit(): void {

    this.loadLatestComments();

  }

  loadLatestComments(): void {
    this.evaluationService.getLatestEvaluations().subscribe({
      next: (data) => (this.latestComments = data),
      error: (err) => console.error('Error fetching latest comments:', err)
    });
  }


  

  groupByDay(formations: WeeklyFormation[]): { [key: string]: WeeklyFormation[] } {
    const daysFr = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const grouped: { [key: string]: WeeklyFormation[] } = {};
    for (const f of formations) {
      const dayName = daysFr[new Date(f.date).getDay()];
      if (!grouped[dayName]) grouped[dayName] = [];
      grouped[dayName].push(f);
    }
    return grouped;
  }

  showTrainers(trainingName: string): void {
    this.selectedTraining = trainingName;
    this.trainerService.getTrainersBySpecialite(trainingName).subscribe({
      next: (trainers) => (this.trainers = trainers),
      error: (err) => console.error('Failed to fetch trainers:', err)
    });
  }

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

  getIcon(trainingName: string): string | null {
    const iconObj = this.trainingIcons.find(t => t.name.toLowerCase() === trainingName.toLowerCase());
    return iconObj ? iconObj.icon : null;
  }
}
