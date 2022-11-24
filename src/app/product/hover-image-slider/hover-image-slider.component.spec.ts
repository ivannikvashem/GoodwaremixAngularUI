import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverImageSliderComponent } from './hover-image-slider.component';

describe('HoverImageSliderComponent', () => {
  let component: HoverImageSliderComponent;
  let fixture: ComponentFixture<HoverImageSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoverImageSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoverImageSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
