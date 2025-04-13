import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyForecastComponent } from './early-forecast.component';

describe('EarlyForecastComponent', () => {
  let component: EarlyForecastComponent;
  let fixture: ComponentFixture<EarlyForecastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EarlyForecastComponent]
    });
    fixture = TestBed.createComponent(EarlyForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
