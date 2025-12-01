import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusScheduleListApi } from '../interface/busSchedule.interface';
import { BusScheduleService } from '../services/bus-schedule.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TimeDifferencePipe } from '../pipes/time-difference.pipe';

@Component({
  selector: 'app-my-bookings',
  imports: [TimeDifferencePipe],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  busScheduleService = inject(BusScheduleService);
  private destroyRef = inject(DestroyRef);
  busScheduleData!: BusScheduleListApi;


  ngOnInit(): void {
    this.activatedRoute.params.subscribe((result: any) => {
      const scheduleId = result.scheduleId;
      if (scheduleId) {
        this.getBusScheduleById(scheduleId);
      }
    })
  }

  getBusScheduleById(scheduleId: number) {
    this.busScheduleService.getBusScheduleById(scheduleId).pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((result: BusScheduleListApi) => {
      this.busScheduleData = result;
    });
  }



}
