import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Formateur } from '../services/formation-details';

@Component({
  selector: 'app-formateur-details',
  templateUrl: './formateur-details.component.html',
  styleUrls: ['./formateur-details.component.css']
})
export class FormateurDetailsComponent {

  @Input() formateur: Formateur | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}