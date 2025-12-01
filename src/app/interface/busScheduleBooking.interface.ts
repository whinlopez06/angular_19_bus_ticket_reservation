export interface BusScheduleBookingApi {
  bus_schedule_id: number;
  fullname: string;
  email_address: string;
  age: number;
  gender: string;
  seat_number: number;
}

export interface BusScheduleBookingSeatApi {
  seat_number: number;
  fullname?: string;
  age?: number;
  gender: string;
}

export interface ScheduleBooking {
  scheduleId: number,
  availableSeats: number,
  bookedSeats: number,
  selectedSeats: number
}
