import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @Input() show: boolean = false;
  @Input() message: string = '';

  @Output() confirm = new EventEmitter<boolean>(); // Emit event for confirm/cancel

  onConfirm() {
    this.confirm.emit(true); // Emit true for confirm
  }

  onCancel() {
    this.confirm.emit(false); // Emit false for cancel
  }
}