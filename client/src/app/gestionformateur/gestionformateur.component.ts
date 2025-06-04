import { Component, OnInit } from '@angular/core';
import { FormateurService } from '../services/formateur.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Formateur } from '../services/formation-details';

@Component({
    selector: 'app-gestionformateur',
    templateUrl: './gestionformateur.component.html',
    styleUrls: ['./gestionformateur.component.css']
})
export class GestionformateurComponent implements OnInit {

    formateurs: Formateur[] = [];
    filteredFormateurs: Formateur[] = [];
    paginatedFormateurs: Formateur[] = [];

    currentPage: number = 1;
    itemsPerPage: number = 8;
    pageNumbers: number[] = [];
    keyword: string = '';
    private searchTerms = new Subject<string>();
    disponibiliteFilter: string = ''; // '' means no filter
    statusFilter: string = '';

    modalMessage: string = '';
    modalType: 'success' | 'error' | 'warning' = 'success';
    showModal: boolean = false;
    showConfirmationModal: boolean = false;
    formateurToDeleteId: string | null = null;
    confirmationMessage: string = 'Êtes-vous sûr de vouloir supprimer ce formateur ?';

    selectedFormateur: Formateur | null = null; // To hold selected formateur

    constructor(private formateurService: FormateurService) { }

    ngOnInit(): void {
        this.fetchFormateurs();

        this.searchTerms.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(keyword => {
            this.keyword = keyword.trim();
            this.applyFilters(); // Call applyFilters instead of filterFormateurs directly
            this.currentPage = 1;
            this.updatePageFormateurs();
        });
    }

    fetchFormateurs(): void {
        this.formateurService.getFormateurs().subscribe(formateurs => {
            // Sort formateurs by creation timestamp in descending order (newest first)
            this.formateurs = formateurs.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            this.filteredFormateurs = [...this.formateurs];
            this.applyFilters();
            this.calculatePagination();
            this.updatePageFormateurs();
        });
    }


    applyFilters(): void {
        let filteredFormateurs = [...this.formateurs]; // Start with a copy of all formateurs

        // Filter by search keyword
        if (this.keyword) {
            filteredFormateurs = filteredFormateurs.filter(formateur =>
                formateur.nom_et_prenom.toLowerCase().includes(this.keyword.toLowerCase()) ||
                formateur.email.toLowerCase().includes(this.keyword.toLowerCase())
            );
        }

        // Filter by disponibilite
        if (this.disponibiliteFilter !== '') {
            const dispoValue = this.disponibiliteFilter === 'true';  // Convert string to boolean
            filteredFormateurs = filteredFormateurs.filter(formateur => formateur.formateur_disponible === dispoValue);
        }

        // Filter by status
        if (this.statusFilter) {
            filteredFormateurs = filteredFormateurs.filter(formateur => formateur.status === this.statusFilter);
        }

        this.filteredFormateurs = filteredFormateurs;
        this.calculatePagination();
        this.currentPage = 1;
        this.updatePageFormateurs();
    }

    calculatePagination(): void {
        const totalPages = Math.ceil(this.filteredFormateurs.length / this.itemsPerPage);
        this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    updatePageFormateurs(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedFormateurs = this.filteredFormateurs.slice(startIndex, endIndex);
    }

    onSearchChange(): void {
        this.searchTerms.next(this.keyword);
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.pageNumbers.length) {
            this.currentPage = page;
            this.updatePageFormateurs();
        }
    }

    confirmDeleteFormateur(formateurId: string) {
        this.formateurToDeleteId = formateurId;
        this.showConfirmationModal = true;
    }

    onDeleteConfirmed(confirmed: boolean) {
        this.showConfirmationModal = false;
        if (confirmed && this.formateurToDeleteId) {
            this.formateurService.deleteFormateur(this.formateurToDeleteId).subscribe(
                () => {
                    this.showAlert('Formateur supprimé avec succès', 'success');
                    this.formateurToDeleteId = null
                    this.fetchFormateurs();
                },
                (error) => {
                    console.error('Error deleting formateur:', error);
                    this.showAlert('Échec de la suppression du formateur : ' + (error.error?.message || 'Unknown error'), 'error');
                }
            );
        }
        this.formateurToDeleteId = null; // Reset formateurToDeleteId whether confirmed or not
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

    showFormateurDetails(formateur: Formateur) {
        this.selectedFormateur = formateur;
    }

    isSidebarOpen: boolean = false; // Add this line to your component
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSideBar(): void{
      this.isSidebarOpen = false;
  }
}