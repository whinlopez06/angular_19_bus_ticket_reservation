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
export class BookTicketComponent implements OnInit, AfterViewInit {

  private destroyRef = inject(DestroyRef);
  activatedRoute = inject(ActivatedRoute);
  busScheduleService = inject(BusScheduleService);  // service for bus schedule
  busScheduleBookingService = inject(BusScheduleBookingServiceService); // service for schedule booking
  private toast = inject(ToastService);
  formatDate = formatDate;

  busScheduleData = signal<BusScheduleListApi>({
    id: 0,
    bus_detail_id: 0,
    operator_name: '',
    bus_name: '',
    description: '',
    from_bus_location: '',
    to_bus_location: '',
    departure_time: '',
    arrival_time: '',
    schedule_date: '',
    seat_capacity: 0,
    price: 0.0
  });

  seatNumberList = signal<number[]>([]);
  selectedSeatArray = signal<BusScheduleBookingApi[]>([]);
  bookedSeatList = signal<BusScheduleBookingSeatApi[]>([]); // reference for booked seat
  scheduleBooking = signal<ScheduleBooking>({
    scheduleId: 0,
    availableSeats: 0,
    bookedSeats: 0,
    selectedSeats: 0
  });

  showBusSeats: boolean = false;
  tooltipVisible: boolean = false;
  tooltipText: string = '';
  tooltipStyle: any = {};

  constructor() {
    this.activatedRoute.params
    .subscribe((result: any) => {
      const scheduleId = Number(result.scheduleId);
      if (scheduleId) {
        this.scheduleBooking.update(prev => ({...prev, scheduleId: scheduleId}));
        this.getBusScheduleById(scheduleId);  // get schedule details
      }
    });
  }

  ngOnInit(): void {
    this.loadBusBookedSeats(Number(this.scheduleBooking().scheduleId));
  }

  ngAfterViewInit(): void {
  }

  // check if seat is selected on load based on DB records
  isSeatSelected(seatNumber: number): boolean {
    const isSelected = this.selectedSeatArray().find(i => i.seat_number == seatNumber);
    if (isSelected == undefined) {
      return false;
    }
    return true;
  }

  // check if seat is booked on render of schedule seats
  isSeatBooked(seatNumber: number) {
    const isSelected = this.bookedSeatList().find(i => i.seat_number == seatNumber);
    if (isSelected == undefined) {
      return false;
    }
    return true;
  }

  getTooltipText(seatNumber: number): string {
    let details: string = '';
    this.bookedSeatList().find((i) => {
      if (i.seat_number == seatNumber) {
        details = i.age + ' | ' + (i.gender == 'M' ? 'Male' : 'Female');
      }
    });
    return details;
  }

  // triggers when click/select of seat
  onSelectSeat(seatNumber: any): void {
    const isExistIndex = this.selectedSeatArray().findIndex(i => i.seat_number == seatNumber)
    if (isExistIndex >= 0) {
      this.selectedSeatArray().splice(isExistIndex, 1);
      this.scheduleBooking.update(prev => ({...prev,
        availableSeats: prev.availableSeats + 1,
        selectedSeats: prev.selectedSeats - 1
      }));
    } else {
      const newPassengerData: BusScheduleBookingApi = {
        seat_number: seatNumber,
        bus_schedule_id: Number(this.scheduleBooking().scheduleId),
        fullname: '',
        age: 0,
        gender: '',
        email_address: '',
      }
      this.selectedSeatArray().push(newPassengerData);
      this.scheduleBooking.update(prev => ({...prev,
        availableSeats: prev.availableSeats - 1,
        selectedSeats: prev.selectedSeats + 1
      }));
    }
  }

  getBusScheduleById(scheduleId: number): void {
    this.busScheduleService.getBusScheduleById(scheduleId)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: busSchedule => {
        this.busScheduleData.set(busSchedule);
        this.scheduleBooking.update(prev => ({...prev,
          availableSeats: this.busScheduleData().seat_capacity
        }));
        // populate seats array from API result
        for(let index = 1; index <= this.busScheduleData().seat_capacity; index++) {
          this.seatNumberList().push(index);
        }
      },
      error: err => {
        this.toast.showError(err.message);
      }
    });
  }

  loadBusBookedSeats(scheduleId: number): void {
    this.busScheduleBookingService.getBusBookedSeats(scheduleId)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: busBookedSeats => {
        this.bookedSeatList.set(busBookedSeats);
        this.scheduleBooking.update(prev => ({...prev,
          bookedSeats: busBookedSeats.length,
          availableSeats: this.busScheduleData().seat_capacity - busBookedSeats.length
        }));
        this.showBusSeats = true;
      },
      error: err => {
        this.toast.showError(err.message);
      }
    });
  }

  bookTicket() {
    const confirmation = confirm('Are you sure you want to confirm this booking?');
    if (!confirmation) {
      return;
    }

    this.busScheduleBookingService.createNewBooking(this.selectedSeatArray())
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (result: any) => {
        this.toast.showSuccess(result.message);
        // reset state
        this.selectedSeatArray.set([]); // reset the signal
        this.scheduleBooking.update(prev => ({...prev,
          selectedSeats: 0
        }));
        this.loadBusBookedSeats(this.scheduleBooking().scheduleId);
      }, error: err => {
        this.toast.showError('Booking failed. Please try again');
        this.toast.showError(err.message);
      }
    });
  }

}
