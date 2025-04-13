import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HealthApiService } from '../../services/health/health-api.service';

@Component({
  selector: 'app-climatepage',
  templateUrl: './climatepage.component.html',
  styleUrls: ['./climatepage.component.css']
})
export class ClimatepageComponent{
  constructor(private healthApiService: HealthApiService, private cdr: ChangeDetectorRef) {}

  loading: boolean = false;
  apiStatus: string = 'Checking...';
  isApiUp: boolean = false;
  refreshTrigger: boolean = true; // Toggle this to refresh components

  ngOnInit() {
    this.checkAPIStatus();
  }



  checkAPIStatus() {
    this.healthApiService.checkAPIStatus().subscribe({
      next: () => {
        this.apiStatus = 'API Online ';
        this.isApiUp = true;
        this.refreshComponents(); // Refresh when API is online
      },
      error: () => {
        this.apiStatus = 'API Down';
        this.isApiUp = false;
      }
    });
  }

  refreshComponents() {
    this.refreshTrigger = false;
    this.cdr.detectChanges(); // Detect and update UI
    setTimeout(() => {
      this.refreshTrigger = true;
      this.cdr.detectChanges();
    });
  }
}
