import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
interface CityData {
  city: string;
  value: number;
  year?: number;  // Optional year field for yearly data
  month?: string; // Optional month field for monthly data
}

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.css']
})
export class BarGraphComponent implements AfterViewInit {
  private dailyData: CityData[] = [
    { city: 'karachi', value: 70, month: 'January' },
    { city: 'lahore', value: 80, month: 'January' },
    { city: 'peshawar', value: 60, month: 'January' },
    { city: 'quetta', value: 50, month: 'January' },
    { city: 'islamabad', value: 40, month: 'January' },
    { city: 'multan', value: 30, month: 'January' },
    { city: 'sialkot', value: 25, month: 'January' },
    { city: 'faisalabad', value: 55, month: 'January' }
  ];

  private monthlyData: CityData[] = [
    { city: 'karachi', value: 75, month: 'January'},
    { city: 'lahore', value: 85, month: 'January'},
    { city: 'peshawar', value: 65, month: 'January'},
    { city: 'quetta', value: 55, month: 'January'},
    { city: 'islamabad', value: 45, month: 'January'},
    { city: 'multan', value: 35, month: 'January'},
    { city: 'sialkot', value: 30, month: 'January'},
    { city: 'faisalabad', value: 60, month: 'January'}
  ];

  private yearlyData: CityData[] = [
    { city: 'karachi', value: 80, year: 2024 },
    { city: 'lahore', value: 90, year: 2025 },
    { city: 'peshawar', value: 70, year: 2023 },
    { city: 'quetta', value: 60, year: 2020 },
    { city: 'islamabad', value: 50, year: 2019 },
    { city: 'multan', value: 40, year: 2019 },
    { city: 'sialkot', value: 35, year: 2025 },
    { city: 'faisalabad', value: 65, year: 2024 }
  ];

  allCities = this.dailyData; // Available cities
  selectedCities: string[] = this.allCities.map(city => city.city); // Default: All cities

  private data: CityData[] = this.dailyData; // Default dataset
  private barColor: string = 'steelblue'; // Default bar color
  private margin = { top: 60, right: 30, bottom: 70, left: 60 };
  private width = 400 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createSvg();
      this.updateGraph();
    }, 0);
  }

  setData(mode: string) {
    switch (mode) {
      case 'daily':
        this.data = this.dailyData;
        this.barColor = 'steelblue'; // Bar color for daily data
        break;
      case 'monthly':
        this.data = this.monthlyData;
        this.barColor = 'orange'; // Bar color for monthly data
        break;
      case 'yearly':
        this.data = this.yearlyData;
        this.barColor = 'green'; // Bar color for yearly data
        break;
      default:
        this.data = this.dailyData;
        this.barColor = 'steelblue'; // Default bar color
    }
    this.updateGraph();
  }

  onCitySelectionChange(city: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCities.push(city);
    } else {
      this.selectedCities = this.selectedCities.filter(selectedCity => selectedCity !== city);
    }
    this.updateGraph();
  }

  private createSvg(): void {
    d3.select('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);
  }

  private updateGraph(): void {
    const svg = d3.select('svg');
    svg.selectAll('*').remove(); // Clear existing graph

    const filteredData = this.data.filter(d => this.selectedCities.includes(d.city));

    const xScale = d3.scaleBand<string>()
      .domain(filteredData.map(d => d.city))
      .range([0, this.width + 170])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.value) || 100])
      .range([this.height, 0]);

    // Create a tooltip div that will be used to show the values on hover
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('display', 'none');  // Hidden by default

    // Draw X axis
    svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .attr('transform', 'rotate(30)')
      .attr('text-anchor', 'start');
// Add label to X axis
svg.append('text')
  .attr('transform', `translate(${this.margin.left + this.width / 2 +80 }, ${this.margin.top + this.height + 80})`)
  .style('text-anchor', 'middle')
  .style('font-size', '16px')
  .text('Cities');
    // Draw Y axis
    svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(yScale));
  // Add label to Y axis
svg.append('text')
.attr('transform', 'rotate(-90)')
.attr('y', this.margin.left - 30)
.attr('x', -this.margin.top - this.height / 2)
.style('text-anchor', 'middle')
.style('font-size', '16px')
.text('Temperature (°C)');
    // Draw bars
    svg.selectAll('rect')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('x', d => this.margin.left + xScale(d.city)! )
      .attr('y', d => this.margin.top + yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => this.height - yScale(d.value))
      .attr('fill', this.barColor) // Use the dynamic bar color
      .on('mouseover', function(event, d) {
        tooltip.transition()
          .duration(200)
          .style('display', 'inline');  // Show tooltip
        tooltip.html(`${d.city}: ${d.value}°C
          <br>${d.month ? `Month: ${d.month}` : ''}
          ${d.year ? `<br>Year: ${d.year}` : ''}`) // Tooltip content
          .style('left', `${event.pageX + 5}px`)    // Position tooltip horizontally
          .style('top', `${event.pageY - 35}px`);   // Position tooltip vertically
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(200)
          .style('display', 'none');  // Hide tooltip
      });
  }
}
