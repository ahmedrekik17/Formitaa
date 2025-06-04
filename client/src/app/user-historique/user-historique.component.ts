import { Component, OnInit } from '@angular/core';
import { EvaluationService } from '../services/evaluation.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-historique',
  templateUrl: './user-historique.component.html',
  styleUrls: ['./user-historique.component.css']
})
export class UserHistoriqueComponent implements OnInit {
  evaluations: any[] = [];
  userId: string = '';  // Placeholder for user ID

  constructor(
    private evaluationService: EvaluationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the current logged-in user's info
    this.authService.getLoggedInUser().subscribe(user => {
      if (user) {
        this.userId = user._id;  // Get user ID from the logged-in user info
        
        // Fetch evaluations for the logged-in user
        this.evaluationService.getEvaluationsByUserId(this.userId).subscribe(
          (data) => {
            this.evaluations = data;
          },
          (error) => {
            console.log('Error fetching evaluations:', error);
          }
        );
      } else {
        console.error('User is not logged in');
      }
    });
  }

  getStatus(note: number): string {
    if (note < 10) {
      return 'Non Acceptable';
    } else if (note >= 10 && note < 16) {
      return 'Moyen';
    } else if (note >= 16) {
      return 'Acceptable';
    }
    else if(note===null){
      return ''
    }
    return '';
  }
}
