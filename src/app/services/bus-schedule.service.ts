import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, catchError, throwError } from 'rxjs';
import { BusScheduleListApi, BusScheduleList2Api, BusScheduleSummaryApi } from '../interface/busSchedule.interface';
import { environment } from '../../environments/environment';
import { handleHttpError } from '../shared/error-handler';
import { ApiPagination } from '../interface/apiPagination';

@Injectable({
  providedIn: 'root'
})
export class BusScheduleService {
  private readonly apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }


  getBusScheduleById(scheduleId: number) : Observable<BusScheduleListApi>{
    return this.http.get<BusScheduleListApi>(this.apiUrl + `bus-schedule/booking/${scheduleId}`)
      .pipe(
        catchError(handleHttpError('Failed to load bus schedule'))
      );
  }

  // Observable<BusScheduleList2Api[]>
  getBusSchedules(page: number = 1, perPage: number = 20): Observable<ApiPagination<BusScheduleList2Api>> {
    let params = new HttpParams()
      .set('page', page)
      .set('per_page', perPage);
    return this.http.get<ApiPagination<BusScheduleList2Api>>(this.apiUrl + `bus-schedule/index`, {params})
      .pipe(
        catchError(handleHttpError('Failed to load bus schedules'))
      );
  }

  getBusSchedulesByDate(startDate: any = '', endDate: any = '', page: number = 1, perPage: number = 20): Observable<ApiPagination<BusScheduleList2Api>> {
    let params = new HttpParams()
    .set('page', page)
    .set('per_page', perPage);
    if (startDate) {
      params = params.set('start_date', startDate);
    }
    if (endDate) {
       params = params.set('end_date', endDate);
    }

    return this.http.get<ApiPagination<BusScheduleList2Api>>(this.apiUrl + `bus-schedule/search/date`, {params})
      .pipe(
        catchError(handleHttpError('Failed to load bus schedules'))
      );
  }

  // get all bus schedules grouped by route and date and showing count
  getBusSchedulesSummary() : Observable<BusScheduleSummaryApi[]> {
    return this.http.get<BusScheduleSummaryApi[]>(this.apiUrl + `bus-schedule/summary`)
      .pipe(
        catchError(handleHttpError('Failed to load bus schedule summary'))
      );
  }

  createBusSchedule(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}bus-schedule`, payload)
      .pipe(
        catchError(err => {
          console.error('Error creating schedule: ', err);
          return throwError(() => new Error("Failed to create schedule"));
        })
      );
  }

  updateBusSchedule(updateParams: any): Observable<any>{
    return this.http.put(`${this.apiUrl}bus-schedule/${updateParams.id}`, updateParams)
    .pipe(
        catchError(err => {
          console.error('Error updating schedule: ', err);
          return throwError(() => new Error("Failed to update schedule"));
        })
    );
  }

  deleteBusSchedule(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}bus-schedule/${id}`)
    .pipe(
        catchError(err => {
          console.error('Error deleting schedule: ', err);
          return throwError(() => new Error("Failed to delete schedule"));
        })
    );
  }

}
