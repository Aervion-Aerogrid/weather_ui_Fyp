import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { DrawerpageComponent } from '../drawerpage/drawerpage.component';
import { ActivatedRoute } from '@angular/router';
import { IsobarImageDataService } from '../../services/image/isobar-image-data.service'; // Adjust the path as needed
import { OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NumberDialogComponent } from './number-dialog/number-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-svg-edit',
  templateUrl: './svg-edit.component.html',
  styleUrls: ['./svg-edit.component.css'],
})
export class SvgEditComponent implements AfterViewInit {
  selectedImageType: string = 'isobars'; // Ensure default value
  backgroundImageUrl: string | null = null;

  loadPngBackground(): void {
    this.isobarService.getEditingImage().subscribe(
      (imageBlob: Blob) => {
        this.backgroundImageUrl = URL.createObjectURL(imageBlob);
        console.log('PNG background loaded:', this.backgroundImageUrl);
      },
      (error) => console.error('Failed to load PNG image:', error)
    );
  }

  loadSvg(): void {
    console.log('Loading SVG for:', this.selectedImageType); // Debugging

    this.isobarService.getSvgData(this.selectedImageType).subscribe(
      (svgData: string) => {
        if (this.svgContainer?.nativeElement) {
          console.log('SVG Loaded Successfully');
          this.svgContainer.nativeElement.innerHTML = svgData;
          this.saveState(); // Save initial state
          this.makeSvgInteractive();
        }
      },
      (error) => console.error('Failed to load SVG:', error)
    );
  }

  imageData: any; // Store the fetched image data
  imageTypes: string[] = [
    'isobars',
    'isotherms',
    'isodrosotherms',
    'isogons',
    'isohumes',
    'isohyets',
    'isonephs',
    'isotachs',
  ]; // Example types
  apiUrl = `${environment.apiUrl}`;
  private historyStack: string[] = [];
  private redoStack: string[] = [];
  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private isobarService: IsobarImageDataService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {}
  ngOnInit(): void {
    // Get the image type from query params
    this.route.queryParams.subscribe((params) => {
      this.selectedImageType = params['type'] || 'isobars';
      this.loadPngBackground(); // Load PNG first
      this.loadSvg();
    });

  }


  onImageTypeChange(event: MatSelectChange): void {
    this.selectedImageType = event.value;
    console.log('Selected Image Type:', this.selectedImageType); // Debugging
    this.loadSvg();
  }





  // Save the current SVG state for undo/redo
  private saveState(): void {
    if (this.svgContainer?.nativeElement) {
      const svgString = this.getSerializedSvg();
      this.historyStack.push(svgString);
      this.redoStack = []; // Clear redo stack when a new change is made
    }
  }
  // Undo action
  undo(): void {
    if (this.historyStack.length > 1) {
      const lastState = this.historyStack.pop();
      if (lastState) {
        this.redoStack.push(this.getSerializedSvg()); // Save current state for redo
        this.restoreSvg(this.historyStack[this.historyStack.length - 1]);
      }
    }
  }

