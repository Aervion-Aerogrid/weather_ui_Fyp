import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempBarComponent } from './temp-bar.component';

describe('TempBarComponent', () => {
  let component: TempBarComponent;
  let fixture: ComponentFixture<TempBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TempBarComponent]
    });
    fixture = TestBed.createComponent(TempBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
