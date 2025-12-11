import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BusScheduleBookingSeatApi } from '../interface/busScheduleBooking.interface';
import { BusScheduleBookingApi } from '../interface/busScheduleBooking.interface';

@Injectable({
  providedIn: 'root'
})
export class BusScheduleReservationService {

  private readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {  }

  createNewBooking(objectParams:BusScheduleBookingApi[]) {
    return this.http.post(this.apiUrl + `bus-schedule-booking/store`, objectParams)
      .pipe(
        catchError(err => {
          console.error('Error creating booking: ', err);
          return throwError(() => new Error("Failed to create booking"));
        })
      );
  }

  getBusBookedSeats(scheduledId: number): Observable<BusScheduleBookingSeatApi[]> {
    return this.http.get<BusScheduleBookingSeatApi[]>(`${this.apiUrl}bus-schedule-booking/${scheduledId}`)
      .pipe(
        catchError(err => {
          console.error('Error creating booking: ', err);
          return throwError(() => new Error("Failed to create booking"));
        })
      );
  }

}
