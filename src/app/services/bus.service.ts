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
  private readonly apiUrl: string = environment.apiUrl;

  busLocations$ = new BehaviorSubject<BusLocation[]>([]);

  constructor(private http: HttpClient) {
  }

  searchBusSchedules(params: BusScheduleSearch): Observable<BusScheduleListApi[]> {
    return this.http.get<BusScheduleListApi[]>(this.apiUrl+ `bus-schedule/search?
        from_location_id=${params.fromLocationId}
        &to_location_id=${params.toLocationId}
        &travel_date=${params.travelDate}`)
      .pipe(
        catchError(handleHttpError('Failed to search bus schedules'))
      );
  }

}
