import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Userinfo } from '../services/userinfo';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

    // Font Awesome icons
  faHome = faHome;
  faLogout = faRightFromBracket;
  faLogin = faRightToBracket;

  public user: Userinfo | null = null;
  constructor(private authService: AuthService, private router: Router) {}

ngOnInit(): void {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    this.authService.getLoggedInUser().subscribe({
      next: (user: Userinfo | null) => {
        this.user = user;
      },
      error: (err) => {
        console.warn('⛔ Failed to get user:', err);
        this.user = null;
      }
    });
  } else {
    this.user = null; // guest mode
  }
}





logout() {
  this.authService.logout().subscribe({
    next: () => {
      localStorage.removeItem('auth_token'); // optional, unused here
      localStorage.removeItem('isLoggedIn');  // ✅ remove the flag
      this.user = null;
      this.router.navigate(['/accueil']);
          this.closeDropdown();

    }
  });
}

isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }



}
