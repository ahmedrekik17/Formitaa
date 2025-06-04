import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Userinfo } from '../services/userinfo';

@Component({
  selector: 'app-sidebar-userhistorique',
  templateUrl: './sidebar-userhistorique.component.html',
  styleUrls: ['./sidebar-userhistorique.component.css']
})
export class SidebarUserhistoriqueComponent {
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
}
