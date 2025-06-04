import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormationService } from '../services/formation.service';
import { FormateurService } from '../services/formateur.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Formateur } from '../services/formation-details';

@Component({
    selector: 'app-ajouterformation',
    templateUrl: './ajouterformation.component.html',
    styleUrls: ['./ajouterformation.component.css']
})
export class AjouterformationComponent implements OnInit {
    trainings: any[] = [];
    trainingForm: FormGroup;
    selectedFile: File | null = null;
    formateurs: Formateur[] = [];
    filteredFormateurs: Formateur[] = [];

    // Modal control variables
    showModal: boolean = false;
    modalMessage: string = '';
    modalType: 'success' | 'error' | 'warning' = 'success';

    constructor(
        private fb: FormBuilder,
        private formationService: FormationService,
        private formateurService: FormateurService,
        private http: HttpClient
    ) {
        this.trainingForm = this.fb.group({
            n_action: ['', Validators.required],
            theme_formation: ['', Validators.required],
            loi_des_finances: ['', Validators.required],
            lieu_de_deroulement: ['', Validators.required],
            date_debut: ['', Validators.required], // Changed
            date_fin: ['', Validators.required],   // Added
            credit_impot: [false, Validators.required],
            mode_formation: ['', Validators.required],
            droits_de_tirage_individuel: [false, Validators.required],
            droits_de_tirage_collectif: [false, Validators.required],
            num_salle: ['', Validators.required],
            etat: ['Annoncé', Validators.required],
            pause: ['', Validators.required],
            horaire_debut: ['', Validators.required], // Changed
            horaire_fin: ['', Validators.required],   // Added
            formateurName: ['', Validators.required],
            formateurId: ['', Validators.required],
            image: [null]
        });
    }

    ngOnInit(): void {
        this.formateurService.getFormateurs().subscribe(formateurs => {
            this.formateurs = formateurs;
        });

        this.formationService.getTrainings().subscribe(trainings => {
            this.trainings = trainings;
        });
    }

    searchFormateur(event: Event): void {
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
            formateurName: formateur.nom_et_prenom,
            formateurId: formateur._id
        });
        this.filteredFormateurs = [];
    }

    onSubmit(): void {
        if (this.trainingForm.valid) {
            const formData = new FormData();
            let formateurId = null;

            const formateur = this.formateurs.find(f => f.nom_et_prenom === this.trainingForm.get('formateurName')?.value);
            if (formateur) {
                formateurId = formateur._id;
                formData.append('formateurId', formateurId);
            } else if (this.trainingForm.get('formateurName')?.value){
               this.showAlert('Invalid Formateur', 'error');
               return;
             }


            // Append form values except image
            Object.keys(this.trainingForm.controls).forEach(key => {
                if (key !== 'image' && key !== 'formateurName' && key !== 'formateurId') {
                    formData.append(key, this.trainingForm.get(key)?.value);
                }
            });


            // Append file separately
            if (this.selectedFile) {
                formData.append('image', this.selectedFile, this.selectedFile.name);
            }

            // Send the data to the backend using HttpClient
            this.formationService.createTraining(formData).subscribe(
                response => {
                    // Show success message
                    this.showAlert('Training created successfully', 'success');
                    this.trainings.push(response.training);

                    // Reset the form properly
                    this.trainingForm.reset();
                    this.trainingForm.setValue({
                        n_action: '',
                        theme_formation: '',
                        loi_des_finances: '',
                        lieu_de_deroulement: '',
                        date_debut: '', // Changed
                        date_fin: '',   // Added
                        credit_impot: false,
                        mode_formation: '',
                        droits_de_tirage_individuel: false,
                        droits_de_tirage_collectif: false,
                        num_salle: '',
                        etat: 'Annoncé',
                        pause: '',
                        horaire_debut: '', // Changed
                        horaire_fin: '',   // Added
                        formateurName: '',
                        formateurId: '',
                        image: null
                    });
                    this.trainingForm.markAsPristine();
                    this.trainingForm.markAsUntouched();
                    this.selectedFile = null;

                    // Clear file input manually
                    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                    if (fileInput) {
                        fileInput.value = '';
                    }
                },
                error => {
                    this.showAlert('Error creating training: ' + (error.error?.message || 'Unknown error'), 'error');
                }
            );
        } else {
            this.showAlert('Please fill out all required fields.', 'warning');
        }
    }

    triggerFileInput(): void {
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        fileInput?.click();
    }

    onFileChange(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;  // Store the selected file
        }
    }

    // Function to show the modal message
    showAlert(message: string, type: 'success' | 'error' | 'warning') {
        this.modalMessage = message;
        this.modalType = type;
        this.showModal = true;
        setTimeout(
            () => {
                this.showModal = false;
            }, 1000);
    }

    isSidebarOpen: boolean = false; // Add this line to your component
    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
    closeSideBar(): void {
        this.isSidebarOpen = false;
    }
}