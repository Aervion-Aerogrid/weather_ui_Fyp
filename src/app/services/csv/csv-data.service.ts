import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as Papa from 'papaparse';
import { environment } from '../../../environments/environment';

export interface StationData {
  Station_ID: number;
  Title: string;
  Latitude: number;
  Longitude: number;
  Temperature: number;
  Station_pressure: number;
  Sea_level_pressure: number;
  Humidity:number;
  High_clouds: number;
  Low_clouds:number;
  Mid_clouds:number;
  Wind_combined:string;
  Sky_cover:number;
  Dew_point:number;
  Wind_speed:number;
  Wind_direction:number;
  Precipitation_rate:number;
 }

@Injectable({
  providedIn: 'root'
})
export class CsvDataService {
  private csvUrl = `${environment.apiUrl}csv`; // URL for CSV data
  private csvdecodeUrl = `${environment.apiUrl}csv_decode`; // URL for CSV data
  constructor(private http: HttpClient) {}

  // Method to fetch CSV data from the FastAPI backend without caching
  fetchCsvData(): Observable<StationData[]> {
    const urlWithNoCache = `${this.csvUrl}?_=${new Date().getTime()}`;
    console.log('Fetching CSV data from:', urlWithNoCache);

    return this.http.get(urlWithNoCache, { responseType: 'text' }).pipe(
      map((data: string) => this.parseCsvData(data)), // Parse CSV data
      catchError((error) => this.handleFetchError(error)) // Centralized error handling
    );
  }

  // Helper method to parse CSV data and convert it to StationData[]
  private parseCsvData(data: string): StationData[] {
    let parsedData: StationData[] = [];
    Papa.parse<StationData>(data, {
      header: true,
      dynamicTyping: true, // Automatically convert numeric values
      complete: (results: Papa.ParseResult<StationData>) => {
        if (results.data && results.data.length > 0) {
          parsedData = results.data;
        }
      },
      error: (error) => {
        console.error('Error during CSV parsing:', error.message);
      }
    });
    return parsedData;
  }
  // Method to download CSV file
  downloadCsv(): void {
    const urlWithNoCache = `${this.csvUrl}?_=${new Date().getTime()}`;
    this.http.get(urlWithNoCache, { responseType: 'text' }).subscribe(
      (data: string) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'station_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Error downloading CSV:', error);
      }
    );
  }

  download_decoded_Csv(): void {
    const urlWithNoCache = `${this.csvdecodeUrl}?_=${new Date().getTime()}`;
    this.http.get(urlWithNoCache, { responseType: 'text' }).subscribe(
      (data: string) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Decoded_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Error downloading CSV:', error);
      }
    );
  }

  // Centralized error handling for fetch operations
  private handleFetchError(error: any): Observable<StationData[]> {
    console.error('Error fetching data:', error);
    // Optionally, you can return an empty array or rethrow the error
    return of([]); // Return an empty array in case of an error
  }
}
