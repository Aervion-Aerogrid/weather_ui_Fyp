import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IsobarImageDataService } from '../../../services/image/isobar-image-data.service';

@Component({
  selector: 'app-image-download',
  templateUrl: './image-download.component.html',
  styleUrls: ['./image-download.component.css']
})
export class ImageDownloadComponent implements OnChanges {
  @Input() imageType: string = ''; // Input from parent (the type of image)
  images: { url: string; name: string }[] = []; // Store fetched images with names
  loading: boolean = false;
  downloadAsSvg: boolean = false; // Toggle for SVG or PNG download

  constructor(private imageService: IsobarImageDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageType'] && changes['imageType'].currentValue) {
      this.fetchImages();
    }
  }

  fetchImages(): void {
    this.loading = true;
    this.images = []; // Clear previous images

    if (this.imageType) {
      this.imageService.getIsobarData(this.imageType).subscribe({
        next: (data) => {
          console.log('Received data:', data);

          if (data && data.layer_image_url) {
            // If SVG is selected, fetch only layer_image_url
            if (this.downloadAsSvg) {
              this.images.push({
                url: data.layer_image_url.replace('.png', '.svg'), // Assuming backend provides SVG equivalent
                name: this.extractFileName(data.layer_image_url).replace('.png', '.svg')
              });
            } else {
              // Otherwise, fetch both layer and heatmap images in PNG format
              if (data.heatmap_image_url) {
                this.images.push({
                  url: data.heatmap_image_url,
                  name: this.extractFileName(data.heatmap_image_url)
                });
              }
              this.images.push({
                url: data.layer_image_url,
                name: this.extractFileName(data.layer_image_url)
              });
            }
          } else {
            console.error('Unexpected data structure:', data);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching images:', err);
          this.loading = false;
        }
      });
    }
  }

  extractFileName(url: string): string {
    return url.split('/').pop() || 'default_image.jpg'; // Extract filename from URL
  }

  openImageInPopup(image: { url: string; name: string }): void {
    const popup = window.open('', '_blank', 'width=600,height=400');
    popup?.document.write(`
      <html>
        <head>
          <title>Image Preview</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f8f9fa;
            }
            .download-btn {
              background-color: #28a745;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 5px;
              font-size: 16px;
              cursor: pointer;
            }
            .download-btn:hover {
              background-color: #218838;
            }
            img {
              width: 100%;
              height: auto;
              margin-top: 50px;
            }
          </style>
        </head>
        <body>
          <a href="${image.url}" download="${image.name}" class="download-btn">Download Image</a>
          <img src="${image.url}" alt="Image Preview" />
        </body>
      </html>
    `);
  }
}
