import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

interface WeeklyFormation {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  location: string;
}

@Component({
  selector: 'app-calendrier-formations',
  templateUrl: './calendrier-formations.component.html',
  styleUrls: ['./calendrier-formations.component.css'],
})
export class CalendrierFormationsComponent implements OnInit {
  trainingIcons = [
    { name: 'Angular', icon: 'assets/images/angular.png' },
    { name: 'JavaScript', icon: 'assets/images/javascript.png' },
    { name: 'React', icon: 'assets/images/react.png' },
    { name: 'Spring Boot', icon: 'assets/images/sp.png' },
  ];

  days = [
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
    'dimanche',
  ];
  hours = Array.from(
    { length: 12 },
    (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`
  );

  formationsByDay: { [key: string]: WeeklyFormation[] } = {};
  formationsByDayAndHour: { [key: string]: { [key: string]: WeeklyFormation[] } } = {};
  userId: string | null = null;
  currentDate = new Date();

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      this.authService.getLoggedInUser().subscribe({
        next: (user) => {
          this.userId = user?._id || null;
          this.loadWeeklyTrainings();
        },
        error: (err) => {
          console.warn('Failed to get user:', err);
          this.userId = null;
        },
      });
    }

    // Auto-refresh every 60 seconds
    setInterval(() => this.loadWeeklyTrainings(), 60000);
  }

  loadWeeklyTrainings(): void {
    if (!this.userId) return;

    const startOfWeek = new Date(this.currentDate);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday as start
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setUTCHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);

    const startIso = startOfWeek.toISOString();
    const endIso = endOfWeek.toISOString();

    this.http
      .get<any[]>(`http://localhost:8000/api/evaluations/user/${this.userId}/weekly-trainings`, {
        params: { start: startIso, end: endIso }
      })
      .subscribe({
        next: (formations) => {
          const mapped = formations.map((f) => ({
            id: f.id || f._id || '',
            title: f.title,
            date: f.date,
            start: f.start,
            end: f.end,
            location: f.location,
          }));

          this.formationsByDay = this.groupByDay(mapped);
          this.formationsByDayAndHour = this.groupByDayAndHour(mapped);
        },
        error: (err) => console.error('Error fetching weekly trainings:', err),
      });
  }

  groupByDay(formations: WeeklyFormation[]): {
    [key: string]: WeeklyFormation[];
  } {
    const daysFr = [
      'dimanche',
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
    ];
    const grouped: { [key: string]: WeeklyFormation[] } = {};

    for (const f of formations) {
      const dayName = daysFr[new Date(f.date).getDay()];
      if (!grouped[dayName]) grouped[dayName] = [];
      grouped[dayName].push(f);
    }

    return grouped;
  }

  groupByDayAndHour(formations: WeeklyFormation[]): {
    [key: string]: { [key: string]: WeeklyFormation[] };
  } {
    const daysFr = [
      'dimanche',
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
    ];
    const grouped: { [key: string]: { [key: string]: WeeklyFormation[] } } = {};

    for (const f of formations) {
      const dayName = daysFr[new Date(f.date).getDay()];
      if (!grouped[dayName]) grouped[dayName] = {};

      // Get all hours that this formation spans
      const startHour = parseInt(f.start.split(':')[0], 10);
      const endHour = parseInt(f.end.split(':')[0], 10);

      for (let hour = startHour; hour < endHour; hour++) {
        const hourKey = `${hour.toString().padStart(2, '0')}:00`;
        if (!grouped[dayName][hourKey]) grouped[dayName][hourKey] = [];
        grouped[dayName][hourKey].push(f);
      }
    }

    return grouped;
  }

  // NEW METHODS FOR SPANNING FORMATIONS

  // Method to check if current hour is the start of a formation
  isFormationStartHour(formation: WeeklyFormation, hour: string): boolean {
    const startHour = parseInt(formation.start.split(':')[0], 10);
    const currentHour = parseInt(hour.split(':')[0], 10);
    return currentHour === startHour;
  }

  // Method to get formations that START at a specific hour
  getFormationsStartingAtHour(day: string, hour: string): WeeklyFormation[] {
    const allFormations = this.formationsByDayAndHour[day]?.[hour] || [];
    return allFormations.filter(formation => this.isFormationStartHour(formation, hour));
  }

  // Method to get the span (number of hours) for a formation starting at a specific hour
  getFormationSpan(formation: WeeklyFormation, hour: string): number {
    const startHour = parseInt(formation.start.split(':')[0], 10);
    const endHour = parseInt(formation.end.split(':')[0], 10);
    const currentHour = parseInt(hour.split(':')[0], 10);
    
    // Only return span if this is the starting hour
    if (currentHour === startHour) {
      return endHour - startHour;
    }
    return 1; // Default to 1 if not starting hour
  }

  // Method to get the CSS style for spanning formations
