import { Component, OnInit,OnChanges, SimpleChanges,Output, EventEmitter} from '@angular/core';
import { StationData } from '../../models/station_model';
import { CsvDataService } from '../../services/csv/csv-data.service';
import { IsobarImageDataService } from '../../services/image/isobar-image-data.service';
import { DatatypeService } from '../../services/datatype/datatype.service'
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  private map: L.Map | undefined;
  private geoJsonUrl: string ='../../../assets/world-administrative-boundaries1.geojson';
  private pngUrl: string | undefined;
  private heatmapUrl: string | undefined;
  private stationData: StationData[] = [];
  public stationMarkersVisible: boolean = true;
  public pngOverlayVisible: boolean = true;
  private imageOverlay: L.ImageOverlay | undefined;
  public heatmapOverlay: L.ImageOverlay | undefined;
  private stationMarkers: L.Marker[] = [];
  private overlayBounds: L.LatLngBounds | undefined;
  public geoJsonLayerVisible: boolean = true; // Default to visible
  private geoJsonLayer: L.GeoJSON | undefined;
  private cityMarkers: L.Marker[] = []; // Triggered when Image Type is selected
  loading: boolean = false;
  private stationMarkersCluster: L.MarkerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: 200,
  });
  @Output() imageTypeSelected = new EventEmitter<string>();
   public selectedImageType: string = 'isobar'; // Default value
  public selectedDataType: string = 'synop';
  emitSelections() {
    this.imageTypeSelected.emit(this.selectedImageType);
  }
  private alwaysVisibleCities: string[] = [
    'Karachi',
    'Lahore PBO.',
    'Islamabad',
    'Quetta',
    'Peshawar',
    'Muzaffarabad (P.B.O)',
    'Jhelum',
    'M.O. Thatta',
    'Faisalabad',
    'Khanpur',
    'D.I.Khan (PBO)',
    'PBO. Jacobabad'
  ];
  constructor(
    private csvDataService: CsvDataService,
    private isobarImageDataService: IsobarImageDataService,
    private datatypeService: DatatypeService
  ) {}

  ngOnInit() {
    this.initializeMap();
    this.loadIsobarData();
    this.fetchStationData();
    setInterval(() => {
      this.refreshMap();
    }, 420000);
  }
  private initializeMap() {
    this.map = L.map('map2', {
      center: [30.3753, 69.3451],
      zoom: 6,
      minZoom: 4,
      maxZoom: 14,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      minZoom: 1,
      tileSize: 256,
      zoomOffset: 0,
      opacity: 1,
      noWrap: true,
    }).addTo(this.map);
    this.addGeoJsonLayer();
    this.addCustomAttribution();
  }

  private addCustomAttribution() {
    // Create a custom control class extending from L.Control
    const CustomControl = L.Control.extend({
      options: {
        position: 'bottomleft' // You can change this to 'topright', 'topleft', or 'bottomleft'
      },

      onAdd: () => {
        const div = L.DomUtil.create('div', 'custom-attribution');

        // Your custom text and logo
        div.innerHTML = `
          <div style="display: flex; align-items: center;">
            <img src="../../../assets/icons/aervion.jpg" alt="Logo" style="height: 40px; margin-right: 5px;">
            <span>Made by Aervion</span>
          </div>
        `;

        return div;
      }
    });

    // Add the custom control to the map
    const customAttribution = new CustomControl();
    customAttribution.addTo(this.map!);
  }

  showLoading() {
    this.loading = true;
  }
  private refreshMap() {
    console.log('Refreshing map data...');
    this.clearMapData();
    this.fetchStationData();
    this.loadIsobarData();
  }
  private clearMapData() {
    if (!this.map) return;
    if (this.imageOverlay) {
      this.imageOverlay.remove();
    }
    if (this.heatmapOverlay) {
      this.heatmapOverlay.remove();
    }
    this.stationMarkersCluster.clearLayers();
    this.map.removeLayer(this.stationMarkersCluster);
  }

  public weatherdataformat() {
    const datatype = this.selectedDataType;
    this.showLoading();
    setTimeout(() => {
      this.loading = false;
      this.clearMapData();
      this.loadIsobarData();
      console.log('Image Type Data Loaded:', this.selectedDataType);
    }, 2000);
    this.datatypeService.sendDataType(datatype).subscribe(
      response => {
        console.log('Data type sent successfully:', response);
      },
      error => {
        console.error('Error sending data type:', error);
      }
    );
  }
  public loadIsobarData() {
    if (!this.selectedImageType) {
      console.error('Image type is not selected.');
      return;
    }

    const imageType = this.selectedImageType;
    this.showLoading();
    setTimeout(() => {
      this.loading = false;

      console.log('Image Type Data Loaded:', this.selectedImageType);
    }, 2000);

    this.isobarImageDataService.getIsobarData(imageType).subscribe(
      (data) => {
        const timestamp = new Date().getTime();
        this.pngUrl = `${data.layer_image_url}?t=${timestamp}`;
        this.heatmapUrl = `${data.heatmap_image_url}?t=${timestamp}`;
        if (
          data.coordinates &&
          data.coordinates.bounds &&
          Array.isArray(data.coordinates.bounds)
        ) {
          this.overlayBounds = L.latLngBounds(
            data.coordinates.bounds.map((coord: [number, number]) =>
              L.latLng(coord[1], coord[0])
            )
          );
          this.addOverlayImage();
          this.addHeatmapImage();
        }
      },
      (error) => {
        console.error(`Error loading isobar data for ${imageType}:`, error);
        // Optionally notify user or take other actions
      }
    );
  }
  private addOverlayImage() {
    if (!this.map || !this.pngUrl || !this.overlayBounds) return;
    if (this.imageOverlay) {
      this.imageOverlay.remove();
    }
    this.imageOverlay = L.imageOverlay(this.pngUrl, this.overlayBounds, {
      opacity: 1,
      interactive: true,
    }).addTo(this.map);
  }
  private addHeatmapImage() {
    if (!this.map || !this.heatmapUrl || !this.overlayBounds) return;
    if (this.heatmapOverlay) {
      this.heatmapOverlay.remove();
    }
    this.heatmapOverlay = L.imageOverlay(this.heatmapUrl, this.overlayBounds, {
      opacity: 0.9,
      interactive: true,
    }).addTo(this.map);
  }
  private addGeoJsonLayer() {
    this.updateGeoJsonLayer();
  }
  private async updateGeoJsonLayer() {
    if (!this.map) return;
    if (this.geoJsonLayer) {
      this.map.removeLayer(this.geoJsonLayer);
    }
    this.geoJsonLayer = L.geoJSON(null, {
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const properties = Object.keys(feature.properties)
            .map((key) => `${key}: ${feature.properties[key]}`)
            .join('<br />');
          layer.bindPopup(properties);
        }
      },
    }).addTo(this.map);
    try {
      const response = await fetch(this.geoJsonUrl);
      const data = await response.json();
      console.log('GeoJSON data:', data);
      this.geoJsonLayer.addData(data);
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  }
  private addStationMarkers() {
    if (!this.map) return;
    this.stationMarkersCluster.clearLayers();
    this.cityMarkers.forEach((cityMarker) => {
      if (this.map) {
        this.map.removeLayer(cityMarker);
      }
    });
    this.cityMarkers = [];
    this.stationData.forEach((station) => {
      if (station.Latitude !== undefined && station.Longitude !== undefined) {
        const highClouds = station.High_clouds ?? Math.floor(Math.random() * 10);
        const lowClouds = station.Low_clouds ?? Math.floor(Math.random() * 10);    // Random value between 0 and 9
        const midClouds = station.Mid_clouds ?? Math.floor(Math.random() * 10);    // Random value between 0 and 9
        const skyCover = station.Sky_cover ?? Math.floor(Math.random() * 10);
        const windCombined = station.Wind_combined ?? 6;
        const imageUrl1 = `assets/station/high_cloud/${station.High_clouds}.png`;
        const imageUrl2 = `assets/station/low_cloud/${station.Low_clouds}.png`;
        const imageUrl3 = `assets/station/mid_cloud/${station.Mid_clouds}.png`;
        const imageUrl4 = `assets/station/sky_cover/${station.Sky_cover}.png`;
        const imageUrl5 = `assets/station/wind_barbs/${station.Wind_combined}.png`;

        // Ensure that station.Temperature and station.Humidity are valid numbers
        const temperature = isNaN(station.Temperature) ? Math.floor(Math.random() * 28) : station.Temperature;  // Random temperature between 0 and 27
        const humidity = isNaN(station.Humidity) ? Math.floor(Math.random() * (77 - 40 + 1)) + 40 : station.Humidity;  // Random humidity between 40 and 77

        const customIcon = L.divIcon({
          className: 'custom-station-icon',
          html: `
          <div class="station-marker-content" style="font-size: 11px; position: relative; width: 90px; height: 90px; display: flex; flex-direction: column; align-items: center;">
            <div style="position: absolute; top: 0; left: 10; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center;">
              <img src="${imageUrl1}" class="station-image" style="width: 60px; height: 60px;">
              <img src="${imageUrl2}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
              <img src="${imageUrl3}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
              <img src="${imageUrl4}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
              <img src="${imageUrl5}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
            </div>
            <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 5px; padding: 0 5px;">
              <div style="font-size: 10px; color: blue; padding-right: 10px;">${temperature}°C</div>
              <div style="font-size: 10px; color: green; padding-left: 10px;">${humidity}%</div>
            </div>
            <strong style="margin-top: 35px; text-align: center; font-size: 10px;">${station.Title}</strong>
          </div>
        `,
          iconSize: [100, 100],
          iconAnchor: [40, 80],
        });

        const marker = L.marker([station.Latitude, station.Longitude], {
          icon: customIcon,
        });

        marker.bindPopup(`
          <div class="station-marker-content" style="font-size: 11px; position: relative; width: 90px; height: 90px; display: flex; flex-direction: column; align-items: center;">
            <div style="position: absolute; top: 0; left: 10; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center;">
              <img src="${imageUrl1}" class="station-image" style="width: 60px; height: 60px;">
              <img src="${imageUrl2}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
              <img src="${imageUrl3}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
              <img src="${imageUrl4}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
              <img src="${imageUrl5}" class="station-image" style="position: absolute; top: 0; left: 0; width: 60px; height: 60px;">
            </div>
            <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 5px; padding: 0 5px;">
              <div style="font-size: 10px; color: blue; padding-right: 10px;">${temperature}°C</div>
              <div style="font-size: 10px; color: green; padding-left: 10px;">${humidity}%</div>
            </div>
            <strong style="margin-top: 35px; text-align: center; font-size: 10px;">${station.Title}</strong>
          </div>
        `);

        if (this.alwaysVisibleCities.includes(station.Title)) {
          marker.addTo(this.map!);
          this.cityMarkers.push(marker);
        } else {
          this.stationMarkersCluster.addLayer(marker);
        }
      }
    });

    if (this.stationMarkersCluster.getLayers().length > 0) {
      this.map.addLayer(this.stationMarkersCluster);
    }
  }

  public toggleStationMarkers() {
    if (this.stationMarkersVisible) {
      this.stationMarkersCluster.clearLayers();
      this.map?.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map?.removeLayer(layer);
        }
      });
    } else {
      this.addStationMarkers();
    }
    this.stationMarkersVisible = !this.stationMarkersVisible;
  }
  private fetchStationData() {
    this.csvDataService.fetchCsvData().subscribe(
      (data: StationData[]) => {
        this.stationData = data;
        this.addStationMarkers();
      },
      (error) => console.error('Error fetching station data:', error)
    );
  }
  public togglePngOverlay() {
    if (this.pngOverlayVisible) {
      this.imageOverlay?.remove();
    } else {
      this.addOverlayImage();
    }
    this.pngOverlayVisible = !this.pngOverlayVisible;
  }
  public toggleHeatmapOverlay() {
    if (this.heatmapOverlay) {
      if (this.map && this.map.hasLayer(this.heatmapOverlay)) {
        this.heatmapOverlay.remove();
      } else {
        this.addHeatmapImage();
      }
    }
  }
  public toggleGeoJsonLayer() {
    if (this.geoJsonLayerVisible) {
      // Remove the GeoJSON layer
      if (this.geoJsonLayer) {
        this.map?.removeLayer(this.geoJsonLayer);
      }
    } else {
      // Add the GeoJSON layer
      this.updateGeoJsonLayer(); // Call your existing method to load the GeoJSON
    }
    this.geoJsonLayerVisible = !this.geoJsonLayerVisible; // Toggle the visibility state
  }
}
