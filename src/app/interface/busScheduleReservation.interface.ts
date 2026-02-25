// (using)
export interface BusScheduleReservationApi {
  bus_schedule_id: number;
  fullname: string;
  email_address: string;
  age: number;
  gender: string;
  seat_number: number;
}
// (using)
export interface BusScheduleReservationSeatApi {
  seat_number: number;
  fullname?: string;
  emailAddress?: string;
  age?: number;
  gender: string;
}
// (using)
export interface ScheduleReservation {
  scheduleId: number,
  availableSeats: number,
  bookedSeats: number,
  selectedSeats: number
}
