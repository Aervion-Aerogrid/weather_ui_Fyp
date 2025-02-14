import { Component } from '@angular/core';

@Component({
  selector: 'app-forcast',
  templateUrl: './forcast.component.html',
  styleUrls: ['./forcast.component.css']
})
export class ForcastComponent {
  chartOptions = {
    theme: "light2",
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text: "AI Forecasting: Global Temperature Trends"
    },
    axisY: {
      title: "Temperature Anomaly (°C)",
      suffix: "°C",
      labelFormatter: (e: any) => e.value.toFixed(2) + "°C"
    },
    data: [{
      type: "line",
      xValueFormatString: "YYYY",
      yValueFormatString: "#.##°C",
      dataPoints: this.generatePredictions()
    }]
  };

  // Function to generate future predictions based on trend analysis
  generatePredictions() {
    let historicalData = [
      { x: new Date(1980, 0, 1), y: 0.18 },
      { x: new Date(1990, 0, 1), y: 0.33 },
      { x: new Date(2000, 0, 1), y: 0.45 },
      { x: new Date(2010, 0, 1), y: 0.62 },
      { x: new Date(2020, 0, 1), y: 0.98 } // Last known data point
    ];

    // Calculate the average rate of increase per decade
    let totalIncrease = historicalData[historicalData.length - 1].y - historicalData[0].y;
    let yearsCovered = (historicalData[historicalData.length - 1].x.getFullYear() - historicalData[0].x.getFullYear());
    let avgIncreasePerYear = totalIncrease / yearsCovered;

    // Generate predictions for the next 10 years
    let futureData = [...historicalData];
    let lastYear = historicalData[historicalData.length - 1].x.getFullYear();
    let lastValue = historicalData[historicalData.length - 1].y;

    for (let i = 1; i <= 10; i++) {
      futureData.push({
        x: new Date(lastYear + i, 0, 1),
        y: lastValue + avgIncreasePerYear * i
      });
    }

    return futureData;
  }
}

