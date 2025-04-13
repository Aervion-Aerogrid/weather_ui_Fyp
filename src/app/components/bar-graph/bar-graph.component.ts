import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClimateDataService } from '../../services/climate/climate-data.service';

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.css']
})
export class BarGraphComponent implements OnInit {
  selectedCity: string = 'karachi';
  selectedParameter: string = 'temperature_2m_mean';
  // **Set default range to 2010-2025**
  startYear: number = 1990;
  endYear: number = 2025;
  availableYears: number[] = Array.from({ length: 101 }, (_, i) => 1950 + i);

  availableCities: string[] = ['karachi','Ahmedpur East','Dera Ghazi Khan',
    'Gilgit','Jacobabad','Jaranwala','Kamoke','Khanewal','Larkana','Multan',
    'Nawabshah','New Mirpur City','Sahiwal','Zafarwal'];
  availableParameters: string[] = [
    'temperature_2m_mean', 'temperature_2m_max', 'temperature_2m_min',
    'wind_speed_10m_mean', 'wind_speed_10m_max',
    'cloud_cover_mean', 'relative_humidity_2m_mean', 'relative_humidity_2m_max', 'relative_humidity_2m_min',
    'dew_point_2m_mean', 'dew_point_2m_min', 'dew_point_2m_max',
    'precipitation_sum', 'rain_sum', 'snowfall_sum', 'pressure_msl_mean',
    'soil_moisture_0_to_10cm_mean', 'et0_fao_evapotranspiration_sum'
  ];

  chartOptions: any = null; // Start with null to ensure animation on first load

  constructor(private climateService: ClimateDataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchClimateData(); // Fetch initial data
  }

  fetchClimateData() {
    console.log(`Fetching Yearly Data for`, {
      city: this.selectedCity,
      parameter: this.selectedParameter
    });

    // **Reset chart options to force re-render & animation**
    this.chartOptions = null;
    this.cdr.detectChanges(); // Trigger change detection before fetching new data

    // **Fetch new climate data**
    this.climateService.getYearlyClimateData(this.selectedCity, this.selectedParameter)
      .subscribe(data => {
        console.log('Received Yearly Data:', data);
        this.updateChart(data);
      });
  }

  updateChart(data: any) {
    console.log(`Updating chart for`, data);

    let dataPoints = data
      .filter((item: any) => item.year >= this.startYear && item.year <= this.endYear) // Filter by selected range
      .map((item: any) => ({
        label: item.year.toString(),
        y: item[this.selectedParameter] ?? 0
      }));

    if (dataPoints.length === 0) {
      console.warn("No data available in selected range!");
      dataPoints = [{ label: "No Data", y: 0 }];
    }

    this.setChartOptions(dataPoints);
  }

  setChartOptions(dataPoints: any) {
    this.chartOptions = {
      title: { text: `${this.selectedCity} (${this.startYear}-${this.endYear}) ${this.selectedParameter} Data` },
      theme: "light2",
      animationEnabled: true,
      exportEnabled: false,
      axisY: { includeZero: false, title: `${this.selectedParameter} (Units)` },
      axisX: {
        title: "Year",
        interval: 5, // Show every 5 years on X-axis
      },
      data: [{ type: "column", color: "#90EE90", dataPoints }]
    };

    console.log("Updated Chart Options:", this.chartOptions);
    this.cdr.detectChanges();
  }

  onCityChange(event: any) {
    this.selectedCity = event.value;
    this.fetchClimateData();
  }

  onParameterChange(event: any) {
    this.selectedParameter = event.value;
    this.fetchClimateData();
  }

  onYearRangeChange() {
    this.fetchClimateData();
  }

  reloadChart() {
    this.fetchClimateData(); // Reload chart when refresh button is clicked
  }
}

