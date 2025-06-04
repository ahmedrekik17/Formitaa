import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../services/formation.service';
import { FormateurService } from '../services/formateur.service';
import { Formateur, FormationDetails } from '../services/formation-details';

@Component({
    selector: 'app-modifierformation',
    templateUrl: './modifierformation.component.html',
    styleUrls: ['./modifierformation.component.css']
})
export class ModifierFormationComponent implements OnInit {
    trainingForm: FormGroup;
    formationId!: string;
    isFormateursLoading: boolean = false;
    formateurs: Formateur[] = [];
    filteredFormateurs: Formateur[] = [];
    showModal: boolean = false;
    modalMessage: string = '';
    modalType: 'success' | 'error' | 'warning' = 'success';

    constructor(
        private fb: FormBuilder,
        private formationService: FormationService,
        private formateurService: FormateurService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.trainingForm = this.fb.group({
            n_action: ['', Validators.required],
            theme_formation: ['', Validators.required],
            loi_des_finances: ['', Validators.required],
            lieu_de_deroulement: ['', Validators.required],
            formateurName: ['', Validators.required],
            etat: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.formationId = this.route.snapshot.paramMap.get('id')!;
        this.getFormationDetails();
        this.formateurService.getFormateurs().subscribe(formateurs => {
            this.formateurs = formateurs;
          });
    }

    searchFormateur(event: Event): void{
        const searchText = (event.target as HTMLInputElement).value;
         if (!searchText.trim()) {
           this.filteredFormateurs = [];
           return;
        }
  
        this.filteredFormateurs = this.formateurs.filter(formateur =>
              formateur.nom_et_prenom.toLowerCase().includes(searchText.toLowerCase())
          );
  
      }
        selectFormateur(formateur: Formateur) {
        this.trainingForm.patchValue({
            formateurName: formateur.nom_et_prenom
        });
           this.filteredFormateurs = [];
        }

    getFormationDetails() {
        this.formationService.getTrainingById(this.formationId).subscribe(
            (formation: FormationDetails) => {
                this.isFormateursLoading = true;
                this.trainingForm.patchValue({
                    n_action: formation.n_action,
                    theme_formation: formation.theme_formation,
                    loi_des_finances: formation.loi_des_finances,
                    lieu_de_deroulement: formation.lieu_de_deroulement,
                    formateurName: formation.formateur?.nom_et_prenom || '',
                    etat: formation.etat,
                });
                this.isFormateursLoading = false;
            },
            (error) => {
                this.showAlert('Erreur lors du chargement des détails de la formation', 'error');
                this.isFormateursLoading = false;
            }
        );
    }

    onSubmit(): void {
        if (this.trainingForm.valid) {
            this.formationService.updateTraining(this.formationId, this.trainingForm.value).subscribe(
                () => {
                    this.showAlert('Formation mise à jour avec succès!', 'success');

                    setTimeout(() => {
                        this.router.navigate(['/gestionformation/afficherformation']);
                    }, 1500);
                },
                (error) => {
                   let errorMessage = 'Erreur lors de la mise à jour de la formation : ';
                    if (error?.error?.message?.includes('E11000 duplicate key error')) {
                        errorMessage = `N° action déja utilisé`;
                    } else {
                        errorMessage = (error.error?.message || 'Erreur inconnue');
                    }
                    this.showAlert(errorMessage, 'error');
                 }
            );
        } else {
            this.showAlert('Veuillez remplir tous les champs obligatoires.', 'warning');
        }
    }

   showAlert(message: string, type: 'success' | 'error' | 'warning') {
        this.modalMessage = message;
        this.modalType = type;
        this.showModal = true;
        setTimeout(() => {
            this.showModal = false;
        }, 1500);
    }
    isSidebarOpen: boolean = false; // Add this line to your component
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSideBar(): void{
      this.isSidebarOpen = false;
  }

  
}