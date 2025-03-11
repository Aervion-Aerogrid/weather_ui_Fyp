import { Component, OnInit, ViewChild } from '@angular/core';
import {DrawerPageComponent} from '../../../shared/components/drawer-page/drawer-page.component';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  @ViewChild(DrawerPageComponent) drawerPageComponent!: DrawerPageComponent;
  ngAfterViewInit() {
    // Access drawerPageComponent here
    if (!this.drawerPageComponent) {
      console.error('DrawerPageComponent not found!');
    }
  }

  toggleDrawer() {
    if (this.drawerPageComponent) {
      this.drawerPageComponent.toggleDrawer(); // Toggle drawer open/close
    } else {
      console.error('DrawerPageComponent not found!');
    }
  }
  public temperatureUnit: string = 'Celsius'; // Default value
  public selectedCity: string = 'Karachi'; // Default city
  public weatherAlerts: boolean = true; // Default to enabled

  public cities: string[] = ['Karachi', 'Lahore', 'Islamabad', 'Quetta', 'Peshawar'];

  constructor() {}

  ngOnInit(): void {}

  saveSettings() {
    // Save settings logic here (e.g., to a service or local storage)
    console.log('Settings Saved:', {
      temperatureUnit: this.temperatureUnit,
      selectedCity: this.selectedCity,
      weatherAlerts: this.weatherAlerts
    });
  }

}
