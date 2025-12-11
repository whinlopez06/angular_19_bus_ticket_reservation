import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, catchError, throwError, map } from 'rxjs';
import { BusSchedule, BusScheduleListApi, BusScheduleList2Api, BusScheduleSummaryApi } from '../interface/busSchedule.interface';
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

}
