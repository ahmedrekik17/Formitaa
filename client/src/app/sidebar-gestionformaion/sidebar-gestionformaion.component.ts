import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Userinfo } from '../services/userinfo';

@Component({
  selector: 'app-sidebar-gestionformaion',
  templateUrl: './sidebar-gestionformaion.component.html',
  styleUrls: ['./sidebar-gestionformaion.component.css']
})
export class SidebarGestionformaionComponent {
  @Output() closeSidebar = new EventEmitter<void>(); // Output event

  onCloseSidebar() {
    this.closeSidebar.emit(); // Emit event when close button is clicked
  }

  public user: Userinfo | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe(
      (user: Userinfo | null) => {
        if (user) {
          this.user = user;
        }
      },
      (error) => {
        console.error('Error fetching logged-in user:', error);
      }
    );
  }
  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        localStorage.removeItem('auth_token');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error("Logout failed:", error);
        const errorMessage = error.status === 400
          ? '❌ Échec de la déconnexion. Token introuvable.'
          : '❌ Une erreur est survenue lors de la déconnexion.';
      }
    });
  }
}
