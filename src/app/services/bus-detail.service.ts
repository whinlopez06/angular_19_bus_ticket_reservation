import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, catchError, throwError, map } from 'rxjs';
import { BusDetailBusApi } from '../interface/busDetail.interface';
import { environment } from '../../environments/environment';
import { handleHttpError } from '../shared/error-handler';

@Injectable({
  providedIn: 'root'
})
export class BusDetailService {
  private readonly apiUrl: string = environment.apiUrl; //'http://localhost:8000/api/';
  constructor(private http: HttpClient) { }


    // BusDetailBusInfoApi
    getBusesDetail(): Observable<BusDetailBusApi[]> {
      return this.http.get<BusDetailBusApi[]>(this.apiUrl + 'bus-detail/buses')
        .pipe(
          catchError(handleHttpError('Failed to get bus details'))
        );
    }
}
