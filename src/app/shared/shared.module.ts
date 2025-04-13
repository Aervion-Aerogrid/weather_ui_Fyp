import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderPageComponent } from './components/header-page/header-page.component';
import { DrawerPageComponent } from './components/drawer-page/drawer-page.component';
import { DrawerIconComponent } from './components/drawer-icon/drawer-icon.component';



@NgModule({
  declarations: [
    HeaderPageComponent,
    DrawerPageComponent,
    DrawerIconComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    HeaderPageComponent,
    DrawerPageComponent,
    DrawerIconComponent,
  ]
})
export class SharedModule { }
