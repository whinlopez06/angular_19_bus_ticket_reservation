import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, catchError, throwError } from 'rxjs';
import { BusScheduleListApi, BusScheduleList2Api, BusScheduleSummaryApi } from '../interface/busSchedule.interface';
import { environment } from '../../environments/environment';
import { handleHttpError } from '../shared/error-handler';

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

  getBusSchedules(): Observable<BusScheduleList2Api[]> {
    return this.http.get<BusScheduleList2Api[]>(this.apiUrl + `bus-schedule/index`)
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
    return this.http.post(`${this.apiUrl}bus-schedule/store`, payload)
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
    return this.http.delete(`${this.apiUrl}bus-schedule/delete/${id}`)
    .pipe(
        catchError(err => {
          console.error('Error deleting schedule: ', err);
          return throwError(() => new Error("Failed to delete schedule"));
        })
    );
  }

}
