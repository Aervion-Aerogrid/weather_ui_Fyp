import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClimateDataService } from '../../services/climate/climate-data.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-month-bar',
  templateUrl: './month-bar.component.html',
  styleUrls: ['./month-bar.component.css']
})
export class MonthBarComponent implements OnInit {
  selectedYear: number = new Date().getFullYear();
  selectedCity: string = 'karachi';
  selectedParameter: string = 'temperature_2m_mean';

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

  chartOptions: any = {}; // Chart configuration

  constructor(private climateService: ClimateDataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchMonthlyClimateData();
  }

  fetchMonthlyClimateData() {
    console.log('Fetching Monthly Data for', {
      city: this.selectedCity,
      year: this.selectedYear,
      parameter: this.selectedParameter
    });

    this.chartOptions = null;
    this.climateService.getMonthlyClimateData(this.selectedCity, this.selectedYear, this.selectedParameter)
      .subscribe(data => {
        console.log('Received Monthly Data:', data);
        this.updateChart(data);
      });
  }

  updateChart(data: any) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dataPoints = months.map((month, index) => ({
      label: month,
      y: data[index]?.[this.selectedParameter] ?? 0 // Handle missing data
    }));

    console.log('Generated Monthly DataPoints:', dataPoints);

    setTimeout(() => {
      this.chartOptions = {
        title: {
          text: `${this.selectedCity} Monthly ${this.selectedParameter} Data (${this.selectedYear})`,
          fontSize: 18
        },
        theme: "light2",
        animationEnabled: true,
        animationDuration: 2500, // Smooth animation effect
        axisY: {
          includeZero: false,
          title: `${this.selectedParameter} (Units)`
        },
        toolTip: {
          shared: true,
          content: "{label}: {y}" // Tooltip formatting
        },
        data: [{
          type: "column",
          color: "#ff5733",
          dataPoints: dataPoints
        }]
      };
      this.cdr.detectChanges(); // Ensure Angular detects the change
    }, 50);
  }



  onYearChange(event: MatSelectChange) {
    this.selectedYear = event.value;
    this.fetchMonthlyClimateData();
    this.reloadChart();
  }

  onCityChange(event: MatSelectChange) {
    this.selectedCity = event.value;
    this.fetchMonthlyClimateData();
    this.reloadChart();
  }

  onParameterChange(event: MatSelectChange) {
    this.selectedParameter = event.value;
    this.fetchMonthlyClimateData();
    this.reloadChart();
  }

  reloadChart() {
    this.fetchMonthlyClimateData(); // Reload chart when refresh button is clicked
  }

}
