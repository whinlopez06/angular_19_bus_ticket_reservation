import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BusScheduleBookingSeatApi } from '../interface/busScheduleBooking.interface';
import { BusScheduleBookingApi } from '../interface/busScheduleBooking.interface';
@Injectable({
  providedIn: 'root'
})
export class BusScheduleBookingServiceService {

  private readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }


}
