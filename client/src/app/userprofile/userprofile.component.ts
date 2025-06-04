import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Userinfo } from '../services/userinfo';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-userprofile',
    templateUrl: './userprofile.component.html',
    styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
    user: Userinfo = {
        _id: '',
        nom_et_prenom: '',
        nom_et_prenom_arab: '',
        email: '',
        phoneNumber: '',
        role: ''
    };
    profile = {
        photoUrl: ''
    };
    userId = '';
    showForm: boolean = false; // Initial state, form is hidden


    constructor(private authService: AuthService, private userService: UserService, private router: Router, private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        // Fetch logged-in user information
        this.authService.getLoggedInUser().subscribe(
            (user: Userinfo | null) => {
                if (user) {
                    this.user = user;
                  this.userId = user._id
                }
            },
            (error) => {
                console.error('Error fetching logged-in user:', error);
            }
        );
    }

    onPhotoChange(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.profile.photoUrl = URL.createObjectURL(file);
        }
    }
    saveProfile() {
        // Get the user id from the user object
        if (!this.userId) return;
        this.authService.updateUserProfile(this.userId, this.user).subscribe({
            next: () => {
                // Fetch updated user information
                this.authService.getLoggedInUser().subscribe(
                    (updatedUser: Userinfo | null) => {
                        if (updatedUser) {
                            this.user = updatedUser;
                            this.showAlertMessage('✅ Profile updated successfully', 'success')
                            window.location.reload();
                            this.showForm = false;
                        }
                    },
                    (error) => {
                        console.error('Error fetching logged-in user:', error);
                        this.showAlertMessage('❌ Profile not updated correctly', 'error')
                    }
                );
            },
            error: () => {
                this.showAlertMessage('❌ Profile not updated correctly', 'error')
            }

        });
    }

    showModifierForm(): void {
        this.showForm = !this.showForm;  
    }

    showAlertMessage(message: string, type: 'success' | 'error' | 'warning') {
      this.modalMessage = message;
      this.modalType = type;
      this.showModal = true;
     setTimeout(()=> {
         this.showModal = false;
     }, 2000)
  }

  modalMessage: string = '';
  modalType: 'success' | 'error' | 'warning' = 'success';
  showModal: boolean = false;


}