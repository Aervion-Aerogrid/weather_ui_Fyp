import { Component, OnInit, ViewChild } from '@angular/core';
import {DrawerPageComponent} from '../../../shared/components/drawer-page/drawer-page.component';
import { AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  isExpanded = false;

  locations = [
    {
      name: 'Karachi',
      image: '../../../../assets/icons/karachi.jpeg',
      link: 'https://maps.google.com/?q=Pakistan+Meteorological+Department+Karachi'
    },
    {
      name: 'Lahore',
      image: '../../../../assets/icons/lahore.jpg',
      link: 'https://maps.google.com/?q=Pakistan+Meteorological+Department+Lahore'
    },
    {
      name: 'Islamabad',
      image: '../../../../assets/icons/islamabad.jpg',
      link: 'https://maps.google.com/?q=Pakistan+Meteorological+Department+Islamabad'
    },
    {
      name: 'Peshawar',
      image: '../../../../assets/icons/peshawar.jpg',
      link: 'https://maps.google.com/?q=Pakistan+Meteorological+Department+Peshawar'
    },
    {
      name: 'Quetta',
      image: '../../../../assets/icons/quetta.jpg',
      link: 'https://maps.google.com/?q=Pakistan+Meteorological+Department+Quetta'
    },
    {
      name: 'Gilgit',
      image: '../../../../assets/icons/gilgit.jpg',
      link: 'https://maps.google.com/?q=Pakistan+Meteorological+Department+Gilgit'
    },
    {
      name: 'Hyderabad',
      image: '../../../../assets/icons/hyderabad.jpg',
      link: 'https://maps.google.com/?q=Pakistan+Meteorological+Department+Hyderabad'
    },
    {
      name: 'Sukkur',
      image: '../../../../assets/icons/sukkur.jpg',
      link: 'https://maps.google.com/?q=Pakistan+Meteorological+Department+Sukkur'
    },
    {
      name: 'Faisalabad',
      image: '../../../../assets/icons/faisalabad.jpg',
      link: 'https://maps.google.com/?q=Pakistan+Meteorological+Department+Faisalabad'
    },

  ];

  toggleLocations() {
    this.isExpanded = !this.isExpanded;
  }
  filteredLocations = [...this.locations]; // Store filtered locations
  displayedLocations = this.filteredLocations.slice(0, 3); // Show first 3 initially
  locationsToShow = 3; // How many to show at a time

  filterLocations(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredLocations = this.locations.filter(loc =>
      loc.name.toLowerCase().includes(searchValue)
    );
    this.displayedLocations = this.filteredLocations.slice(0, this.locationsToShow);
  }

  loadMore() {
    const currentLength = this.displayedLocations.length;
    this.displayedLocations = this.filteredLocations.slice(0, currentLength + 3);
  }


}