  // Redo action
  redo(): void {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop();
      if (nextState) {
        this.historyStack.push(this.getSerializedSvg()); // Save current state before redoing
        this.restoreSvg(nextState);
      }
    }
  }

  // Restore SVG to a given state
  private restoreSvg(svgString: string): void {
    if (this.svgContainer?.nativeElement) {
      this.svgContainer.nativeElement.innerHTML = svgString;
      this.makeSvgInteractive();
    }
  }

  // Hook into changes to save state (call this after any edit)
  private onSvgModified(): void {
    this.saveState();
  }
  // Serialize the current SVG
  private getSerializedSvg(): string {
    const svgElement = this.svgContainer.nativeElement;
    return new XMLSerializer().serializeToString(svgElement);
  }

  @ViewChild('svgContainer', { static: false })
  svgContainer!: ElementRef<SVGSVGElement>;
  selectedElement: SVGGraphicsElement | null = null;
  startX = 0;
  startY = 0;
  transformMatrix: DOMMatrix | null = null;
  isDrawing = false;
  tempLine: SVGLineElement | null = null;
  lineStart: { x: number; y: number } | null = null;
  isFreehandDrawing = false;
  currentPath: SVGPathElement | null = null;
  pathData = '';
  isEraser = false;
  isNumberInputAllowed: boolean = false;
  userNumber: number | null = null;

  // **Download Edited SVG**
  downloadSvg(): void {
    const svgElement = this.svgContainer.nativeElement;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited-image.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // **Convert SVG to Base64 and Send to Backend**
  sendSvgToBackend(): void {
    const svgElement = this.svgContainer.nativeElement;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];

      const payload = {
        imageType: this.selectedImageType,
        svgData: base64Data,
      };

      this.http.post(`${this.apiUrl}upload-svg`, payload).subscribe(
        (response) => {
          console.log('SVG Uploaded Successfully:', response);
        },
        (error) => {
          console.error('Error uploading SVG:', error);
        }
      );
    };

    reader.readAsDataURL(blob);
  }





















  enteredNumber: number | null = null;
  selectedNumber: number | null = null;
  selectedDirection: string = 'N';
  lastEvent!: MouseEvent;
  modalInstance: any;
  selectedRotation: number = 0;
  allowNumberAddition: boolean = false;
  numbers: { x: number; y: number; value: number }[] = [];
  makeSvgInteractive(): void {
    const svg = this.svgContainer.nativeElement;

    svg
      .querySelectorAll<SVGGraphicsElement>('path, line, text')
      .forEach((element) => {
        element.addEventListener('mousedown', (event) => {
          this.startDrag(event as MouseEvent, element);
        });

        element.addEventListener('dblclick', () => {
          this.deleteElement(element);
          this.onSvgModified(); // Save state after deletion
        });
      });

    svg.addEventListener('mousemove', (event) =>
      this.drag(event as MouseEvent)
    );
    svg.addEventListener('mouseup', () => this.endDrag());
    svg.addEventListener('mouseleave', () => this.endDrag());

    svg.addEventListener('mousedown', (event) =>
      this.startFreehandDrawing(event)
    );
    svg.addEventListener('mousemove', (event) => this.drawFreehand(event));
    svg.addEventListener('mouseup', () => {
      this.stopFreehandDrawing();
      this.onSvgModified(); // Save state after drawing
    });

    // Attach or remove event listener based on the toggle state
    svg.addEventListener('click', (event) => {
      if (this.allowNumberAddition) {
        const targetElement = event.target as Element; // Explicitly cast event.target to Element
        if (targetElement && !targetElement.closest('text')) {
          this.addNumberToSVG(event);
          this.onSvgModified(); // Save state after adding text
          this.allowNumberAddition = false; // Prevent further number additions
        }
      }
    });
  }

  toggleNumberAddition() {
    this.allowNumberAddition = !this.allowNumberAddition;
  }

  addNumber(event: MouseEvent) {
    if (!this.allowNumberAddition) return;

    const numValue = prompt('Enter Pressure number:');
    if (numValue !== null && !isNaN(Number(numValue))) {
      this.numbers.push({
        x: event.offsetX,
        y: event.offsetY,
        value: Number(numValue),
      });
    }
  }


  addNumberToSVG(event: MouseEvent): void {
    if (!this.allowNumberAddition) return;

    this.lastEvent = event; // Store event for later use

    const dialogRef = this.dialog.open(NumberDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.number !== null) {
        this.placeNumberOnSVG(result.number, result.direction);
      }
    });
  }

  placeNumberOnSVG(number: number, direction: string): void {
    const point = this.getSVGPoint(this.lastEvent.clientX, this.lastEvent.clientY);
    if (!point) return;

    const svg = this.svgContainer.nativeElement;

    // Check if a number already exists at the same position to prevent duplication
    const existingText = Array.from(svg.querySelectorAll('text')).find((el: any) =>
      el.getAttribute('x') === point.x.toString() &&
      el.getAttribute('y') === point.y.toString()
    );
    if (existingText) return;

    const rotationAngle = this.getRotationAngle(direction);

    const textElement = this.renderer.createElement('text', 'svg');
    this.renderer.setAttribute(textElement, 'x', point.x.toString());
    this.renderer.setAttribute(textElement, 'y', point.y.toString());
    this.renderer.setAttribute(textElement, 'font-size', '12');
    this.renderer.setAttribute(textElement, 'fill', 'black');
    this.renderer.setAttribute(textElement, 'cursor', 'move'); // Set cursor to indicate movement
    textElement.textContent = number.toString();

    if (rotationAngle !== null) {
      this.renderer.setAttribute(textElement, 'transform', `rotate(${rotationAngle} ${point.x} ${point.y})`);
    }

    this.renderer.appendChild(svg, textElement);

    // Enable dragging using the startDrag logic
    this.enableDragging(textElement);

    // Enable deletion on double-click
    this.renderer.listen(textElement, 'dblclick', (event: MouseEvent) => {
      event.stopPropagation();
      this.renderer.removeChild(svg, textElement);
    });

    this.onSvgModified();
  }

  enableDragging(element: SVGGraphicsElement): void {
    this.renderer.listen(element, 'mousedown', (event: MouseEvent) => {
      this.startdrag(event, element);
    });
  }

  // Implement the dragging logic using your provided `startDrag` method
  startdrag(event: MouseEvent, element: SVGGraphicsElement): void {
    if (this.isDrawing || this.isFreehandDrawing || this.isEraser) return;
    this.selectedElement = element;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    if (element.tagName === 'text') {
      this.startX = parseFloat(element.getAttribute('x') || '0');
      this.startY = parseFloat(element.getAttribute('y') || '0');
    } else {
      // For path and line elements, use transformation matrix
      const transform = element.transform.baseVal.consolidate();
      this.transformMatrix = transform ? transform.matrix : new DOMMatrix();
      this.startX = point.x - this.transformMatrix.e;
      this.startY = point.y - this.transformMatrix.f;
    }

    // Attach event listeners for moving the element
    this.renderer.listen(document, 'mousemove', this.dragElement.bind(this));
    this.renderer.listen(document, 'mouseup', this.stopDrag.bind(this));
  }

  dragElement(event: MouseEvent): void {
    if (!this.selectedElement) return;
    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    if (this.selectedElement.tagName === 'text') {
      this.renderer.setAttribute(this.selectedElement, 'x', point.x.toString());
      this.renderer.setAttribute(this.selectedElement, 'y', point.y.toString());
    } else {
      // If dragging other elements like paths/lines, update transformation matrix
      this.selectedElement.setAttribute(
        'transform',
        `translate(${point.x - this.startX}, ${point.y - this.startY})`
      );
    }
  }

  stopDrag(): void {
    this.selectedElement = null;
  }


  // Function to determine rotation angle based on direction
  getRotationAngle(direction: string | null): number | null {
    switch (direction?.toUpperCase()) {
      case 'N':
        return 0;
      case 'NE':
        return 45;
      case 'E':
        return 90;
      case 'SE':
        return 135;
      case 'S':
        return 180;
      case 'SW':
        return 225;
      case 'W':
        return 270;
      case 'NW':
        return 315;
      default:
        return null; // No rotation if invalid input
    }
  }


























 // Start freehand drawing (assign unique ID for deletion)
 startFreehandDrawing(event: MouseEvent): void {
  if (!this.isFreehandDrawing || this.isEraser) return;
  this.isDrawing = false;

  const point = this.getSVGPoint(event.clientX, event.clientY);
  if (!point) return;

  this.pathData = `M ${point.x} ${point.y}`;
  this.currentPath = this.renderer.createElement('path', 'svg');

  if (this.currentPath) {
    const uniqueId = `path-${Date.now()}`; // Generate unique ID
    this.renderer.setAttribute(this.currentPath, 'id', uniqueId);
    this.renderer.setAttribute(this.currentPath, 'd', this.pathData);
    this.renderer.setAttribute(this.currentPath, 'stroke', 'black');
    this.renderer.setAttribute(this.currentPath, 'stroke-width', '1');
    this.renderer.setAttribute(this.currentPath, 'fill', 'none');
    this.svgContainer.nativeElement.appendChild(this.currentPath);
  }
}
 // Delete an element on double-click (now supports lines)
 deleteElement(element: SVGGraphicsElement): void {
  if (element.tagName === 'line' || element.tagName === 'path') {
    console.log(`Deleting ${element.tagName} with ID: ${element.id || 'No ID'}`);
    element.remove();
  }
}
  // Draw freehand with smooth curves
  drawFreehand(event: MouseEvent): void {
    if (!this.isFreehandDrawing || !this.currentPath || this.isEraser) return;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    // Get the last drawn point
    const prevPoints = this.pathData.match(/[-+]?[0-9]*\.?[0-9]+/g);
    if (!prevPoints || prevPoints.length < 2) return;

    const lastX = parseFloat(prevPoints[prevPoints.length - 2]);
    const lastY = parseFloat(prevPoints[prevPoints.length - 1]);

    // Compute control points dynamically for smoothness
    const controlX = (lastX + point.x) / 2;
    const controlY = (lastY + point.y) / 2;

    // Use quadratic Bézier curve (Q x1 y1 x y)
    this.pathData += ` Q ${controlX} ${controlY} ${point.x} ${point.y}`;
    this.renderer.setAttribute(this.currentPath, 'd', this.pathData);
  }

  // Stop freehand drawing
  stopFreehandDrawing(): void {
    this.isFreehandDrawing = false;
    this.currentPath = null;
    this.pathData = '';
  }

  // Convert screen coordinates to SVG coordinates
  private getSVGPoint(clientX: number, clientY: number): DOMPoint | null {
    const svg = this.svgContainer.nativeElement;
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;

    const ctm = svg.getScreenCTM();
    return ctm ? point.matrixTransform(ctm.inverse()) : null;
  }

  eraseElement(event: MouseEvent): void {
    if (!this.isEraser) return;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    const elementsAtPoint = document.elementsFromPoint(
      event.clientX,
      event.clientY
    );

    elementsAtPoint.forEach((el) => {
      if (
        el instanceof SVGGraphicsElement &&
        (el.tagName === 'line' || el.tagName === 'path')
      ) {
        console.log(`Deleting ${el.tagName} with ID: ${el.id || 'No ID'}`);
        el.remove(); // Remove the selected line or path
      }
    });
  }


  // Modify `startDrag` to handle text elements
  startDrag(event: MouseEvent, element: SVGGraphicsElement): void {
    if (this.isDrawing || this.isFreehandDrawing || this.isEraser) return;
    this.selectedElement = element;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    if (element.tagName === 'text') {
      this.startX = parseFloat(element.getAttribute('x') || '0');
      this.startY = parseFloat(element.getAttribute('y') || '0');
    } else {
      // For path and line elements, use transformation matrix
      const transform = element.transform.baseVal.consolidate();
      this.transformMatrix = transform ? transform.matrix : new DOMMatrix();
      this.startX = point.x - this.transformMatrix.e;
      this.startY = point.y - this.transformMatrix.f;
    }
  }

  // Dragging logic
  drag(event: MouseEvent): void {
    if (
      !this.selectedElement ||
      !this.transformMatrix ||
      this.isDrawing ||
      this.isFreehandDrawing ||
      this.isEraser
    )
      return;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    if (this.selectedElement.tagName === 'text') {
      const deltaX = point.x - this.startX;
      const deltaY = point.y - this.startY;
      this.selectedElement.setAttribute('x', (this.startX + deltaX).toString());
      this.selectedElement.setAttribute('y', (this.startY + deltaY).toString());
    } else {
      // Move lines and paths using transform
      const newX = point.x - this.startX;
      const newY = point.y - this.startY;
      this.renderer.setAttribute(
        this.selectedElement,
        'transform',
        `translate(${newX},${newY})`
      );
    }
  }

  // End dragging
  endDrag(): void {
    this.selectedElement = null;
    this.transformMatrix = null;
  }



  // Toggle freehand drawing mode
  toggleFreehandDrawMode(): void {
    this.isFreehandDrawing = !this.isFreehandDrawing;
    this.isDrawing = false;
    this.isEraser = false;
  }

  // Toggle eraser mode
  toggleEraserMode(): void {
    this.isEraser = !this.isEraser;
    this.isDrawing = false;
    this.isFreehandDrawing = false;
  }
}





































































