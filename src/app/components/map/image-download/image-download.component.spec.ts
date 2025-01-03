import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDownloadComponent } from './image-download.component';

describe('ImageDownloadComponent', () => {
  let component: ImageDownloadComponent;
  let fixture: ComponentFixture<ImageDownloadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageDownloadComponent]
    });
    fixture = TestBed.createComponent(ImageDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
