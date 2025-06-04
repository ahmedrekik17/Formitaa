import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  formRegister!: FormGroup;

  // 🔔 Alert State
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'warning' = 'success';
  showAlert: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private route: Router) {}

  ngOnInit() {
    this.formRegister = this.fb.group({
      nom_et_prenom: this.fb.control('', Validators.required),
      nom_et_prenom_arab: this.fb.control('', Validators.required),
      cin:this.fb.control('',Validators.required),
      email: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required),
      confirmPassword: this.fb.control('', Validators.required),
      phoneNumber: this.fb.control('', Validators.required),
      ville: this.fb.control('', Validators.required),
      date_naissance: this.fb.control('', Validators.required),
    });
  }

  // 🛑 Show Alert
  showAlertMessage(message: string, type: 'success' | 'error' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;


  }

  handleRegister() {
    const user = this.formRegister.value;
  
    // Check if the form is valid
    if (!this.formRegister.valid) {
      this.showAlertMessage("⚠️ Veuillez remplir tous les champs requis.", 'warning');
      return;
    }
  
    // Check if passwords match
    if (user.password !== user.confirmPassword) {
      this.showAlertMessage("⚠️ Les mots de passe ne correspondent pas.", 'warning');
      return;
    }
  
    const userInfo = {
      nom_et_prenom: user.nom_et_prenom,
      nom_et_prenom_arab: user.nom_et_prenom_arab,
      cin:user.cin,
      email: user.email,
      password: user.password,
      phoneNumber: user.phoneNumber,
      ville: user.ville,
      date_naissance: user.date_naissance,
    };
  
    this.authService.register(userInfo).subscribe({
      next: () => {
        this.showAlertMessage("✅ Inscription réussie !", 'success');
        setTimeout(() => {
          this.route.navigateByUrl("/login");
        }, 500);
      },
      error: (err) => {
        const errorMessages = err.error.message || "Registration failed.";
        let specificError = '';
  
        if (errorMessages.includes('nom_et_prenom_arab')) {
          specificError += 'Arabic name is required. ';
        }
        if (errorMessages.includes('email')) {
          specificError += 'Email is required. ';
        }
        if (errorMessages.includes('ville')) {
          specificError += 'City is required. ';
        }
        if (errorMessages.includes('date_naissance')) {
          specificError += 'Birth date is required. ';
        }
  
        // Display custom error message
        if (specificError) {
          this.showAlertMessage(specificError.trim(), 'error');
        } else {
          this.showAlertMessage('Registration failed. Please check your inputs.', 'error');
        }
      }
    });
  }
  
}