import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    // Check if the user is logged in and has the required role
    return this.authService.getLoggedInUser().pipe(
      take(1), // Get the first value emitted from the observable
      map(user => {
        if (user) {
          if (state.url === '/dashboard' && user.role !== 'admin') {
            this.router.navigate(['/accueil']);
            return false;
          }
          if (state.url.startsWith('/gestionformateur') && user.role !== 'admin') {
            this.router.navigate(['/accueil']);
            return false;
          }
          if (state.url.startsWith('/gestionformation') && user.role !== 'admin') {
            this.router.navigate(['/accueil']);
            return false;
          }
          if (state.url.startsWith('/gestionuser') && user.role !== 'admin') {
            this.router.navigate(['/accueil']);
            return false;
          }
          if (state.url.startsWith('/nosformation') && user.role !== 'user') {
            this.router.navigate(['/dashboard']);
            return false;
          }
          if (state.url.startsWith('/accueil') && user.role !== 'user') {
            this.router.navigate(['/dashboard']);
            return false;
          }
          if (state.url.startsWith('/profile') && user.role !== 'user') {
            this.router.navigate(['/dashboard']);
            return false;
          }
          if (state.url.startsWith('/historique') && user.role !== 'user') {
            this.router.navigate(['/dashboard']);
            return false;
          }
          
          return true; // Allow access to the route
        } else {
          this.router.navigate(['/login']); // Redirect to login if not authenticated
          return false;
        }
      })
    );
  }
}
