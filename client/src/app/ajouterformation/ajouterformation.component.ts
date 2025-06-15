    import { Component, OnInit } from '@angular/core';
    import { FormGroup, FormBuilder, Validators } from '@angular/forms';
    import { FormationService } from '../services/formation.service';
    import { FormateurService } from '../services/formateur.service';
    import { HttpClient } from '@angular/common/http';
    import { Formateur } from '../services/formation-details';

    @Component({
        selector: 'app-ajouterformation',
        templateUrl: './ajouterformation.component.html',
        styleUrls: ['./ajouterformation.component.css']
    })
    export class AjouterformationComponent implements OnInit {
        trainings: any[] = [];
        trainingForm: FormGroup;
        selectedImageFile: File | null = null;
        selectedVideoFiles: File[] = [];

        formateurs: Formateur[] = [];
        filteredFormateurs: Formateur[] = [];

        showModal: boolean = false;
        modalMessage: string = '';
        modalType: 'success' | 'error' | 'warning' = 'success';
        selectedMode: string = 'Présentiel'; // default mode


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
                date_debut: ['', Validators.required],
                date_fin: ['', Validators.required],
                credit_impot: [false, Validators.required],
                mode_formation: [this.selectedMode, Validators.required],
                droits_de_tirage_individuel: [false, Validators.required],
                droits_de_tirage_collectif: [false, Validators.required],
                num_salle: [''],
                etat: ['Annoncé', Validators.required],
                pause: [''],
                horaire_debut: [''],
                horaire_fin: [''],
                formateurName: ['', Validators.required],
                formateurId: ['', Validators.required],
                image: [null],
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

        setModeFormation(mode: string) {
            this.selectedMode = mode;
            this.trainingForm.controls['mode_formation'].setValue(mode);
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
                } else if (this.trainingForm.get('formateurName')?.value) {
                    this.showAlert('Invalid Formateur', 'error');
                    return;
                }

                Object.keys(this.trainingForm.controls).forEach(key => {
                    if (key !== 'image' && key !== 'videos' && key !== 'formateurName' && key !== 'formateurId') {
                        formData.append(key, this.trainingForm.get(key)?.value);
                    }
                });

                if (this.selectedImageFile) {
                    formData.append('image', this.selectedImageFile, this.selectedImageFile.name);
                }


                this.formationService.createTraining(formData).subscribe(
                    response => {
                        this.showAlert('Training created successfully', 'success');
                        this.trainings.push(response.training);
                        this.trainingForm.reset();
                        this.trainingForm.setValue({
                            n_action: '',
                            theme_formation: '',
                            loi_des_finances: '',
                            lieu_de_deroulement: '',
                            date_debut: '',
                            date_fin: '',
                            credit_impot: false,
                            mode_formation: this.selectedMode,
                            droits_de_tirage_individuel: false,
                            droits_de_tirage_collectif: false,
                            num_salle: '',
                            etat: 'Annoncé',
                            pause: '',
                            horaire_debut: '',
                            horaire_fin: '',
                            formateurName: '',
                            formateurId: '',
                            image: null,
                        });
                        this.trainingForm.markAsPristine();
                        this.trainingForm.markAsUntouched();
                        this.selectedImageFile = null;

                        const imageInput = document.getElementById('image-upload') as HTMLInputElement;
                        if (imageInput) imageInput.value = '';
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
                this.selectedImageFile = file;
            }
        }



        showAlert(message: string, type: 'success' | 'error' | 'warning') {
            this.modalMessage = message;
            this.modalType = type;
            this.showModal = true;
            setTimeout(() => {
                this.showModal = false;
            }, 1000);
        }

        isSidebarOpen: boolean = false;
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        }
        closeSideBar(): void {
            this.isSidebarOpen = false;
        }
    }
