import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// CORE MODULES
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

// COMPONENTS
import { HomepageComponent } from './components/homepage/homepage.component';
import { HeaderpageComponent } from './components/headerpage/headerpage.component';
import { FooterpageComponent } from './components/footerpage/footerpage.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { DrawerpageComponent } from './components/drawerpage/drawerpage.component';
import { MapComponent } from './components/map/map.component';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { SignuppageComponent } from './components/signuppage/signuppage.component';
import { HeaderComponent } from './components/loginpage/header/header.component';
import { ClimatepageComponent } from './components/climatepage/climatepage.component';
import { BarGraphComponent } from './components/bar-graph/bar-graph.component';
import { SecretPinComponent } from './components/loginpage/secretpin/secretpin.component';
import { DetailComponent } from './components/map/detail/detail.component';
import { ImageDownloadComponent } from './components/map/image-download/image-download.component';
import { ForcastComponent } from './components/forcast/forcast.component';

// MATERIAL MODULES
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import this module
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// SERVICES
import { CsvDataService } from './services/csv/csv-data.service';
import { IsobarImageDataService } from './services/image/isobar-image-data.service';

// AUTHENTICATION
import { AuthService } from './services/login/auth.service';

// DEPENDENCIES
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ReportDownloadComponent } from './components/map/report-download/report-download.component';
import { BotComponent } from './components/bot/bot.component';
import { MonthBarComponent } from './components/month-bar/month-bar.component';
import { ClimateReportComponent } from './components/climatepage/climate-report/climate-report.component';
import { SvgEditComponent } from './components/svg-edit/svg-edit.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HeaderpageComponent,
    FooterpageComponent,
    VisualizationComponent,
    DrawerpageComponent,
    MapComponent,
    LoginpageComponent,
    SignuppageComponent,
    HeaderComponent,
    ClimatepageComponent,
    BarGraphComponent,
    SecretPinComponent,
    DetailComponent,
    ImageDownloadComponent,
    ForcastComponent,
    ReportDownloadComponent,
    BotComponent,
    MonthBarComponent,
    ClimateReportComponent,
    SvgEditComponent,
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
    RouterModule,
    MatButtonModule,
    CanvasJSAngularChartsModule,
    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    SharedModule,
  ],
  providers: [CsvDataService, IsobarImageDataService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
