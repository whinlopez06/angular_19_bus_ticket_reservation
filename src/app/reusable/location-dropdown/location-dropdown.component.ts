import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocationService } from '../../services/location.service';
import { ToastService } from '../../shared/toast.service';
@Component({
  selector: 'app-location-dropdown',
  imports: [FormsModule, CommonModule],
  templateUrl: './location-dropdown.component.html',
  styleUrl: './location-dropdown.component.css'
})
export class LocationDropdownComponent implements OnInit {

  @Input() label: string = 'Location';
  @Input() icon: string = 'fa-map-marker-alt';
  @Input() defaultOptionValue: string = 'Select an option';
  @Input() options: { id: number, name: string }[] = [];
  @Input({required: true}) selectedValue!: ReturnType<typeof signal<number>>;

  @Output() selectedValueChange = new EventEmitter<number | string| null>();


  locationService = inject(LocationService);
  LocationList: Location[] = [];
  toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  constructor() {
  }

  ngOnInit(): void {
    // no input option values then get default locations
    if (this.options.length == 0) {
        this.getLocations();
    }
  }

  onValueChange(value: number): void {
    this.selectedValue.set(value);
    this.selectedValueChange.emit(this.selectedValue());
  }

  getLocations() {
    this.locationService.getLocations()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: locations => {
        this.options = locations;
      },
      error: err => {
        this.toast.showError(err.message);
      }
    })
  }

}
