// src/app/components/formation-card.component.ts

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
    ]),
    // Animation for the modal and toast
    trigger('fadeInOut', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('200ms ease-out', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            animate('200ms ease-in', style({ opacity: 0 }))
        ])
    ])
  ]
})
export class FormationCardComponent implements OnInit {
  @Input() filterMode: string = 'Nos Formations';

  detailsPrésentiel: any[] = [];
  detailsEnLigne: any[] = [];
  evaluations: any[] = [];
  userId: string | null = null;
  selectedTrainingId: string | null = null;

  // --- State for the "Noter" Modal ---
  showNoteModal: boolean = false;
  noteData = {
    note1: null as number | null,
    note2: null as number | null,
    note3: null as number | null,
    note4: null as number | null,
    commentaire: ''
  };
  totalSomme: number = 0;

  // --- State for the NEW Guest Registration Modal ---
  showGuestModal: boolean = false;
  guestTrainingId: string | null = null;
  guestData = { name: '', email: '' };
  guestFormError: string | null = null;
  isSubmittingGuest: boolean = false;

  // --- State for the NEW Toast Notification ---
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';


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

  get filteredDetails() {
    if (this.filterMode === 'Présentiel') return this.detailsPrésentiel;
    if (this.filterMode === 'En ligne') return this.detailsEnLigne;
    return [];
  }

  private loadTrainings(): void {
    this.formationService.getFilteredTrainings().subscribe((data) => {
      const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    if (!this.userId) return false;
    return [...this.evaluations].some(evaluation => evaluation.training._id === trainingId && evaluation.user._id === this.userId);
  }

  /**
   * MODIFIED: Handles registration for both logged-in users and guests.
   */
  onRegister(trainingId: string): void {
    // Case 1: User is logged in
    if (this.userId) {
      if (this.isRegistered(trainingId)) return;
      this.evaluationService.registerUser(trainingId, this.userId).subscribe({
        next: () => {
          this.showNotification('Inscription réussie ! Vous êtes maintenant inscrit.', 'success');
          this.loadEvaluations();
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.showNotification('Échec: Une erreur est survenue.', 'error');
        }
      });
    } else {
      // Case 2: User is a guest -> Open our custom modal
      this.openGuestModal(trainingId);
    }
  }

  // --- Methods for Guest Registration Modal ---

  openGuestModal(trainingId: string): void {
    this.guestTrainingId = trainingId;
    this.showGuestModal = true;
  }

  closeGuestModal(): void {
    this.showGuestModal = false;
    this.guestTrainingId = null;
    this.guestData = { name: '', email: '' }; // Reset form
    this.guestFormError = null; // Reset error
    this.isSubmittingGuest = false;
  }

  submitGuestRegistration(): void {
    // Basic Validation
    if (!this.guestData.name.trim() || !this.guestData.email.trim()) {
      this.guestFormError = 'Le nom et l\'email sont requis.';
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(this.guestData.email)) {
        this.guestFormError = "Veuillez entrer une adresse email valide.";
        return;
    }
    
    this.guestFormError = null;
    this.isSubmittingGuest = true;

    if (this.guestTrainingId) {
      this.evaluationService.registerGuest(this.guestTrainingId, this.guestData.name, this.guestData.email).subscribe({
        next: () => {
          this.showNotification('Inscription réussie ! Nous vous contacterons bientôt.', 'success');
          this.closeGuestModal();
        },
        error: (err) => {
          // Display specific error from backend if available (e.g., 409 Conflict)
          const message = err.error?.message || 'Une erreur est survenue lors de l\'inscription.';
          this.showNotification(message, 'error');
          this.isSubmittingGuest = false; // Allow user to try again
        }
      });
    }
  }

  // --- Methods for Toast Notification ---

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Hide the toast after 3 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // --- Methods for the existing "Noter" Modal ---

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
    this.noteData = { note1: null, note2: null, note3: null, note4: null, commentaire: '' };
  }

  submitNote(): void {
    if (!this.selectedTrainingId) return;

    if (this.noteData.note1 === null || this.noteData.note2 === null || this.noteData.note3 === null || this.noteData.note4 === null) {
      this.showNotification('Veuillez remplir toutes les évaluations.', 'error');
      return;
    }

    this.totalSomme = Number(this.noteData.note1 ?? 0) + Number(this.noteData.note2 ?? 0) + Number(this.noteData.note3 ?? 0) + Number(this.noteData.note4 ?? 0);
    const evaluation = this.evaluations.find(e => e.training._id === this.selectedTrainingId && e.user._id === this.userId);
    if (!evaluation) {
      console.error('Evaluation not found');
      return;
    }

    const updatedEvaluation = { note: this.totalSomme, comment: this.noteData.commentaire };

    this.evaluationService.updateEvaluation(this.selectedTrainingId, evaluation._id, updatedEvaluation).subscribe({
      next: () => {
        this.showNotification("Évaluation soumise avec succès !", 'success');
        this.closeNoteModal();
        this.loadEvaluations();
      },
      error: (error) => {
        this.showNotification("Erreur lors de la soumission.", 'error');
        console.error('Error updating evaluation:', error);
      }
    });
  }

  navigateToFormationDetail(formationId: string): void {
    this.router.navigate(['/nosformation/formation', formationId]);
  }
}