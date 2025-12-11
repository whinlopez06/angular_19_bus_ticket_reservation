import { Component, inject, DestroyRef, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  formatDate = formatDate;
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  //busScheduleLists: BusScheduleListApi[] = [];
  busScheduleLists = signal<BusScheduleListApi[]>([])

  searchParams = signal<BusScheduleSearch>({
    fromLocationId: 0,
    toLocationId: 0,
    travelDate: null
  });

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.searchParams().fromLocationId = params['fromId'];
      this.searchParams().toLocationId = params['toId'];
      this.searchParams().travelDate = params['date'];
      this.loadSearchBusSchedules();
    });
  }

  loadSearchBusSchedules(): void {
    this.busService.searchBusSchedules(this.searchParams())
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: busSchedules => {
        this.busScheduleLists.set(busSchedules);
      },
      error: err => {
        this.toast.showError(err.message);
      }
    });
  }

}
