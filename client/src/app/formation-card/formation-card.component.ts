import { Component, Input, OnInit } from '@angular/core';
import { FormationService } from '../services/formation.service';
import { EvaluationService } from '../services/evaluation.service';
import { AuthService } from '../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formation-card',
  templateUrl: './formation-card.component.html',
  styleUrls: ['./formation-card.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class FormationCardComponent implements OnInit {
  detailsPrésentiel: any[] = [];
  detailsEnLigne: any[] = [];
  evaluations: any[] = [];
  userId: string | null = null;
  showNoteModal: boolean = false;
  showSuccessToast: boolean = false;
  selectedTrainingId: string | null = null;

  noteData = {
    note1: null as number | null,
    note2: null as number | null,
    note3: null as number | null,
    note4: null as number | null,
    commentaire: ''
  };

    totalSomme: number = 0;


  constructor(
    private formationService: FormationService,
    private evaluationService: EvaluationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      this.authService.getLoggedInUser().subscribe((user) => {
        if (user) {
          this.userId = user._id;
          this.loadEvaluations();
        }
      });
    }
    this.loadTrainings();
  }

  @Input() filterMode: string = 'Nos Formations';
  get filteredDetails() {
  
    if (this.filterMode === 'Présentiel') return this.detailsPrésentiel;
    if (this.filterMode === 'En ligne') return this.detailsEnLigne;
  
    return [];
  }


  private loadTrainings(): void {
    this.formationService.getFilteredTrainings().subscribe((data) => {
      const sorted = data.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.detailsPrésentiel = sorted.filter((t: any) => t.mode_formation === 'Présentiel');
      this.detailsEnLigne = sorted.filter((t: any) => t.mode_formation === 'En ligne');
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
      (evaluation) => evaluation.training._id === trainingId
    );
  }

  onRegister(trainingId: string): void {
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isRegistered(trainingId)) return;

    this.evaluationService.registerUser(trainingId, this.userId).subscribe({
      next: () => {
        this.loadEvaluations();
      },
      error: (err) => {
        console.error('Registration error:', err);
      }
    });
  }

  openNoteModal(trainingId: string): void {
    const selectedTraining = this.detailsPrésentiel.find(detail => detail._id === trainingId);
    if (selectedTraining && selectedTraining.etat === 'Terminé') {
      this.selectedTrainingId = trainingId;
      this.resetNoteForm();
      this.showNoteModal = true;
    }
  }

  closeNoteModal(): void {
    this.showNoteModal = false;
    this.selectedTrainingId = null;
  }

  resetNoteForm(): void {
    this.noteData = {
      note1: null,
      note2: null,
      note3: null,
      note4: null,
      commentaire: ''
    };
  }

  submitNote(): void {
    if (this.selectedTrainingId) {
      if (this.noteData.note1 === null || this.noteData.note2 === null || this.noteData.note3 === null || this.noteData.note4 === null) {
        alert('Veuillez remplir toutes les évaluations.');
        return;
      }
  
      // Calculate the total score and store it in totalSomme
      this.totalSomme = Number(this.noteData.note1 ?? 0) + Number(this.noteData.note2 ?? 0) + Number(this.noteData.note3 ?? 0) + Number(this.noteData.note4 ?? 0);
  
      const evaluation = this.evaluations.find(e => e.training._id === this.selectedTrainingId && e.user._id === this.userId);
      if (!evaluation) {
        console.error('Evaluation not found');
        return;
      }
  
      const updatedEvaluation = {
        note: this.totalSomme,
        comment: this.noteData.commentaire // Include the comment
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

  closeSuccessToast(): void {
    this.showSuccessToast = false;
  }

  navigateToFormationDetail(formationId: string): void {
    this.router.navigate(['/nosformation/formation', formationId]);
  }
}