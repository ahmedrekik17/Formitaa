import { Component, OnInit } from '@angular/core';
import { FormationService } from '../services/formation.service';
import { EvaluationService } from '../services/evaluation.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-formation-card',
  templateUrl: './formation-card.component.html',
  styleUrls: ['./formation-card.component.css'],
})
export class FormationCardComponent implements OnInit {
  details: any[] = [];
  evaluations: any[] = [];
  userId: string | null = null;
  showNoteModal: boolean = false;
  selectedTrainingId: string | null = null;
  totalSomme: number = 0; // Declare a variable to store the sum
  note1: number | null = null;
  note2: number | null = null;
  note3: number | null = null;
  note4: number | null = null;
  comment:string='';

  constructor(
    private formationService: FormationService,
    private evaluationService: EvaluationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe((user) => {
      if (user) {
        this.userId = user._id;
        this.loadEvaluations();
      }
    });

    this.loadTrainings();
  }

  private loadTrainings(): void {
    this.formationService.getTrainings().subscribe((data) => {
      // Sort the trainings by createdAt in descending order (newest first)
      this.details = data.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });
  }

  private loadEvaluations(): void {
    if (this.userId) {
      this.evaluationService.getEvaluationsByUserId(this.userId).subscribe((data) => {
        this.evaluations = data;
      });
    }
  }

  isRegistered(trainingId: string): boolean {
    return this.evaluations.some(
      (evaluation) => evaluation.training._id === trainingId && evaluation.user._id === this.userId
    );
  }

  onRegister(trainingId: string): void {
    if (this.isRegistered(trainingId)) return;

    this.evaluationService.registerUser(trainingId, this.userId!).subscribe(() => {
      this.loadEvaluations();
    });
  }

  
  openNoteModal(trainingId: string): void {
    const selectedTraining = this.details.find(detail => detail._id === trainingId);
    
    if (selectedTraining && selectedTraining.etat === 'Terminé') {
      this.selectedTrainingId = trainingId;
      this.showNoteModal = true;
    }
  }
  

  closeNoteModal(): void {
    this.showNoteModal = false;
    this.selectedTrainingId = null;
  }

  submitNote(): void {
    if (this.selectedTrainingId) {
      if (this.note1 === null || this.note2 === null || this.note3 === null || this.note4 === null) {
        alert('Veuillez remplir toutes les évaluations.');
        return;
      }
  
      // Calculate the total score and store it in totalSomme
      this.totalSomme = Number(this.note1 ?? 0) + Number(this.note2 ?? 0) + Number(this.note3 ?? 0) + Number(this.note4 ?? 0);
  
      const evaluation = this.evaluations.find(e => e.training._id === this.selectedTrainingId && e.user._id === this.userId);
      if (!evaluation) {
        console.error('Evaluation not found');
        return;
      }
  
      const updatedEvaluation = {
        note: this.totalSomme,
        comment: this.comment // Include the comment
      };

      console.log('Payload:', updatedEvaluation);

  
  
      this.evaluationService.updateEvaluation(this.selectedTrainingId, evaluation._id, updatedEvaluation)
        .subscribe(() => {
          this.closeNoteModal();
          this.loadEvaluations();
        }, (error) => {
          console.error('Error updating evaluation:', error);
        });
    }
  }
  
}