/*
import { Component, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-svg-edit',
  templateUrl: './svg-edit.component.html',
  styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements AfterViewInit {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef<SVGSVGElement>;
  selectedElement: SVGGraphicsElement | null = null;
  startX = 0;
  startY = 0;
  transformMatrix: DOMMatrix | null = null;
  isDrawing = false;
  tempLine: SVGLineElement | null = null;
  lineStart: { x: number, y: number } | null = null;

  // Freehand drawing variables
  isFreehandDrawing = false;
  currentPath: SVGPathElement | null = null;
  pathData = '';

  // Eraser variable
  isEraser = false;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.loadSvg();
  }

  // Load SVG file and make it interactive
  loadSvg(): void {
    fetch('assets/isobars.svg')
      .then(response => response.text())
      .then(svgData => {
        this.svgContainer.nativeElement.innerHTML = svgData;
        this.makeSvgInteractive();
      })
      .catch(error => console.error('Failed to load SVG:', error));
  }

  // Make SVG elements interactive (draggable and editable)
  makeSvgInteractive(): void {
    const svg = this.svgContainer.nativeElement;

    svg.querySelectorAll<SVGGraphicsElement>('path, line').forEach(element => {
      element.addEventListener('mousedown', (event) => this.startDrag(event as MouseEvent, element));
      element.addEventListener('dblclick', () => this.deleteElement(element));
    });

    svg.addEventListener('mousemove', (event) => this.drag(event as MouseEvent));
    svg.addEventListener('mouseup', () => this.endDrag());
    svg.addEventListener('mouseleave', () => this.endDrag());

    svg.addEventListener('mousedown', (event) => this.startFreehandDrawing(event));
    svg.addEventListener('mousemove', (event) => this.drawFreehand(event));
    svg.addEventListener('mouseup', () => this.stopFreehandDrawing());

    svg.addEventListener('click', (event) => this.drawLine(event));
    svg.addEventListener('click', (event) => this.eraseElement(event)); // Eraser logic
  }

  // Start dragging an element
  startDrag(event: MouseEvent, element: SVGGraphicsElement): void {
    if (this.isDrawing || this.isFreehandDrawing || this.isEraser) return;
    this.selectedElement = element;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    const transform = element.transform.baseVal.consolidate();
    this.transformMatrix = transform ? transform.matrix : new DOMMatrix();

    this.startX = point.x - this.transformMatrix.e;
    this.startY = point.y - this.transformMatrix.f;
  }

  // Dragging logic
  drag(event: MouseEvent): void {
    if (!this.selectedElement || !this.transformMatrix || this.isDrawing || this.isFreehandDrawing || this.isEraser) return;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    const newX = point.x - this.startX;
    const newY = point.y - this.startY;

    this.renderer.setAttribute(this.selectedElement, 'transform', `translate(${newX},${newY})`);
  }

  // End dragging
  endDrag(): void {
    this.selectedElement = null;
    this.transformMatrix = null;
  }

  // Delete an element on double-click
  deleteElement(element: SVGGraphicsElement): void {
    element.remove();
  }

  // Toggle straight-line drawing mode
  toggleDrawMode(): void {
    this.isDrawing = !this.isDrawing;
    this.tempLine = null;
    this.lineStart = null;
    this.isFreehandDrawing = false;
    this.isEraser = false;
  }

  // Toggle freehand drawing mode
  toggleFreehandDrawMode(): void {
    this.isFreehandDrawing = !this.isFreehandDrawing;
    this.isDrawing = false;
    this.isEraser = false;
  }

  // Toggle eraser mode
  toggleEraserMode(): void {
    this.isEraser = !this.isEraser;
    this.isDrawing = false;
    this.isFreehandDrawing = false;
  }

  // Draw straight lines
  drawLine(event: MouseEvent): void {
    if (!this.isDrawing || this.isEraser) return;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    const svg = this.svgContainer.nativeElement;

    if (!this.lineStart) {
      // First click, set start point
      this.lineStart = { x: point.x, y: point.y };
      this.tempLine = this.renderer.createElement('line', 'svg');

      if (this.tempLine) {
        this.renderer.setAttribute(this.tempLine, 'x1', String(point.x));
        this.renderer.setAttribute(this.tempLine, 'y1', String(point.y));
        this.renderer.setAttribute(this.tempLine, 'x2', String(point.x));
        this.renderer.setAttribute(this.tempLine, 'y2', String(point.y));
        this.renderer.setAttribute(this.tempLine, 'stroke', 'black');
        this.renderer.setAttribute(this.tempLine, 'stroke-width', '2');
        svg.appendChild(this.tempLine);
      }
    } else {
      // Second click, complete the line
      this.renderer.setAttribute(this.tempLine, 'x2', String(point.x));
      this.renderer.setAttribute(this.tempLine, 'y2', String(point.y));
      this.tempLine = null;
      this.lineStart = null;
    }
  }

  // Start freehand drawing
  startFreehandDrawing(event: MouseEvent): void {
    if (!this.isFreehandDrawing || this.isEraser) return;
    this.isDrawing = false;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    this.pathData = `M ${point.x} ${point.y}`;
    this.currentPath = this.renderer.createElement('path', 'svg');

    if (this.currentPath) {
      this.renderer.setAttribute(this.currentPath, 'd', this.pathData);
      this.renderer.setAttribute(this.currentPath, 'stroke', 'black');
      this.renderer.setAttribute(this.currentPath, 'stroke-width', '2');
      this.renderer.setAttribute(this.currentPath, 'fill', 'none');
      this.svgContainer.nativeElement.appendChild(this.currentPath);
    }
  }

  // Draw freehand with smooth curves
  drawFreehand(event: MouseEvent): void {
    if (!this.isFreehandDrawing || !this.currentPath || this.isEraser) return;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    // Get the last drawn point
    const prevPoints = this.pathData.match(/[-+]?[0-9]*\.?[0-9]+/g);
    if (!prevPoints || prevPoints.length < 2) return;

    const lastX = parseFloat(prevPoints[prevPoints.length - 2]);
    const lastY = parseFloat(prevPoints[prevPoints.length - 1]);

    // Compute control points dynamically for smoothness
    const controlX = (lastX + point.x) / 2;
    const controlY = (lastY + point.y) / 2;

    // Use quadratic Bézier curve (Q x1 y1 x y)
    this.pathData += ` Q ${controlX} ${controlY} ${point.x} ${point.y}`;
    this.renderer.setAttribute(this.currentPath, 'd', this.pathData);
  }

  // Stop freehand drawing
  stopFreehandDrawing(): void {
    this.isFreehandDrawing = false;
    this.currentPath = null;
    this.pathData = '';
  }

  // Erase an element (if it's under the cursor)
  eraseElement(event: MouseEvent): void {
    if (!this.isEraser) return;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    const svg = this.svgContainer.nativeElement;
    const elementsAtPoint = document.elementsFromPoint(event.clientX, event.clientY);

    elementsAtPoint.forEach((el) => {
      if (el instanceof SVGGraphicsElement && (el.tagName === 'line' || el.tagName === 'path')) {
        el.remove(); // Remove the element
      }
    });
  }

  // Convert screen coordinates to SVG coordinates
  private getSVGPoint(clientX: number, clientY: number): DOMPoint | null {
    const svg = this.svgContainer.nativeElement;
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;

    const ctm = svg.getScreenCTM();
    return ctm ? point.matrixTransform(ctm.inverse()) : null;
  }
}

*/

