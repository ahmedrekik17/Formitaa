import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormateurService } from '../services/formateur.service';

@Component({
  selector: 'app-ajouterformateur',
  templateUrl: './ajouterformateur.component.html',
  styleUrls: ['./ajouterformateur.component.css']
})
export class AjouterformateurComponent implements OnInit {

  formateurForm: FormGroup;

  // Modal control variables
  showModal: boolean = false;
  modalMessage: string = '';
  modalType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private formateurService: FormateurService,
  ) {
    this.formateurForm = this.fb.group({
      nom_et_prenom: ['', Validators.required],
      nom_et_prenom_arab: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      specialite: ['', Validators.required],
      experience: ['', Validators.required],
      formateur_disponible: [true], // Set to true and hidden
      status: ['actif'] // Default to 'actif' and hidden
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.formateurForm.valid) {
      this.formateurService.createFormateur(this.formateurForm.value).subscribe(
        response => {
          this.showAlert('Formateur créé avec succès', 'success');
          this.resetForm();

        },
        error => {
          console.error('Error creating formateur:', error);
          this.showAlert('Erreur lors de la création du formateur: ' + (error.error?.message || 'Erreur inconnue'), 'error');
        }
      );
    } else {
      this.showAlert('Veuillez remplir tous les champs obligatoires.', 'warning');
    }
  }

  resetForm(): void {
    this.formateurForm.reset();
    this.formateurForm.setValue({
      nom_et_prenom: '',
      nom_et_prenom_arab: '',
      email: '',
      phoneNumber: '',
      specialite: '',
      experience: '',
      formateur_disponible: true,
      status: 'actif'
    });
    this.formateurForm.markAsPristine();
    this.formateurForm.markAsUntouched();
  }

  // Function to show the modal message
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