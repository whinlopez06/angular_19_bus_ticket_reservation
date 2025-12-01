import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusLocation } from '../../interface/bus.interface';
import { BusService } from '../../services/bus.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-location-dropdown',
  imports: [FormsModule, CommonModule],
  templateUrl: './location-dropdown.component.html',
  styleUrl: './location-dropdown.component.css'
})
export class LocationDropdownComponent implements OnInit {
  @Input() label: string = 'Location';
  @Input() icon: string = 'fa-map-marker-alt';
  @Input() options: { id: number, name: string }[] = [];
  //@Input() selectedValue: number | string | null  = '';
  @Input({required: true}) selectedValue!: ReturnType<typeof signal<number>>;

  @Output() selectedValueChange = new EventEmitter<number | string| null>();

  private destroyRef = inject(DestroyRef);
  busService = inject(BusService);

  busLocationList: BusLocation[] = [];

  constructor() {
  }

  ngOnInit(): void {
    if (this.options.length == 0) {
        this.getLocations();
    }
  }

  // signal version
  onValueChange(value: number): void {
    this.selectedValue.set(value);
    this.selectedValueChange.emit(this.selectedValue());
  }

  getLocations() {
    this.busService.getLocations()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((result: any) => {
      //this.busLocationList = result;
      this.options = result;
    });
  }

}
