import { Component, inject, OnInit, DestroyRef, signal, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusScheduleListApi } from '../../interface/busSchedule.interface';
import { BusScheduleService } from '../../services/bus-schedule.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusScheduleReservationService } from '../../services/bus-schedule-reservation.service';
import { BusScheduleBookingApi, BusScheduleBookingSeatApi, ScheduleBooking } from '../../interface/busScheduleBooking.interface';
import { BusScheduleReservationApi, BusScheduleReservationSeatApi, ScheduleReservation } from '../../interface/busScheduleReservation.interface';
import { TooltipDirective } from '../../directive/tooltip.directive';
import { TimeFormatDirective } from '../../directive/time-format.directive';
import { TimeDifferenceDirective } from '../../directive/time-difference.directive';
import { ToastService } from '../../shared/toast.service';
import { formatDate } from '../../shared/date-format-handler';

@Component({
  selector: 'app-ticket-reservation',
  imports: [CommonModule, FormsModule, TooltipDirective, TimeFormatDirective, TimeDifferenceDirective],
  templateUrl: './ticket-reservation.component.html',
  styleUrl: './ticket-reservation.component.css'
})
export class TicketReservationComponent implements OnInit, AfterViewInit{


  activatedRoute = inject(ActivatedRoute);
  busScheduleService = inject(BusScheduleService);
  busScheduleReservationService = inject(BusScheduleReservationService);
  formatDate = formatDate;
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  busScheduleData = signal<BusScheduleListApi>({
    id: 0,
    bus_detail_id: 0,
    operator_name: '',
    bus_name: '',
    description: '',
    from_location: '',
    to_location: '',
    boarding_time: '',
    travel_date: '',
    seat_capacity: 0,
    price: 0.0
  });

  scheduleReservation = signal<ScheduleReservation>({
    scheduleId: 0,
    availableSeats: 0,
    bookedSeats: 0,
    selectedSeats: 0
  });

  seatNumberList = signal<number[]>([]);
  selectedSeatArray = signal<BusScheduleReservationApi[]>([]);
  reservedSeatList = signal<BusScheduleReservationSeatApi[]>([]); // reference for booked seat

  showBusSeats: boolean = false;
  tooltipVisible: boolean = false;
  tooltipText: string = '';
  tooltipStyle: any = {};


  constructor() {

    this.activatedRoute.params
    .subscribe((result: any) => {
      const scheduleId = Number(result.scheduleId);
      if (scheduleId) {
        this.scheduleReservation.update(prev => ({...prev, scheduleId: scheduleId}));
        this.getBusScheduleById(scheduleId);  // get schedule details
      }
    });

  }

  ngOnInit(): void {
    this.loadBusBookedSeats(Number(this.scheduleReservation().scheduleId));
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
    const isSelected = this.reservedSeatList().find(i => i.seat_number == seatNumber);
    if (isSelected == undefined) {
      return false;
    }
    return true;
  }

  getTooltipText(seatNumber: number): string {
    let details: string = '';
    this.reservedSeatList().find((i) => {
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
      this.scheduleReservation.update(prev => ({...prev,
        availableSeats: prev.availableSeats + 1,
        selectedSeats: prev.selectedSeats - 1
      }));
    } else {
      const newPassengerData: BusScheduleReservationApi = {
        seat_number: seatNumber,
        bus_schedule_id: Number(this.scheduleReservation().scheduleId),
        fullname: '',
        age: 0,
        gender: '',
        email_address: '',
      }
      this.selectedSeatArray().push(newPassengerData);
      this.scheduleReservation.update(prev => ({...prev,
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
        this.scheduleReservation.update(prev => ({...prev,
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
    this.busScheduleReservationService.getBusBookedSeats(scheduleId)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: busBookedSeats => {
        this.reservedSeatList.set(busBookedSeats);
        this.scheduleReservation.update(prev => ({...prev,
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

    this.busScheduleReservationService.createNewBooking(this.selectedSeatArray())
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (result: any) => {
        this.toast.showSuccess(result.message);
        // reset state
        this.selectedSeatArray.set([]); // reset the signal
        this.scheduleReservation.update(prev => ({...prev,
          selectedSeats: 0
        }));
        this.loadBusBookedSeats(this.scheduleReservation().scheduleId);
      }, error: err => {
        this.toast.showError('Booking failed. Please try again');
        this.toast.showError(err.message);
      }
    });
  }

}
