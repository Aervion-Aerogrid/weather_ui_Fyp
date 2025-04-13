import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate, CanActivateFn } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import {BotComponent} from './components/bot/bot.component';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { AuthGuard } from './guards/auth.guard'; // Import the AuthGuard
import { PinGuard } from './guards/pin.guard';
import { ClimatepageComponent } from './components/climatepage/climatepage.component';
import { SignuppageComponent } from './components/signuppage/signuppage.component';
import { SecretPinComponent } from './components/loginpage/secretpin/secretpin.component';
import { SvgEditComponent } from './components/svg-edit/svg-edit.component';
/*
const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'login', component: LoginpageComponent },
  { path: 'signup',component: SignuppageComponent,canActivate: [PinGuard]},
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard] },
  { path: 'visualization', component: VisualizationComponent, canActivate: [AuthGuard] },
  {path :'climate',component: ClimatepageComponent,canActivate: [AuthGuard] },
  {path: 'setting',component: SettingsComponent,canActivate: [AuthGuard] },
  { path: 'secretpin', component: SecretPinComponent },
   {path: 'bot',component: BotComponent,canActivate: [AuthGuard]},
  {path: 'svg-edit',component: SvgEditComponent,canActivate: [AuthGuard]}
];
*/

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'login', component: LoginpageComponent },
  { path: 'signup', component: SignuppageComponent, canActivate: [PinGuard] },
  { path: 'homepage', component: HomepageComponent,canActivate: [AuthGuard] },
  //{ path: 'visualization', component: VisualizationComponent, canActivate: [AuthGuard] },
  { path: 'climate', component: ClimatepageComponent, canActivate: [AuthGuard] },
  //{ path: 'bot', component: BotComponent, canActivate: [AuthGuard] },
  { path: 'svg-edit', component: SvgEditComponent, canActivate: [AuthGuard] },
  { path: 'secretpin', component: SecretPinComponent },
  { path: 'setting', loadChildren: () => import('./components/setting-module/setting-module.module').then(m => m.SettingModuleModule), canActivate: [AuthGuard] },
  { path: 'error', loadChildren: () => import('./components/error-module/error-module.module').then(m => m.ErrorModuleModule), canActivate: [AuthGuard] },
   { path: 'printing', loadChildren: () => import('./components/printing-module/printing-module.module').then(m => m.PrintingModuleModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/error' }
];

/*
const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },
  { path: 'visualization', component: VisualizationComponent},
  { path: 'climate', component: ClimatepageComponent},
  { path: 'bot', component: BotComponent },
  { path: 'svg-edit', component: SvgEditComponent},
  { path: 'setting', loadChildren: () => import('./components/setting-module/setting-module.module').then(m => m.SettingModuleModule)},
  { path: 'error', loadChildren: () => import('./components/error-module/error-module.module').then(m => m.ErrorModuleModule) },
  { path: 'printing', loadChildren: () => import('./components/printing-module/printing-module.module').then(m => m.PrintingModuleModule) },
  { path: '**', redirectTo: '/error' }
];
*/

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule{}
