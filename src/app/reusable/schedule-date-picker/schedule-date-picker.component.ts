
import { Component, EventEmitter, Input, input, Output, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-schedule-date-picker',
  imports: [FormsModule, CommonModule],
  templateUrl: './schedule-date-picker.component.html',
  styleUrl: './schedule-date-picker.component.css'
})
export class ScheduleDatePickerComponent {

  @Input() icon: string = 'fa-calendar-check';
  @Input() label: string = 'Date of journey:';

  @Input() selectedDate !:ReturnType <typeof signal<string>>;
  @Output() selectedDateChange = new EventEmitter<string | null>();

  onValueChange(value: string): void {
    this.selectedDate.set(value);
  }

}
