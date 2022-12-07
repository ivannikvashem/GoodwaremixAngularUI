import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIcFilterSwitchComponent } from './product-ic-filter-switch.component';

describe('ProductIcFilterSwitchComponent', () => {
  let component: ProductIcFilterSwitchComponent;
  let fixture: ComponentFixture<ProductIcFilterSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductIcFilterSwitchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductIcFilterSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
