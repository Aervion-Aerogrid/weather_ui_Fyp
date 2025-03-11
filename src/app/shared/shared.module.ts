import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderPageComponent } from './components/header-page/header-page.component';
import { DrawerPageComponent } from './components/drawer-page/drawer-page.component';



@NgModule({
  declarations: [
    HeaderPageComponent,
    DrawerPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderPageComponent,
    DrawerPageComponent
  ]
})
export class SharedModule { }
