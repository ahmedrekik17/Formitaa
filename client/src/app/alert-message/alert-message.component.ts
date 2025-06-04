import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css']
})
export class AlertMessageComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' = 'success';
  @Input() show: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
