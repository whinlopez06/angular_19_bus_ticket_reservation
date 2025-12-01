import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, catchError, throwError } from 'rxjs';
import { BusLocation } from '../interface/bus.interface';
import { BusScheduleSearch } from '../interface/busSchedule.interface';
import { BusScheduleListApi } from '../interface/busSchedule.interface';
import { environment } from '../../environments/environment';
import { handleHttpError } from '../shared/error-handler';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private readonly apiUrl: string = environment.apiUrl; //'http://localhost:8000/api/';

  busLocations$ = new BehaviorSubject<BusLocation[]>([]);

  constructor(private http: HttpClient) {
  }

  getLocations(): Observable<BusLocation[]> {
    return this.http.get<BusLocation[]>(this.apiUrl + "bus-location")
      .pipe(
        catchError(handleHttpError('Failed to load bus locations'))
      );
  }

  searchBusSchedule(params: BusScheduleSearch): Observable<BusScheduleListApi[]> {
    return this.http.get<BusScheduleListApi[]>(this.apiUrl+ `bus-schedule/search?
        from_bus_location_id=${params.fromBusLocationId}
        &to_bus_location_id=${params.toBusLocationId}
        &schedule_date=${params.scheduleDate}`)
      .pipe(
        catchError(handleHttpError('Failed to search bus schedules'))
      );
  }

}
