import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVerifiedFilterSwitchComponent } from './product-verified-filter-switch.component';

describe('ProductVerifiedFilterSwitchComponent', () => {
  let component: ProductVerifiedFilterSwitchComponent;
  let fixture: ComponentFixture<ProductVerifiedFilterSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductVerifiedFilterSwitchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductVerifiedFilterSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
