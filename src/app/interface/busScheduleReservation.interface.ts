export interface BusScheduleReservationApi {
  bus_schedule_id: number;
  fullname: string;
  email_address: string;
  age: number;
  gender: string;
  seat_number: number;
}

export interface BusScheduleReservationSeatApi {
  seat_number: number;
  fullname?: string;
  age?: number;
  gender: string;
}

export interface ScheduleReservation {
  scheduleId: number,
  availableSeats: number,
  bookedSeats: number,
  selectedSeats: number
}
