import { Component, OnInit } from '@angular/core';
import { IsobarImageDataService } from '../../../services/image/isobar-image-data.service';

@Component({
  selector: 'app-printing',
  templateUrl: './printing.component.html',
  styleUrls: ['./printing.component.css']
})
export class PrintingComponent implements OnInit {
  svgImages: { type: string; base64: string }[] = [];
  imageTypes: string[] = [
    'isobars_merged',
    'isotherms_merged',
    'isodrosotherms_merged',
    'isogons_merged',
    'isohumes_merged',
    'isohyets_merged',
    'isonephs_merged',
    'isotachs_merged'
  ];

  loading = false;
  currentLoadingIndex: number | null = null;
  lastLoadedIndex: number | null = null;

  constructor(private imageService: IsobarImageDataService) {}

  ngOnInit() {}

  loadImages() {
    this.loading = true;
    this.svgImages = [];
    this.currentLoadingIndex = 0;
    this.lastLoadedIndex = null;

    let index = 0;
    const loadNextImage = () => {
      if (index < this.imageTypes.length) {
        this.currentLoadingIndex = index; // Mark current image as loading

        const type = this.imageTypes[index];
        this.imageService.getSvgData(type).subscribe(
          (svgContent) => {
            const base64String = btoa(unescape(encodeURIComponent(svgContent))); // Convert to Base64
            this.svgImages.push({ type, base64: base64String });

            this.lastLoadedIndex = index; // Mark as successfully loaded
            this.currentLoadingIndex = null; // Remove red border

            index++;
            setTimeout(loadNextImage, 1000); // Load next image after 1s
          },
          (error) => {
            console.error(`Error loading ${type} image`, error);
            this.currentLoadingIndex = null; // Remove red border on error
            index++;
            setTimeout(loadNextImage, 1000);
          }
        );
      } else {
        this.loading = false;
        this.currentLoadingIndex = null;
        this.lastLoadedIndex = null;
      }
    };

    loadNextImage();
  }

  printImage(base64: string) {
    const newWindow = window.open('');
    if (newWindow) {
      newWindow.document.write(`
        <html>
        <head>
          <title>Print SVG Image</title>
          <style>
            @page {
              size: landscape;
            }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            img {
              width: 100%;
              max-width: 90%;
            }
          </style>
        </head>
        <body>
          <img src="data:image/svg+xml;base64,${base64}" />
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); }
            };
          </script>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  }
}
