import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  formRegister!: FormGroup;

  // Alert State
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'warning' = 'success';
  showAlert: boolean = false;

  // Progress State
  progressPercentage: number = 0;

  // NEW: Property to track the current step for the segmented progress bar
  currentStep: number = 1;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router
  ) {}

  ngOnInit() {
    this.formRegister = this.fb.group({
      // Group 1: Account
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      // Group 2: Personal
      nom_et_prenom: ['', Validators.required],
      nom_et_prenom_arab: ['', Validators.required],
      cin: ['', Validators.required],
      date_naissance: ['', Validators.required],
      // Group 3: Contact
      phoneNumber: ['', Validators.required],
      ville: ['', Validators.required],
    });

    this.formRegister.valueChanges.subscribe(() => {
      this.calculateProgress();
    });

    this.calculateProgress(); // Initial calculation
  }

  calculateProgress(): void {
    const controls = this.formRegister.controls;
    const totalControls = Object.keys(controls).length;
    let validControls = 0;

    for (const name in controls) {
      if (controls[name]?.valid) {
        validControls++;
      }
    }

    this.progressPercentage = totalControls > 0 ? Math.round((validControls / totalControls) * 100) : 0;

    // NEW: Logic to set the current step based on progress
    if (this.progressPercentage < 34) {
      this.currentStep = 1;
    } else if (this.progressPercentage < 67) {
      this.currentStep = 2;
    } else {
      this.currentStep = 3;
    }
  }

  // ... (Your showAlertMessage and handleRegister methods remain unchanged)
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