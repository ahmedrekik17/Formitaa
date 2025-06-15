import { Component, Input, OnInit } from '@angular/core';
import { FormationService } from '../services/formation.service';
import { EvaluationService } from '../services/evaluation.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-formation-card',
  templateUrl: './formation-card.component.html',
  styleUrls: ['./formation-card.component.css'],
})
export class FormationCardComponent implements OnInit {
  detailsPrésentiel: any[] = [];
  evaluations: any[] = [];
  userId: string | null = null;
  showNoteModal: boolean = false;
  selectedTrainingId: string | null = null;
  totalSomme: number = 0;
  note1: number | null = null;
  note2: number | null = null;
  note3: number | null = null;
  note4: number | null = null;
  comment:string='';
  detailsEnLigne: any[]=[];

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

  @Input() filterMode: string = 'Tous';
  get filteredDetails() {
    if (this.filterMode === 'Tous') return [...this.detailsPrésentiel, ...this.detailsEnLigne];
  
    if (this.filterMode === 'Présentiel') return this.detailsPrésentiel;
    if (this.filterMode === 'En ligne') return this.detailsEnLigne;
  
    return [];
  }

  private loadTrainings(): void {
    this.formationService.getTrainings().subscribe((data) => {
      const sorted = data.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  
      // Filter only "Présentiel" trainings
      this.detailsPrésentiel = sorted.filter(t => t.mode_formation === 'Présentiel');
      this.detailsEnLigne = sorted.filter(t => t.mode_formation === 'En ligne');

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
    const selectedTraining = this.detailsPrésentiel.find(detail => detail._id === trainingId);
    
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
