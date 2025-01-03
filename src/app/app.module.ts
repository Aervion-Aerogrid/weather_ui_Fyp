import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GisComponent } from './components/gis/gis.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { HeaderpageComponent } from './components/headerpage/headerpage.component';
import { FooterpageComponent } from './components/footerpage/footerpage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { DrawerpageComponent } from './components/drawerpage/drawerpage.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { CsvDataService } from './services/csv/csv-data.service';
import { IsobarImageDataService } from './services/image/isobar-image-data.service';
import { MapComponent } from './components/map/map.component';
import { FormsModule } from '@angular/forms';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { SignuppageComponent } from './components/signuppage/signuppage.component';
import { AuthService } from './services/login/auth.service';
import { HeaderComponent } from './components/loginpage/header/header.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ClimatepageComponent } from './components/climatepage/climatepage.component';
import { BarGraphComponent } from './components/bar-graph/bar-graph.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import this module
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SecretPinComponent } from './components/loginpage/secretpin/secretpin.component';
import { DetailComponent } from './components/map/detail/detail.component';
import { ImageDownloadComponent } from './components/map/image-download/image-download.component';




@NgModule({
  declarations: [
    AppComponent,
    GisComponent,
    HomepageComponent,
    HeaderpageComponent,
    FooterpageComponent,
    VisualizationComponent,
    DrawerpageComponent,
    MapComponent,
    LoginpageComponent,
    SignuppageComponent,
    HeaderComponent,
    SettingsComponent,
    ClimatepageComponent,
    BarGraphComponent,
    SecretPinComponent,
    DetailComponent,
    ImageDownloadComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatGridListModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  providers: [CsvDataService, IsobarImageDataService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
