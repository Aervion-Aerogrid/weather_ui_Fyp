import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IsobarImageDataService {
  private apiUrlImage = `${environment.apiUrl}image-data`;
  private apiSvgImage = `${environment.apiUrl}svg-data`;
  constructor(private http: HttpClient) {}

  // Method to fetch specific isobar data with image type as parameter
  getIsobarData(imageType: string): Observable<any> {
    // Log a message to the console when the method is called
    console.log('Fetching image data from:', this.apiUrlImage, 'with image type:', imageType);

    // Set query parameters
    const params = new HttpParams().set('image_type', imageType);

    // Set HTTP headers to prevent caching
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
      'Pragma': 'no-cache', // HTTP 1.0
      'Expires': '0' // Proxies
    });

    return this.http.get<any>(this.apiUrlImage, { params, headers }).pipe(catchError(this.handleError));
  }

  // Method to fetch SVG data as text
  getSvgData(imageType: string): Observable<string> {
    console.log('Fetching SVG data for:', imageType);

    const params = new HttpParams().set('image_type', imageType);
       // Set HTTP headers to prevent caching
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate', // HTTP 1.1
      'Pragma': 'no-cache', // HTTP 1.0
      'Expires': '0' // Proxies
    });
    return this.http.get(this.apiSvgImage, { params,headers, responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  // Method to handle HTTP errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Failed to fetch image data. Please try again later.'));
  }



}
