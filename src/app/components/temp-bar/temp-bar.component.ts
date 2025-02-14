import { Component } from '@angular/core';

@Component({
  selector: 'app-temp-bar',
  templateUrl: './temp-bar.component.html',
  styleUrls: ['./temp-bar.component.css']
})
export class TempBarComponent {
  isMonthly = true;
  selectedCity = "Karachi"; // Default city
  selectedYear = "2023"; // Default year

  cities = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot", "Hyderabad", "Bahawalpur"];

  // Data structure for monthly data by city and year
  monthlyDataByYear: { [year: string]: { [city: string]: any[] } } = {
    "2023": {
      "Karachi": [ { label: "Jan", y: 30 }, { label: "Feb", y: 28 }, { label: "Mar", y: 31 }, { label: "Apr", y: 33 }, { label: "May", y: 35 }, { label: "Jun", y: 37 }, { label: "Jul", y: 38 }, { label: "Aug", y: 36 }, { label: "Sep", y: 34 }, { label: "Oct", y: 33 }, { label: "Nov", y: 32 }, { label: "Dec", y: 30 } ],
      // Add data for other cities in 2023 here...
    },
    "2022": {
      "Karachi": [ { label: "Jan", y: 28 }, { label: "Feb", y: 27 }, { label: "Mar", y: 29 }, { label: "Apr", y: 30 }, { label: "May", y: 32 }, { label: "Jun", y: 34 }, { label: "Jul", y: 36 }, { label: "Aug", y: 35 }, { label: "Sep", y: 33 }, { label: "Oct", y: 31 }, { label: "Nov", y: 30 }, { label: "Dec", y: 29 } ],
      // Add data for other cities in 2022 here...
    }
    // Add more years here...
  };

// Data for yearly temperature of multiple cities
yearlyData: { [city: string]: any[] } = {
  "Karachi": [
    { label: "2012", y: 30 },
    { label: "2013", y: 31 },
    { label: "2014", y: 32 },
    { label: "2015", y: 33 },
    { label: "2016", y: 34 },
    { label: "2017", y: 35 },
    { label: "2018", y: 36 },
    { label: "2019", y: 37 },
    { label: "2020", y: 38 },
    { label: "2021", y: 39 },
    { label: "2022", y: 40 },
    { label: "2023", y: 41 }
  ],
  "Lahore": [
    { label: "2012", y: 28 },
    { label: "2013", y: 29 },
    { label: "2014", y: 30 },
    { label: "2015", y: 31 },
    { label: "2016", y: 32 },
    { label: "2017", y: 33 },
    { label: "2018", y: 34 },
    { label: "2019", y: 35 },
    { label: "2020", y: 36 },
    { label: "2021", y: 37 },
    { label: "2022", y: 38 },
    { label: "2023", y: 39 }
  ],
  "Islamabad": [
    { label: "2012", y: 25 },
    { label: "2013", y: 26 },
    { label: "2014", y: 27 },
    { label: "2015", y: 28 },
    { label: "2016", y: 29 },
    { label: "2017", y: 30 },
    { label: "2018", y: 31 },
    { label: "2019", y: 32 },
    { label: "2020", y: 33 },
    { label: "2021", y: 34 },
    { label: "2022", y: 35 },
    { label: "2023", y: 36 }
  ],
  "Peshawar": [
    { label: "2012", y: 27 },
    { label: "2013", y: 28 },
    { label: "2014", y: 29 },
    { label: "2015", y: 30 },
    { label: "2016", y: 31 },
    { label: "2017", y: 32 },
    { label: "2018", y: 33 },
    { label: "2019", y: 34 },
    { label: "2020", y: 35 },
    { label: "2021", y: 36 },
    { label: "2022", y: 37 },
    { label: "2023", y: 38 }
  ],
  "Quetta": [
    { label: "2012", y: 15 },
    { label: "2013", y: 16 },
    { label: "2014", y: 17 },
    { label: "2015", y: 18 },
    { label: "2016", y: 19 },
    { label: "2017", y: 20 },
    { label: "2018", y: 21 },
    { label: "2019", y: 22 },
    { label: "2020", y: 23 },
    { label: "2021", y: 24 },
    { label: "2022", y: 25 },
    { label: "2023", y: 26 }
  ],
  "Faisalabad": [
    { label: "2012", y: 29 },
    { label: "2013", y: 30 },
    { label: "2014", y: 31 },
    { label: "2015", y: 32 },
    { label: "2016", y: 33 },
    { label: "2017", y: 34 },
    { label: "2018", y: 35 },
    { label: "2019", y: 36 },
    { label: "2020", y: 37 },
    { label: "2021", y: 38 },
    { label: "2022", y: 39 },
    { label: "2023", y: 40 }
  ],
  // Add more cities here...
};

  chartOptions: any = {};

  constructor() {
    this.setChartOptions(this.monthlyDataByYear[this.selectedYear][this.selectedCity], 'Monthly');
  }

  get availableYears(): string[] {
    return Object.keys(this.monthlyDataByYear);
  }

  get availableCities(): string[] {
    return this.cities;
  }

  toggleData() {
    this.isMonthly = !this.isMonthly;
    this.chartOptions = {};

    setTimeout(() => {
      if (this.isMonthly) {
        this.setChartOptions(this.monthlyDataByYear[this.selectedYear][this.selectedCity], 'Monthly');
      } else {
        this.setChartOptions(this.yearlyData[this.selectedCity], 'Yearly');
      }
    }, 100);
  }

  onYearChange(event: any) {
    this.selectedYear = event.target.value;
    this.chartOptions = {};

    setTimeout(() => {
      this.setChartOptions(this.monthlyDataByYear[this.selectedYear][this.selectedCity], 'Monthly');
    }, 100);
  }

  onCityChange(event: any) {
    this.selectedCity = event.target.value;
    this.chartOptions = {};

    setTimeout(() => {
      if (this.isMonthly) {
        this.setChartOptions(this.monthlyDataByYear[this.selectedYear][this.selectedCity], 'Monthly');
      } else {
        this.setChartOptions(this.yearlyData[this.selectedCity], 'Yearly');
      }
    }, 100);
  }


  setChartOptions(dataPoints: any, dataType: string) {
    const chartColor = dataType === 'Yearly' ? '#90EE90' : '#ff5733'; // Light green for yearly, default color for monthly
    const chartTitle = dataType === 'Yearly'
      ? `${this.selectedCity} Yearly Temperature Data`
      : `${this.selectedCity} Monthly Temperature Data`; // Adjusted title based on data type

    this.chartOptions = {
      title: { text: chartTitle },
      theme: "light2",
      animationEnabled: true,
      exportEnabled: false,  // Disabling export options
      credit: false,         // Removing the CanvasJS logo
      axisY: {
        includeZero: false,
        title: "Temperature (°C)"
      },
      data: [{
        type: "column",       // Column chart type
        color: chartColor,    // Dynamically changing the color based on data type
        dataPoints: dataPoints // Dynamically passing the dataPoints
      }]
    };
  }


}

