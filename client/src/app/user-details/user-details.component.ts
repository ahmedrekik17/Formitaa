import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Userinfos } from '../services/userinfo'; // Adjust path

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {

  @Input() user: Userinfos | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}