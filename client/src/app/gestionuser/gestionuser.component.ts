import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Userinfos } from '../services/userinfo';

@Component({
  selector: 'app-gestionuser',
  templateUrl: './gestionuser.component.html',
  styleUrls: ['./gestionuser.component.css']
})
export class GestionuserComponent implements OnInit {

  users: Userinfos[] = [];
  filteredUsers: Userinfos[] = [];
  keyword: string = '';
  roleFilter: string = '';
  statusFilter: string = '';
  selectedUser: Userinfos | null = null;

  // Modal properties
  showModal: boolean = false;
  modalMessage: string = '';
  modalType: 'success' | 'error' = 'success';

  // Confirmation Modal properties
  showConfirmationModal: boolean = false;
  confirmationMessage: string = '';
  userIdToDelete: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 8;
  pageNumbers: number[] = [];
  totalFormateurs: number = 0;
  paginatedUsers: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: Userinfos[]) => {
        // Sort users by createdAt in descending order (newest first)
        this.users = data.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.filteredUsers = [...this.users];
        this.applyFilters();
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.showModalMessage('Impossible de charger les utilisateurs.', 'error');
      }
    );
  }

  applyFilters() {
    this.filteredUsers = [...this.users];
    if (this.keyword) {
      const searchTerm = this.keyword.toLowerCase();
      this.filteredUsers = this.filteredUsers.filter(user =>
        user.nom_et_prenom.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    if (this.roleFilter) {
      this.filteredUsers = this.filteredUsers.filter(user => user.role === this.roleFilter);
    }

    this.updatePagination();
  }

  onSearchChange() {
    this.applyFilters();
  }

  updatePagination() {
    this.totalFormateurs = this.filteredUsers.length;
    const totalPages = Math.ceil(this.totalFormateurs / this.pageSize);
    this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    this.goToPage(1);
  }

  goToPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.pageNumbers.length) {
      return;
    }
    this.currentPage = pageNumber;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  showUserDetails(user: Userinfos): void {
    this.selectedUser = user;
  }


  confirmDeleteUser(userId: string): void {
    this.userIdToDelete = userId;
    this.confirmationMessage = 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?';
    this.showConfirmationModal = true;
  }

  onDeleteConfirmed(confirmed: boolean): void {
    this.showConfirmationModal = false;
    if (confirmed && this.userIdToDelete) {
      this.userService.deleteUser(this.userIdToDelete).subscribe(
        () => {
          this.showModalMessage('Utilisateur supprimé avec succès.', 'success');
          this.userIdToDelete = null;
          this.loadUsers();
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.showModalMessage("Impossible de supprimer l'utilisateur.", 'error');
        }
      );
    }
    this.userIdToDelete = null;
  }

  private showModalMessage(message: string, type: 'success' | 'error'): void {
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