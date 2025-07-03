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
    { name: 'Java', icon: 'assets/images/java.png' },

  ];
  days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  hours = Array.from({ length: 12 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`);

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
        error: (err) => console.warn('Failed to get user:', err),
      });
    }
    setInterval(() => this.loadWeeklyTrainings(), 60000);
  }

  loadWeeklyTrainings(): void {
    if (!this.userId) return;

    const startOfWeek = new Date(this.currentDate);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setUTCHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);

    const startIso = startOfWeek.toISOString();
    const endIso = endOfWeek.toISOString();

    this.http
      .get<any[]>(`http://localhost:8000/api/evaluations/user/${this.userId}/weekly-trainings`, {
        params: { start: startIso, end: endIso },
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

  private groupByDay(formations: WeeklyFormation[]): { [key: string]: WeeklyFormation[] } {
    const daysFr = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const grouped: { [key: string]: WeeklyFormation[] } = {};
    for (const f of formations) {
      const dayName = daysFr[new Date(f.date).getDay()];
      if (!grouped[dayName]) grouped[dayName] = [];
      grouped[dayName].push(f);
    }
    return grouped;
  }

  private groupByDayAndHour(formations: WeeklyFormation[]): {
    [key: string]: { [key: string]: WeeklyFormation[] };
  } {
    const daysFr = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const grouped: { [key: string]: { [key: string]: WeeklyFormation[] } } = {};
    for (const f of formations) {
      const dayName = daysFr[new Date(f.date).getDay()];
      if (!grouped[dayName]) grouped[dayName] = {};

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

  getWeekNumber(): number {
    const date = new Date(this.currentDate);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  previousWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.loadWeeklyTrainings();
  }

  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.loadWeeklyTrainings();
  }

  getDayDate(dayIndex: number): string {
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay() + dayIndex + 1);
    return startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  getIcon(trainingName: string): string | null {
    const iconObj = this.trainingIcons.find(
      (t) => t.name.toLowerCase() === trainingName.toLowerCase()
    );
    return iconObj ? iconObj.icon : null;
  }

  getNextHour(hour: string): string {
    const currentHour = parseInt(hour.split(':')[0], 10);
    return `${(currentHour + 1).toString().padStart(2, '0')}:00`;
  }

  getFormationsAtHour(day: string, hour: string): WeeklyFormation[] {
    // Return formations that *cover* this hour
    return this.formationsByDayAndHour[day]?.[hour] || [];
  }

  hasAnyFormationAtHour(day: string, hour: string): boolean {
    return (this.formationsByDayAndHour[day]?.[hour] || []).length > 0;
  }

  getFormationDuration(formation: WeeklyFormation): string {
    const duration = this.calculateFormationDurationInHours(formation);
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    if (hours === 0) return `${minutes}min`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h${minutes}min`;
  }

  getFormationProgress(formation: WeeklyFormation): number {
    const now = new Date();
    const formationDate = new Date(formation.date);
    if (formationDate.toDateString() !== now.toDateString()) return 0;

    const startTime = this.parseTime(formation.start);
    const endTime = this.parseTime(formation.end);
    const currentTime = this.parseTime(`${now.getHours()}:${now.getMinutes()}`);

    if (currentTime >= startTime && currentTime <= endTime) {
      const totalDuration = endTime - startTime;
      const elapsed = currentTime - startTime;
      return Math.min((elapsed / totalDuration) * 100, 100);
    }
    return 0;
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
        return 'border-l-blue-500';
      case 'angular':
        return 'border-l-red-500';
      case 'javascript':
        return 'border-l-yellow-500';
      case 'spring boot':
        return 'border-l-green-500';
      case 'java':
        return 'border-l-purple-500';
      default:
        return 'border-l-gray-500';
    }
  }

  isCurrentDay(day: string): boolean {
    if (!this.isCurrentWeek()) return false;
    const daysFr = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return day === daysFr[new Date().getDay()];
  }

  isCurrentHour(hour: string): boolean {
    if (!this.isCurrentWeek()) return false;
    return hour.startsWith(new Date().getHours().toString().padStart(2, '0'));
  }

  private isCurrentWeek(): boolean {
    const now = new Date();
    const startOfThisWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
    );
    const startOfVisibleWeek = new Date(
      this.currentDate.setDate(
        this.currentDate.getDate() - this.currentDate.getDay() + (this.currentDate.getDay() === 0 ? -6 : 1)
      )
    );
    return startOfThisWeek.toDateString() === startOfVisibleWeek.toDateString();
  }

  getTotalFormations(): number {
    return Object.values(this.formationsByDay).reduce((acc, day) => acc + day.length, 0);
  }

  getTotalHours(): number {
    let totalMinutes = 0;
    for (const day of Object.values(this.formationsByDay)) {
      for (const f of day) {
        totalMinutes += (this.parseTime(f.end) - this.parseTime(f.start)) * 60;
      }
    }
    return Math.round(totalMinutes / 6) / 10;
  }

  getActiveDays(): number {
    return Object.values(this.formationsByDay).filter((day) => day.length > 0).length;
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + minutes / 60;
  }

  private calculateFormationDurationInHours(formation: WeeklyFormation): number {
    const startTime = this.parseTime(formation.start);
    const endTime = this.parseTime(formation.end);
    return endTime < startTime ? 24 - startTime + endTime : endTime - startTime;
  }
}
