import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { GisComponent } from './components/gis/gis.component';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { AuthGuard } from './guards/auth.guard'; // Import the AuthGuard
import { PinGuard } from './guards/pin.guard';
import { ClimatepageComponent } from './components/climatepage/climatepage.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SignuppageComponent } from './components/signuppage/signuppage.component';
import { SecretPinComponent } from './components/loginpage/secretpin/secretpin.component';

const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'login', component: LoginpageComponent },
  { path: 'signup',component: SignuppageComponent,canActivate: [PinGuard]},
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard] },
 // { path: 'visualization', component: VisualizationComponent, canActivate: [AuthGuard] },
  //{ path: 'gis', component: GisComponent, canActivate: [AuthGuard] },
 // {path :'climate',component: ClimatepageComponent,canActivate: [AuthGuard] },
 // {path: 'setting',component: SettingsComponent,canActivate: [AuthGuard] },
  { path: 'secretpin', component: SecretPinComponent },
];

/*
const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' }, // Redirect to homepage instead of login
  // { path: 'login', component: LoginpageComponent }, // Temporarily disable login route
  { path: 'homepage', component: HomepageComponent }, // Remove AuthGuard for now
//  { path: 'visualization', component: VisualizationComponent }, // Remove AuthGuard for now
  //{ path: 'gis', component: GisComponent }, // Remove AuthGuard for now
//  {path :'climate',component: ClimatepageComponent},
 // {path: 'setting',component: SettingsComponent}
];
*/
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule{}
