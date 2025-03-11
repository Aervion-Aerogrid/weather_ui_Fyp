import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  checkAPIStatus(): Observable<{ status: string; timestamp: string }> {
    return this.http.get<{ status: string; timestamp: string }>(`${this.apiUrl}healthcheck`);
  }
}
