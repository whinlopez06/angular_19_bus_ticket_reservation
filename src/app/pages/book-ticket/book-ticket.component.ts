import { Component, inject, OnInit, DestroyRef, signal, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusScheduleListApi } from '../../interface/busSchedule.interface';
import { BusScheduleService } from '../../services/bus-schedule.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusScheduleBookingServiceService } from '../../services/bus-schedule-booking-service.service';
import { BusScheduleBookingApi, BusScheduleBookingSeatApi, ScheduleBooking } from '../../interface/busScheduleBooking.interface';
import { TooltipDirective } from '../../directive/tooltip.directive';
import { TimeFormatDirective } from '../../directive/time-format.directive';
import { TimeDifferenceDirective } from '../../directive/time-difference.directive';
import { ToastService } from '../../shared/toast.service';
import { formatDate } from '../../shared/date-format-handler';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [NgClass, FormsModule, TooltipDirective, TimeFormatDirective, TimeDifferenceDirective],
  templateUrl: './book-ticket.component.html',
  styleUrl: './book-ticket.component.css'
})
export class BookTicketComponent {



}
