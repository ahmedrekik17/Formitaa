import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service'; // Update the import path accordingly
import { FormationService } from 'src/app/services/formation.service'; // Update the import path accordingly
import { FormateurService } from 'src/app/services/formateur.service'; // Update the import path accordingly

@Component({
  selector: 'app-dashboardadmin',
  templateUrl: './dashboardadmin.component.html',
  styleUrls: ['./dashboardadmin.component.css']
})
export class DashboardadminComponent implements OnInit {
  currentTime: string = '';
  inboxCount: number = 2;
  totalUsers: number = 0;
  totalTrainings: number = 0;
  totalFormateurs: number = 0;

  constructor(
    private userService: UserService,
    private formationService: FormationService,
    private formateurService: FormateurService
  ) {}

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
    this.fetchDashboardData();
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  fetchDashboardData(): void {
    this.userService.getUsers().subscribe(data => {
      this.totalUsers = data.length; // Assuming the response is an array of users
    });

    this.formationService.getTrainings().subscribe(data => {
      this.totalTrainings = data.length; // Assuming the response is an array of trainings
    });

    this.formateurService.getFormateurs().subscribe(data => {
      this.totalFormateurs = data.length; // Assuming the response is an array of formateurs
    });
  }


  isSidebarOpen: boolean = false; // Add this line to your component
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
}
closeSideBar(): void{
    this.isSidebarOpen = false;
}
}
