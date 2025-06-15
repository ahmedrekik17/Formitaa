import { Component, OnInit } from '@angular/core';
import { FormationService } from '../services/formation.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-gestionformaion',
    templateUrl: './gestionformaion.component.html',
    styleUrls: ['./gestionformaion.component.css']
})
export class GestionformaionComponent implements OnInit {
    trainings: any[] = [];
    filteredTrainings: any[] = [];
    paginatedTrainings: any[] = [];

    currentPage: number = 1;
    itemsPerPage: number = 8;
    pageNumbers: number[] = [];
    keyword: string = '';
    private searchTerms = new Subject<string>();
    modeFormationFilter: string='';

    modalMessage: string = '';
    modalType: 'success' | 'error' | 'warning' = 'success';
    showModal: boolean = false;
    showConfirmationModal: boolean = false;
    trainingToDeleteId: string | null = null;
    confirmationMessage: string = 'Êtes-vous sûr de vouloir supprimer cette formation ?';  // French

    constructor(private trainingService: FormationService) { }

    ngOnInit(): void {
        this.fetchTrainings();

        this.searchTerms.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(keyword => {
            this.keyword = keyword.trim();
            this.filterTrainings();
            this.currentPage = 1;
            this.updatePageTrainings();
        });
    }



    fetchTrainings(): void {
        this.trainingService.getTrainings().subscribe(trainings => {
            // Sort trainings by creation timestamp in descending order (newest first)
            this.trainings = trainings.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            this.filteredTrainings = [...this.trainings];
            this.calculatePagination();
            this.updatePageTrainings();
        });
    }
    filterTrainings(): void {
        if (!this.keyword) {
            this.filteredTrainings = [...this.trainings];
        } else {
            this.filteredTrainings = this.trainings.filter(training =>
                training.n_action.toLowerCase().includes(this.keyword.toLowerCase())
            );
        }
        if(this.modeFormationFilter){
            this.filteredTrainings=this.filteredTrainings.filter(training => training.mode_formation===this.modeFormationFilter)
        }
        this.calculatePagination();
        this.updatePageTrainings();
    }

    calculatePagination(): void {
        const totalPages = Math.ceil(this.filteredTrainings.length / this.itemsPerPage);
        this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    updatePageTrainings(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedTrainings = this.filteredTrainings.slice(startIndex, endIndex);
    }

    onSearchChange(): void {
        this.searchTerms.next(this.keyword);
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.pageNumbers.length) {
            this.currentPage = page;
            this.updatePageTrainings();
        }
    }

    confirmDeleteTraining(trainingId: string) {
        this.trainingToDeleteId = trainingId;
        this.showConfirmationModal = true;
    }

    onDeleteConfirmed(confirmed: boolean) {
        this.showConfirmationModal = false;
        if (confirmed && this.trainingToDeleteId) {
            this.trainingService.deleteTraining(this.trainingToDeleteId).subscribe(
                () => {
                    this.showAlert('Formation supprimée avec succès', 'success'); // French
                    this.trainingToDeleteId = null
                    this.fetchTrainings();
                },
                (error) => {
                    console.error('Error deleting training:', error);
                    this.showAlert('Échec de la suppression de la formation : ' + (error.error?.message || 'Unknown error'), 'error'); // French
                }
            );
        }
        this.trainingToDeleteId = null; // Reset trainingToDeleteId whether confirmed or not
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