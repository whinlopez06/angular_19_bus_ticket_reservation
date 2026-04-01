import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, catchError, throwError } from 'rxjs';
import { BusLocation } from '../interface/bus.interface';
import { BusScheduleSearch } from '../interface/busSchedule.interface';
import { BusScheduleListApi } from '../interface/busSchedule.interface';
import { environment } from '../../environments/environment';
import { handleHttpError } from '../shared/error-handler';
import { ApiPagination } from '../interface/apiPagination';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private readonly apiUrl: string = environment.apiUrl;

  busLocations$ = new BehaviorSubject<BusLocation[]>([]);

  constructor(private http: HttpClient) {
  }

  searchBusSchedules(searchParams: BusScheduleSearch, page: number = 1, perPage: number = 20): Observable<ApiPagination<BusScheduleListApi>> {
    let params = new HttpParams()
      .set('page', page)
      .set('per_page', perPage);
    return this.http.get<ApiPagination<BusScheduleListApi>>(this.apiUrl+ `bus-schedule/search?
        from_location_id=${searchParams.fromLocationId}
        &to_location_id=${searchParams.toLocationId}
        &travel_date=${searchParams.travelDate}`, {params})
      .pipe(
        catchError(handleHttpError('Failed to search bus schedules'))
      );
  }

}
