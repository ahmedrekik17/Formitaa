import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Userinfo } from '../services/userinfo';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    alertMessage: string = '';
    alertType: 'success' | 'error' | 'warning' = 'success';
    showAlert: boolean = false;
    loading = false;

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
         this.authService.login(this.email, this.password).subscribe({
            next: () => { // response is not needed
                this.showAlertMessage('✅ Connexion réussie !', 'success');
                 this.authService.getLoggedInUser().subscribe({
                    next: (decodedToken:Userinfo | null) => {
                      console.log(decodedToken);
                      
                        if (decodedToken && decodedToken.role === 'admin') {
                            localStorage.setItem('isLoggedIn', 'true'); // ✅ set login flag
                                this.router.navigate(['/dashboard']);
                            } else if (decodedToken) {
                                localStorage.setItem('isLoggedIn', 'true'); // ✅ set login flag
                                this.router.navigate(['/accueil']);
                            } else {
                                 this.showAlertMessage('❌ User role not found.', 'error');
                            }
                     },
                     error: (error) => {
                         console.error(error)
                         this.showAlertMessage('❌ Problème lors de la connexion.', 'error');
                     }
                })
            },
            error: () => {
                this.showAlertMessage('❌ Erreur de connexion. Vérifiez vos identifiants.', 'error');
            }
        });
    }
}