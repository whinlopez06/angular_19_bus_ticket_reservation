import { Component, inject, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import { BusService } from '../../services/bus.service';
import { BusScheduleSearch } from '../../interface/busSchedule.interface';
import { BusScheduleListApi } from '../../interface/busSchedule.interface';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { formatDate } from '../../shared/date-format-handler';
import { TimeFormatDirective } from '../../directive/time-format.directive';
import { ToastService } from '../../shared/toast.service';
@Component({
  selector: 'app-search-result',
  imports: [FormsModule, RouterLink, TimeFormatDirective],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css'
})

export class SearchResultComponent implements OnInit {

  activatedRoute = inject(ActivatedRoute);
  busService = inject(BusService);
  toast = inject(ToastService);
  formatDate = formatDate;
  private destroyRef = inject(DestroyRef);
  busScheduleLists: BusScheduleListApi[] = [];

  searchObject: BusScheduleSearch = {
    fromBusLocationId: 0,
    toBusLocationId: 0,
    scheduleDate: null
  }

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchObject.fromBusLocationId = params['fromId'];
      this.searchObject.toBusLocationId = params['toId'];
      this.searchObject.scheduleDate = params['schedDate'];

      this.loadSearchBusResults();

    });
  }

  loadSearchBusResults(): void {
    this.busService.searchBusSchedule(this.searchObject)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: busSchedules => {
        this.busScheduleLists = busSchedules;
      },
      error: err => {
        this.toast.showError(err.message);
      }
    });
  }

}
