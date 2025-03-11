import { Component } from '@angular/core';
import { ClimateReportService } from '../../../services/climate-report/climate-report.service';

@Component({
  selector: 'app-climate-report',
  templateUrl: './climate-report.component.html',
  styleUrls: ['./climate-report.component.css']
})
export class ClimateReportComponent {

  constructor(private climateService: ClimateReportService) {}

  downloadDaily() {
    this.climateService.downloadDailyReport();
  }

  downloadMonthly() {
    this.climateService.downloadMonthlyReport();
  }

  downloadYearly() {
    this.climateService.downloadYearlyReport();
  }
}
