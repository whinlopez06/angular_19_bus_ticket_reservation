import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Location } from '../interface/location.interface';
import { handleHttpError } from '../shared/error-handler';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private readonly apiUrl: string = environment.apiUrl; //'http://localhost:8000/api/';

  constructor(private http: HttpClient) {

  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl + "bus-location")
      .pipe(
        catchError(handleHttpError('Failed to load bus locations'))
      );
  }

}
