import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DrawerPageComponent } from '../drawer-page/drawer-page.component';

@Component({
  selector: 'app-drawer-icon',
  templateUrl: './drawer-icon.component.html',
  styleUrls: ['./drawer-icon.component.css']
})
export class DrawerIconComponent implements AfterViewInit {  // ✅ Implements AfterViewInit
  @ViewChild('drawerPage') drawerPageComponent!: DrawerPageComponent; // ✅ Use template reference


  ngAfterViewInit() {
    if (!this.drawerPageComponent) {
      console.error('DrawerPageComponent not found!');
    }
  }

  toggleDrawer() {
    if (this.drawerPageComponent) {
      this.drawerPageComponent.toggleDrawer();
    } else {
      console.error('DrawerPageComponent not found!');
    }
  }
}
