import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.css']
})
export class ModalMessageComponent {
  @Input() show: boolean = false;
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' = 'success';

  @Output() closeEvent = new EventEmitter<void>();  // Event emitter to notify the parent component to close the modal


  close() {
    this.closeEvent.emit();  // Emit event to notify parent to close the modal
  }
}


