import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClimateDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getYearlyClimateData(city: string, parameter: string): Observable<any> {
    const timestamp = Date.now(); // Unique timestamp to prevent caching
    return this.http.get<any>(`${this.apiUrl}climate_data/${city}/${parameter}`, {
      params: new HttpParams().set('_ts', timestamp.toString()) // Append timestamp as query param
    });
  }

  getMonthlyClimateData(city: string, year: number, parameter: string): Observable<any> {
    const timestamp = Date.now(); // Unique timestamp to prevent caching
    return this.http.get<any>(`${this.apiUrl}climate_data_monthly/${city}/${year}/${parameter}`, {
      params: new HttpParams().set('_ts', timestamp.toString()) // Append timestamp as query param
    });
  }
}
