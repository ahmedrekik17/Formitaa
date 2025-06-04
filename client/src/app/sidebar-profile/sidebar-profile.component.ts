import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Userinfo } from '../services/userinfo';

@Component({
  selector: 'app-sidebar-profile',
  templateUrl: './sidebar-profile.component.html',
  styleUrls: ['./sidebar-profile.component.css']
})
export class SidebarProfileComponent {
  sidenav: boolean = true;

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
