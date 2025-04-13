
import { Component, OnInit, ViewChild } from '@angular/core';
import { HealthApiService } from '../../services/health/health-api.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent{
  constructor(private healthApiService: HealthApiService, private cdr: ChangeDetectorRef) {}

  loading: boolean = false;
  apiStatus: string = 'Checking...';
  isApiUp: boolean = false;
  refreshTrigger: boolean = true; // Toggle this to refresh components

  ngOnInit() {
    this.checkAPIStatus();
  }

  refreshComponents() {
    this.refreshTrigger = false;
    this.cdr.detectChanges(); // Detect and update UI
    setTimeout(() => {
      this.refreshTrigger = true;
      this.cdr.detectChanges();
    });
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


}
