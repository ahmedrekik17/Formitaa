import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Userinfo } from '../services/userinfo';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

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
