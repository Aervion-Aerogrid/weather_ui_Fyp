import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClimateReportService {
  private baseUrl = `${environment.apiUrl}csv`; // Base URL for CSV endpoints

  constructor(private http: HttpClient) {}

  // Method to download the Daily Climate Report CSV
  downloadDailyReport(): void {
    this.downloadCsv(`${this.baseUrl}/daily`, 'climate_daily.csv');
  }

  // Method to download the Monthly Climate Report CSV
  downloadMonthlyReport(): void {
    this.downloadCsv(`${this.baseUrl}/monthly`, 'climate_monthly.csv');
  }

  // Method to download the Yearly Climate Report CSV
  downloadYearlyReport(): void {
    this.downloadCsv(`${this.baseUrl}/yearly`, 'climate_yearly.csv');
  }

  // Generic method to download CSV files
  private downloadCsv(url: string, filename: string): void {
    this.http.get(url, { responseType: 'text' }).subscribe(
      (data: string) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const objectUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(objectUrl);
      },
      (error) => {
        console.error(`Error downloading ${filename}:`, error);
      }
    );
  }
}