/*
import { Component, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-svg-edit',
  templateUrl: './svg-edit.component.html',
  styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements AfterViewInit {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef<SVGSVGElement>;
  selectedElement: SVGGraphicsElement | null = null;
  startX = 0;
  startY = 0;
  transformMatrix: DOMMatrix | null = null;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.loadSvg();
  }

  loadSvg(): void {
    fetch('assets/isobars.svg')
      .then(response => response.text())
      .then(svgData => {
        this.svgContainer.nativeElement.innerHTML = svgData;
        this.makeSvgInteractive();
      })
      .catch(error => console.error('Failed to load SVG:', error));
  }

  makeSvgInteractive(): void {
    const svg = this.svgContainer.nativeElement;

    svg.querySelectorAll<SVGGraphicsElement>('path, line').forEach(element => {
      element.addEventListener('mousedown', (event) => this.startDrag(event as MouseEvent, element));
    });

    svg.addEventListener('mousemove', (event) => this.drag(event as MouseEvent));
    svg.addEventListener('mouseup', () => this.endDrag());
    svg.addEventListener('mouseleave', () => this.endDrag());
  }

  startDrag(event: MouseEvent, element: SVGGraphicsElement): void {
    this.selectedElement = element;

    // Convert mouse coordinates to SVG coordinate system
    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    // Get current transform
    const transform = element.transform.baseVal.consolidate();
    this.transformMatrix = transform ? transform.matrix : new DOMMatrix();

    // Store start position
    this.startX = point.x - this.transformMatrix.e;
    this.startY = point.y - this.transformMatrix.f;
  }

  drag(event: MouseEvent): void {
    if (!this.selectedElement || !this.transformMatrix) return;

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    // Compute new position based on offset
    const newX = point.x - this.startX;
    const newY = point.y - this.startY;

    // Apply smooth translation
    this.renderer.setAttribute(this.selectedElement, 'transform', `translate(${newX},${newY})`);
  }

  endDrag(): void {
    this.selectedElement = null;
    this.transformMatrix = null;
  }

  private getSVGPoint(clientX: number, clientY: number): DOMPoint | null {
    const svg = this.svgContainer.nativeElement;
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;

    const ctm = svg.getScreenCTM();
    return ctm ? point.matrixTransform(ctm.inverse()) : null;
  }
}
*/
/*
import { Component, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-svg-edit',
  templateUrl: './svg-edit.component.html',
  styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements AfterViewInit {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef<SVGSVGElement>;
  private map!: L.Map;
  private geoJsonUrl: string = '../../../assets/world-administrative-boundaries1.geojson';
  private svgUrl: string = 'assets/isobars.svg';
  private svgOverlay!: L.SVGOverlay;

  isMapLocked: boolean = false;

  selectedElement: SVGGraphicsElement | null = null;
  offsetX = 0;
  offsetY = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadGeoJson();
    this.loadSvgOverlay();
  }


  initMap(): void {
    this.map = L.map('map', {
      center: [40, 30],
      zoom: 3,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }


  loadGeoJson(): void {
    fetch(this.geoJsonUrl)
      .then(response => response.json())
      .then(data => {
        L.geoJSON(data, {
          style: { color: '#888', weight: 1, fillOpacity: 0.2 }
        }).addTo(this.map);
      })
      .catch(error => console.error('Failed to load GeoJSON:', error));
  }





  loadSvgOverlay(): void {
    const bounds: L.LatLngBoundsExpression = [[7, 25], [37, 92]];

    fetch(this.svgUrl)
      .then(response => response.text())
      .then(svgData => {
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(svgData, "image/svg+xml");

        // Ensure TypeScript understands this is an SVG element
        const svgElement = parsedDocument.documentElement as unknown as SVGElement;

        // Correctly assign svgOverlay with explicit type
        this.svgOverlay = L.svgOverlay(svgElement, bounds) as L.SVGOverlay;
        this.svgOverlay.addTo(this.map);

        setTimeout(() => this.makeSvgInteractive(svgElement), 500);
      })
      .catch(error => console.error('Failed to load SVG:', error));
  }



makeSvgInteractive(svg: SVGElement): void {
  if (!svg) {
    console.error('SVG container not found!');
    return;
  }

  svg.querySelectorAll<SVGGraphicsElement>('path, line').forEach(element => {
    element.addEventListener('mousedown', (event) => this.startDrag(event as MouseEvent, element));
  });

  svg.addEventListener('mousemove', (event) => this.drag(event as MouseEvent));
  svg.addEventListener('mouseup', () => this.endDrag());
  svg.addEventListener('mouseleave', () => this.endDrag());
}




  startDrag(event: MouseEvent, element: SVGGraphicsElement): void {
    this.selectedElement = element;
    const bbox = element.getBoundingClientRect();
    this.offsetX = event.clientX - bbox.x;
    this.offsetY = event.clientY - bbox.y;
  }

  drag(event: MouseEvent): void {
    if (!this.selectedElement) return;

    const newX = event.clientX - this.offsetX;
    const newY = event.clientY - this.offsetY;

    // Get existing transform (if any)
    const existingTransform = this.selectedElement.getAttribute('transform') || '';

    // Update transform with new position
    const newTransform = existingTransform.replace(/translate\([^)]*\)/, '') + ` translate(${newX},${newY})`;
    this.renderer.setAttribute(this.selectedElement, 'transform', newTransform);
  }

  endDrag(): void {
    this.selectedElement = null;
  }


  toggleMapLock(): void {
    if (this.isMapLocked) {
      this.map.dragging.enable();
      this.map.scrollWheelZoom.enable();
      this.map.touchZoom.enable();
      this.map.doubleClickZoom.enable();
      this.map.boxZoom.enable();
    } else {
      this.map.dragging.disable();
      this.map.scrollWheelZoom.disable();
      this.map.touchZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.boxZoom.disable();
    }
    this.isMapLocked = !this.isMapLocked;
  }


  captureSvg(): void {
    const svgElement = this.svgContainer.nativeElement;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'edited_isobars.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}



  addNumberToSVG(event: MouseEvent): void {
    if (!this.allowNumberAddition) return; // Prevent number addition if not allowed

    const point = this.getSVGPoint(event.clientX, event.clientY);
    if (!point) return;

    const svg = this.svgContainer.nativeElement;
    const number = prompt('Enter a number:', '1'); // Ask user for input
    if (!number || isNaN(Number(number))) return; // Exit if invalid input

    // Ask user for rotation direction
    const direction = prompt('Enter direction (N, W, S, E):', 'N');
    const rotationAngle = this.getRotationAngle(direction);

    const textElement = this.renderer.createElement('text', 'svg');
    this.renderer.setAttribute(textElement, 'x', point.x.toString());
    this.renderer.setAttribute(textElement, 'y', point.y.toString());
    this.renderer.setAttribute(textElement, 'font-size', '12'); // Decreased font size
    this.renderer.setAttribute(textElement, 'fill', 'black');
    textElement.textContent = number;

    // Apply rotation transformation
    if (rotationAngle !== null) {
      this.renderer.setAttribute(
        textElement,
        'transform',
        `rotate(${rotationAngle} ${point.x} ${point.y})`
      );
    }

    this.renderer.appendChild(svg, textElement);
    this.onSvgModified(); // Save state after adding text
  }
*/
