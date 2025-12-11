import { Component, DestroyRef, inject, OnInit, signal, effect } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { BusScheduleService } from '../../services/bus-schedule.service';
import { LocationDropdownComponent } from '../../reusable/location-dropdown/location-dropdown.component';
import { ScheduleDatePickerComponent } from '../../reusable/schedule-date-picker/schedule-date-picker.component';
import { BusScheduleSummaryApi } from '../../interface/busSchedule.interface';
import { ToastService } from '../../shared/toast.service';
import { formatDate } from '../../shared/date-format-handler';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule, LocationDropdownComponent, ScheduleDatePickerComponent, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  locationService = inject(LocationService);
  busScheduleService = inject(BusScheduleService);
  router = inject(Router);
  formatDate = formatDate;
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);


  dropdownFromLocationValue = signal<number>(0);
  dropdownToLocationValue = signal<number>(0);
  travelDateValue = signal<string>('');

  //busLocations$: Observable<BusLocation[]> = new Observable<BusLocation[]>;
  busScheduleSummaryList = signal<BusScheduleSummaryApi[]>([]);

  constructor() {
  }

  ngOnInit(): void {
      this.loadBusSchedulesSummary();
  }

  // loadLocations(): void {
  //   this.locationService.getLocations()
  //   .pipe(takeUntilDestroyed(this.destroyRef))
  //   .subscribe({
  //     next: busLocations => {
  //       this.busLocationList = busLocations;
  //     },
  //     error: err => {
  //       this.toast.showError(err.message);
  //     }
  //   });
  // }

  loadBusSchedulesSummary(): void {
    this.busScheduleService.getBusSchedulesSummary()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: busScheduleSummary => {
        this.busScheduleSummaryList.set(busScheduleSummary);
      },
      error: err => {
        this.toast.showError(err.message);
      }
    });
  }

  searchBusSchedules(): void {
    const fromId = this.dropdownFromLocationValue();
    const toId = this.dropdownToLocationValue();
    const date = this.travelDateValue();

    if (fromId == toId && (fromId > 0 && toId > 0)) {
      this.toast.showWarning('Destination cannot be the same.');
      return;
    }
    this.router.navigate(['/search-result'], {
      queryParams: { fromId, toId, date }
    }
    );
  }

}
