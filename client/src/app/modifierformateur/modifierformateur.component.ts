import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../services/formation.service';
import { FormateurService } from '../services/formateur.service';
import { FormationDetails, Formateur } from '../services/formation-details';

@Component({
  selector: 'app-modifierformateur',
  templateUrl: './modifierformateur.component.html',
  styleUrls: ['./modifierformateur.component.css']
})
export class ModifierformateurComponent implements OnInit {
  formateurForm: FormGroup;
  formateurId!: string;
  formateur: Formateur | undefined;

  showModal: boolean = false;
  modalMessage: string = '';
  modalType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private formateurService: FormateurService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.formateurForm = this.fb.group({
      nom_et_prenom: ['', Validators.required],
      nom_et_prenom_arab: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      specialite: ['', Validators.required],
      experience: ['', Validators.required],
      formateur_disponible: [false],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.formateurId = this.route.snapshot.paramMap.get('id')!;
    this.getFormateurDetails();
  }

  getFormateurDetails(): void {
    this.formateurService.getFormateurById(this.formateurId).subscribe(
      (formateur: Formateur) => {
        this.formateur = formateur;
        this.formateurForm.patchValue({
          nom_et_prenom: formateur.nom_et_prenom,
          nom_et_prenom_arab: formateur.nom_et_prenom_arab,
          email: formateur.email,
          phoneNumber: formateur.phoneNumber,
          specialite: formateur.specialite,
          experience: formateur.experience,
          formateur_disponible: formateur.formateur_disponible,
          status: formateur.status
        });
      },
      (error) => {
        console.error('Error fetching formateur details:', error);
        this.showAlert('Erreur lors du chargement des détails du formateur', 'error');
      }
    );
  }

  onSubmit(): void {
    if (this.formateurForm.valid) {
      this.formateurService.updateFormateur(this.formateurId, this.formateurForm.value).subscribe(
        () => {
          this.showAlert('Formateur mis à jour avec succès!', 'success');
          setTimeout(() => {
            this.router.navigate(['/gestionformateur/afficherformateur']);
          }, 1500);
        },
        (error) => {
          console.error('Error updating formateur:', error);
          this.showAlert('Erreur lors de la mise à jour du formateur: ' + (error.error?.message || 'Unknown error'), 'error');
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