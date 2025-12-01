import { Component, DestroyRef, inject, OnInit, signal, effect } from '@angular/core';
import { BusService } from '../../services/bus.service';
import { Observable, takeUntil } from 'rxjs';
import { BusLocation } from '../../interface/bus.interface';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { BusScheduleService } from '../../services/bus-schedule.service';
import { LocationDropdownComponent } from '../../reusable/location-dropdown/location-dropdown.component';
import { ScheduleDatePickerComponent } from '../../reusable/schedule-date-picker/schedule-date-picker.component';
import { BusScheduleSummary } from '../../interface/busSchedule.interface';
import { ToastService } from '../../shared/toast.service';
import { TimeFormatDirective } from '../../directive/time-format.directive';
import { formatDate } from '../../shared/date-format-handler';

@Component({
  selector: 'app-search',
  imports: [FormsModule, LocationDropdownComponent, TimeFormatDirective, ScheduleDatePickerComponent, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  busService = inject(BusService);
  busScheduleService = inject(BusScheduleService);
  router = inject(Router);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  formatDate = formatDate;

  dropDownFromLocationValue = signal<number>(0);
  dropDownToLocationValue = signal<number>(0);
  scheduleDateValue = signal<string>('');

  busLocationList: BusLocation[] = [];
  //busLocations$: Observable<BusLocation[]> = new Observable<BusLocation[]>;
  busScheduleSummaryList: BusScheduleSummary[] = [];

  constructor() {
  }

  ngOnInit(): void {
      this.loadBusLocations();
      this.loadBusSchedulesSummary();
  }

  handleOnChildFromLocation(value: any): void {
  }

  handleOnChildToLocation(value: any): void {
  }

  handleOnChildScheduleDate(value: any): void {
  }

  loadBusLocations(): void {
    this.busService.getLocations()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: busLocations => {
        console.log('busLocations:...', busLocations);
        this.busLocationList = busLocations; //?? {id: 0, name: '', code: ''};
      },
      error: err => {
        this.toast.showError(err.message);
      }
    });
  }

  loadBusSchedulesSummary(): void {
    this.busScheduleService.getBusSchedulesSummary()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: response => {
        this.busScheduleSummaryList = response;
      },
      error: err => {
        this.toast.showError(err.message);
      }
    });
  }

  searchBus(): void {
    const fromId = this.dropDownFromLocationValue();
    const toId = this.dropDownToLocationValue();
    const schedDate = this.scheduleDateValue();

    this.router.navigate(['/search-result'], {
      queryParams: { fromId, toId, schedDate}
    }
    );
  }

  navigateToBooking(scheduleId: number) {
  }

}
