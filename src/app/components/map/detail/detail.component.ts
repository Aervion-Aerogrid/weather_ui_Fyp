import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CsvDataService } from '../../../services/csv/csv-data.service';
import { StationData } from '../../../models/station_model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  stations: StationData[] = []; // Store station data
  filteredStations: StationData[] = []; // Store filtered search results
  stationCount: number = 0; // Number of stations
  searchQuery: string = ''; // Query for searching stations
  selectedStation: StationData | null = null; // Store selected station data for detail view

  constructor(
    private csvDataService: CsvDataService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchStationsData();
  }

  // Fetch the CSV data using the service, ensuring no cache is used
  fetchStationsData() {
    // Always fetch new data from the API, do not use localStorage
    this.csvDataService.fetchCsvData().subscribe({
      next: (data: StationData[]) => {
        // Exclude the last station from the data
        this.stations = data.slice(0, data.length - 1); // Slice the data array, removing the last station
        this.stationCount = this.stations.length; // Update station count
        this.filteredStations = [...this.stations]; // Initially show all stations (excluding the last one)
        this.cdr.detectChanges(); // Manually trigger change detection to update the view
      },
      error: (error) => {
        console.error('Error fetching station data:', error);
      }
    });
  }


  // Method to search stations by title or any other field
  searchStations() {
    if (this.searchQuery.trim() === '') {
      this.filteredStations = [...this.stations]; // If no query, show all stations
    } else {
      this.filteredStations = this.stations.filter(station =>
        station.Title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        station.Latitude.toString().includes(this.searchQuery) ||
        station.Longitude.toString().includes(this.searchQuery)
      );
    }
    this.cdr.detectChanges(); // Trigger change detection after filtering
  }

  // Method to select a station to view detailed data
  selectStation(station: StationData) {
    this.selectedStation = station;
    this.cdr.detectChanges(); // Trigger change detection after selecting a station
  }
}

