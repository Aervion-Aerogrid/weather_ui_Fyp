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

  constructor(private imageService: IsobarImageDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageType'] && changes['imageType'].currentValue) {
      this.fetchImages();
    }
  }

  fetchImages(): void {
    this.loading = true;

    // Check if the new image type is different from the previous one
    if (this.imageType) {
      this.imageService.getIsobarData(this.imageType).subscribe({
        next: (data) => {
          console.log('Received data:', data);

          // Assuming the images from the backend have 'url' but not 'name'
          if (data && data.layer_image_url && data.heatmap_image_url) {
            const newImages = [
              { url: data.layer_image_url, name: this.extractFileName(data.layer_image_url) },
              { url: data.heatmap_image_url, name: this.extractFileName(data.heatmap_image_url) }
            ];

            // Append new images to the existing images array
            this.images = [...this.images, ...newImages];  // Optionally replace the entire array instead of appending
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
    // Extract file name from the URL
    return url.split('/').pop() || 'default_image.jpg'; // Fallback to 'default_image.jpg' if URL is malformed
  }

  openImageInPopup(image: { url: string; name: string }): void {
    // Open a new window with the image
    const popup = window.open('', '_blank', 'width=600,height=400');

    // Add the image and download link to the popup
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






