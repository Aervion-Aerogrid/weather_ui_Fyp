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
    this.csvDataService.fetchCsvData().subscribe({
      next: (data: StationData[]) => {
        this.stations = data.slice(0, data.length - 1); // Remove last station
        this.stationCount = this.stations.length;
        this.filteredStations = [...this.stations]; // Initially, show all stations
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error fetching station data:', error)
    });
  }

  // Method to search stations dynamically
  searchStations() {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredStations = query
      ? this.stations.filter(station =>
          station.Title.toLowerCase().includes(query) ||
          station.Latitude.toString().includes(this.searchQuery) ||
          station.Longitude.toString().includes(this.searchQuery)
        )
      : [...this.stations]; // Reset if empty

    this.cdr.detectChanges(); // Ensure UI updates
  }

  // Method to select a station
  selectStation(station: StationData) {
    this.selectedStation = station;
    this.cdr.detectChanges();
  }
}


