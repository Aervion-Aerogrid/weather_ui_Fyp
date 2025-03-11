import { Component } from '@angular/core';
import { CsvDataService } from '../../../services/csv/csv-data.service';

@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.css'],
})
export class ReportDownloadComponent {
  constructor(private csvService: CsvDataService) {}

  // Function to trigger CSV download
  downloadCsv(): void {
    this.csvService.downloadCsv();
  }

  // Function to trigger CSV download
  download_Decoded_Csv(): void {
    this.csvService.download_decoded_Csv();
  }
}
