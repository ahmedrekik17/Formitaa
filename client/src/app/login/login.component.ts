import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Userinfo } from '../services/userinfo';
import { finalize, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  
  // State management for UI
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'warning' = 'success';
  loading = false; // To disable button and show spinner

  constructor(private router: Router, private authService: AuthService) { }

  showAlertMessage(message: string, type: 'success' | 'error' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
  }

  login() {
    if (!this.email || !this.password) {
      this.showAlertMessage('⚠️ Veuillez entrer votre email et mot de passe.', 'warning');
      return;
    }

    this.loading = true; // Start loading
    this.showAlert = false; // Hide previous alerts

    this.authService.login(this.email, this.password).pipe(
      // Use switchMap to chain observables instead of nesting subscribe
      switchMap(() => {
        // After successful login, get the user info
        return this.authService.getLoggedInUser();
      }),
      // finalize is guaranteed to run on completion or error
      finalize(() => {
        this.loading = false; // Stop loading
      })
    ).subscribe({
      next: (decodedToken: Userinfo | null) => {
        if (!decodedToken) {
          this.showAlertMessage('❌ Erreur: Impossible de vérifier les informations utilisateur.', 'error');
          return;
        }

        // Set login flag and navigate based on role
        localStorage.setItem('isLoggedIn', 'true'); 
        
        if (decodedToken.role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/accueil']);
        }
      },
      error: (err) => {
        // This will catch errors from BOTH login() and getLoggedInUser()
        console.error("Login failed:", err);
        this.showAlertMessage('❌ Erreur de connexion. Vérifiez vos identifiants.', 'error');
      }
    });
  }

  showPassword: boolean = false;
    togglePasswordVisibility() {

        this.showPassword = !this.showPassword;
    }
}