getFormationSpanStyle(
  formation: WeeklyFormation,
  hour: string,
  formIndex: number,
  hourIndex: number
): string {
  const span = this.getFormationSpan(formation, hour); // Number of hours to span

  if (span <= 1) {
    return ''; // No spanning, default styling
  }

  const hourCellWidth = 120; // Replace with actual hour cell width in px
  const borderWidth = 1; // Border width between hour cells in px

  const totalWidth = span * hourCellWidth + (span - 1) * borderWidth;

  // Vertical spacing between stacked formations: height(approx 90) + margin (e.g., 10)
  const verticalSpacing = 100;

  return `
    position: absolute;
    width: ${totalWidth}px;
    z-index: 30;
    top: ${formIndex * verticalSpacing}px;
    left: 0;
  `;
}


  // Method to check if a formation should be displayed in a specific hour cell
  shouldDisplayFormationInHour(formation: WeeklyFormation, hour: string): boolean {
    const startHour = parseInt(formation.start.split(':')[0], 10);
    const endHour = parseInt(formation.end.split(':')[0], 10);
    const currentHour = parseInt(hour.split(':')[0], 10);
    
    // Display formation if current hour is within the formation's time span
    return currentHour >= startHour && currentHour < endHour;
  }

  // EXISTING METHODS (UPDATED)

  previousWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.loadWeeklyTrainings();
  }

  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.loadWeeklyTrainings();
  }

  getWeekNumber(): number {
    const date = new Date(this.currentDate);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  getDayDate(dayIndex: number): string {
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(
      this.currentDate.getDate() - this.currentDate.getDay() + dayIndex + 1
    );
    return startOfWeek.getDate().toString();
  }

  getIcon(trainingName: string): string | null {
    const iconObj = this.trainingIcons.find(
      (t) => t.name.toLowerCase() === trainingName.toLowerCase()
    );
    return iconObj ? iconObj.icon : null;
  }

  getFormationCardClass(trainingTitle: string): string {
    const base = 'bg-gradient-to-br';
    switch (trainingTitle.toLowerCase()) {
      case 'react':
        return `${base} from-blue-100 to-blue-200 border-l-blue-500 text-blue-900`;
      case 'angular':
        return `${base} from-red-100 to-red-200 border-l-red-500 text-red-900`;
      case 'javascript':
        return `${base} from-yellow-100 to-yellow-200 border-l-yellow-500 text-yellow-900`;
      case 'spring boot':
        return `${base} from-green-100 to-green-200 border-l-green-500 text-green-900`;
      default:
        return `${base} from-gray-100 to-gray-200 border-l-gray-500 text-gray-900`;
    }
  }

  getLegendColorClass(trainingName: string): string {
    switch (trainingName.toLowerCase()) {
      case 'react':
        return 'bg-gradient-to-br from-blue-100 to-blue-200 border-l-blue-500';
      case 'angular':
        return 'bg-gradient-to-br from-red-100 to-red-200 border-l-red-500';
      case 'javascript':
        return 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-l-yellow-500';
      case 'spring boot':
        return 'bg-gradient-to-br from-green-100 to-green-200 border-l-green-500';
      default:
        return 'bg-gradient-to-br from-gray-100 to-gray-200 border-l-gray-500';
    }
  }

  // Method to get formations for a specific day and hour (UPDATED)
  getFormationsAtHour(day: string, hour: string): WeeklyFormation[] {
    return this.formationsByDayAndHour[day]?.[hour] || [];
  }

  hasAnyFormationAtHour(day: string, hour: string): boolean {
    const formations = this.getFormationsAtHour(day, hour);
    return formations.length > 0;
  }

  getNextHour(hour: string): string {
    const currentHour = parseInt(hour.split(':')[0], 10);
    const nextHour = (currentHour + 1).toString().padStart(2, '0');
    return `${nextHour}:00`;
  }

  getFormationProgress(formation: WeeklyFormation): number {
    const now = new Date();
    const formationDate = new Date(formation.date);
    const start = parseInt(formation.start.split(':')[0], 10);
    const end = parseInt(formation.end.split(':')[0], 10);
    const currentHour = now.getHours();

    if (
      formationDate.toDateString() === now.toDateString() &&
      currentHour >= start &&
      currentHour <= end
    ) {
      return Math.min(((currentHour - start) / (end - start)) * 100, 100);
    }
    return 0;
  }

  isCurrentHour(hour: string): boolean {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0') + ':00';
    return hour === currentHour && this.isCurrentWeek();
  }

  private isCurrentWeek(): boolean {
    const now = new Date();
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    
    const startOfWeek = new Date(this.currentDate);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    
    return startOfCurrentWeek.toDateString() === startOfWeek.toDateString();
  }

  getFormationDuration(formation: WeeklyFormation): string {
    const startHour = parseInt(formation.start.split(':')[0], 10);
    const startMinute = parseInt(formation.start.split(':')[1], 10);
    const endHour = parseInt(formation.end.split(':')[0], 10);
    const endMinute = parseInt(formation.end.split(':')[1], 10);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  }

  // Statistics methods

  getTotalFormations(): number {
    let total = 0;
    for (const day in this.formationsByDay) {
      total += this.formationsByDay[day].length;
    }
    return total;
  }

  getTotalHours(): number {
    let totalMinutes = 0;
    for (const day in this.formationsByDay) {
      for (const formation of this.formationsByDay[day]) {
        const startHour = parseInt(formation.start.split(':')[0], 10);
        const startMinute = parseInt(formation.start.split(':')[1], 10);
        const endHour = parseInt(formation.end.split(':')[0], 10);
        const endMinute = parseInt(formation.end.split(':')[1], 10);
        
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        totalMinutes += endTotalMinutes - startTotalMinutes;
      }
    }
    return Math.round(totalMinutes / 60 * 10) / 10; // Round to 1 decimal place
  }

  getActiveDays(): number {
    let activeDays = 0;
    for (const day in this.formationsByDay) {
      if (this.formationsByDay[day].length > 0) {
        activeDays++;
      }
    }
    return activeDays;
  }

  // Helper method to get formation count at specific hour
  getFormationCountAtHour(day: string, hour: string): number {
    return this.getFormationsAtHour(day, hour).length;
  }

  // Helper method to check if formation is the first occurrence (to avoid duplicates in display)
  isFirstOccurrenceOfFormation(formation: WeeklyFormation, day: string, hour: string): boolean {
    const startHour = parseInt(formation.start.split(':')[0], 10);
    const currentHour = parseInt(hour.split(':')[0], 10);
    return startHour === currentHour;
  }

  isCurrentDay(day: string): boolean {
  const now = new Date();
  const daysFr = [
    'dimanche',
    'lundi', 
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
  ];
  const currentDayName = daysFr[now.getDay()];
  
  // Check if we're viewing the current week
  if (!this.isCurrentWeek()) {
    return false;
  }
  
  return day === currentDayName;
}
}