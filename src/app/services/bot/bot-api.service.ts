


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BotApiService {

  private apiUrl = environment.apiUrl + 'ask';

  constructor(private http: HttpClient) {}

  askQuestion(prompt: string): Observable<{ response: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ response: string }>(this.apiUrl, { query: prompt }, { headers });
  }
}

