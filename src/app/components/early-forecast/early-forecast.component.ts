
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
//import { Chart, registerables } from 'chart.js';

//Chart.register(...registerables);

@Component({
  selector: 'app-early-forecast',
  templateUrl: './early-forecast.component.html',
  styleUrls: ['./early-forecast.component.css']
})
export class EarlyForecastComponent implements OnInit {
  ngOnInit(): void {

  }
/*
  map!: L.Map;
  chart!: Chart;

  cityName = 'Lahore';
  cities: string[] = ['Lahore', 'Karachi', 'Islamabad', 'Quetta'];

  // Current weather data
  currentTime = 'Apr 13, 07:10am';
  temperature = 0;
  feelsLike = 0;
  condition = '';
  windDesc = '';
  windSpeed = 0;
  windDirection = '';
  pressure = 0;
  humidity = 0;
  dewPoint = 0;
  visibility = 0;

  // Forecast
  forecast: any[] = [];

  cityWeatherData: any = {
    Lahore: {
      coordinates: [31.5497, 74.3436],
      current: {
        temperature: 28, feelsLike: 30, condition: 'Clear Sky', windDesc: 'Calm',
        windSpeed: 2.5, windDirection: 'NE', pressure: 1010,
        humidity: 40, dewPoint: 16, visibility: 12
      },
      forecast: [
        { date: 'Sun, Apr 13', tempMax: 35, tempMin: 20, condition: 'Clear Sky' },
        { date: 'Mon, Apr 14', tempMax: 36, tempMin: 21, condition: 'Light Rain' },
        { date: 'Tue, Apr 15', tempMax: 33, tempMin: 19, condition: 'Light Rain' },
        { date: 'Wed, Apr 16', tempMax: 34, tempMin: 20, condition: 'Clear Sky' },
        { date: 'Thu, Apr 17', tempMax: 35, tempMin: 22, condition: 'Clear Sky' },
        { date: 'Fri, Apr 18', tempMax: 36, tempMin: 23, condition: 'Light Rain' },
        { date: 'Sat, Apr 19', tempMax: 34, tempMin: 21, condition: 'Moderate Rain' },
        { date: 'Sun, Apr 20', tempMax: 33, tempMin: 20, condition: 'Light Rain' },
      ],
      hourly: [28, 29, 30, 32, 33, 34, 34, 33, 32]
    },
    Karachi: {
      coordinates: [24.8607, 67.0011],
      current: {
        temperature: 30, feelsLike: 33, condition: 'Overcast Clouds', windDesc: 'Breezy',
        windSpeed: 5.0, windDirection: 'SW', pressure: 1007,
        humidity: 70, dewPoint: 24, visibility: 8
      },
      forecast: [
        { date: 'Sun, Apr 13', tempMax: 32, tempMin: 26, condition: 'Moderate Rain' },
        { date: 'Mon, Apr 14', tempMax: 31, tempMin: 25, condition: 'Overcast Clouds' },
        { date: 'Tue, Apr 15', tempMax: 33, tempMin: 26, condition: 'Light Rain' },
        { date: 'Wed, Apr 16', tempMax: 34, tempMin: 27, condition: 'Light Rain' },
        { date: 'Thu, Apr 17', tempMax: 35, tempMin: 28, condition: 'Clear Sky' },
        { date: 'Fri, Apr 18', tempMax: 36, tempMin: 29, condition: 'Clear Sky' },
        { date: 'Sat, Apr 19', tempMax: 34, tempMin: 28, condition: 'Moderate Rain' },
        { date: 'Sun, Apr 20', tempMax: 33, tempMin: 27, condition: 'Light Rain' },
      ],
      hourly: [30, 30, 31, 32, 32, 33, 33, 32, 31]
    },
    Islamabad: {
      coordinates: [33.6844, 73.0479],
      current: {
        temperature: 22, feelsLike: 22, condition: 'Light Rain', windDesc: 'Gentle Breeze',
        windSpeed: 3.2, windDirection: 'NW', pressure: 1012,
        humidity: 50, dewPoint: 12, visibility: 10
      },
      forecast: [
        { date: 'Sun, Apr 13', tempMax: 26, tempMin: 16, condition: 'Light Rain' },
        { date: 'Mon, Apr 14', tempMax: 25, tempMin: 15, condition: 'Overcast Clouds' },
        { date: 'Tue, Apr 15', tempMax: 27, tempMin: 17, condition: 'Light Rain' },
        { date: 'Wed, Apr 16', tempMax: 28, tempMin: 18, condition: 'Clear Sky' },
        { date: 'Thu, Apr 17', tempMax: 29, tempMin: 19, condition: 'Clear Sky' },
        { date: 'Fri, Apr 18', tempMax: 30, tempMin: 20, condition: 'Moderate Rain' },
        { date: 'Sat, Apr 19', tempMax: 28, tempMin: 19, condition: 'Moderate Rain' },
        { date: 'Sun, Apr 20', tempMax: 27, tempMin: 18, condition: 'Light Rain' },
      ],
      hourly: [22, 23, 24, 25, 25, 26, 27, 26, 25]
    }
  };

  ngOnInit(): void {
    this.updateData();
    this.initMap();
    this.initChart();
  }

  updateData(): void {
    const city = this.cityWeatherData[this.cityName];

    if (!city) return;

    // Current weather
    this.temperature = city.current.temperature;
    this.feelsLike = city.current.feelsLike;
    this.condition = city.current.condition;
    this.windDesc = city.current.windDesc;
    this.windSpeed = city.current.windSpeed;
    this.windDirection = city.current.windDirection;
    this.pressure = city.current.pressure;
    this.humidity = city.current.humidity;
    this.dewPoint = city.current.dewPoint;
    this.visibility = city.current.visibility;

    // Forecast
    this.forecast = city.forecast;

    // Update map view
    if (this.map) {
      this.map.setView(city.coordinates, 10);
    }

    // Update chart
    if (this.chart) {
      this.chart.data.datasets[0].data = city.hourly;
      this.chart.update();
    }
  }

  private initMap(): void {
    const coords = this.cityWeatherData[this.cityName].coordinates;
    this.map = L.map('map').setView(coords, 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private initChart(): void {
    const hourlyTemps = this.cityWeatherData[this.cityName].hourly;
    const ctx = document.getElementById('tempChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm'],
        datasets: [{
          label: 'Hourly Temperature (°C)',
          data: hourlyTemps,
          borderColor: '#ff6600',
          backgroundColor: 'rgba(255, 102, 0, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }

  onCityChange(event: any){
    this.cityName = event.value;
    this.updateData();
  }

  getIcon(condition: string): string {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('light rain')) return 'assets/icons/light-rain.png';
    if (conditionLower.includes('moderate rain')) return 'assets/icons/moderate-rain.png';
    if (conditionLower.includes('overcast')) return 'assets/icons/cloudy.png';
    if (conditionLower.includes('clear')) return 'assets/icons/clear.png';
    return 'assets/icons/default.png';
  }
    */
}
