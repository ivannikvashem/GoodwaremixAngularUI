import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryFilterSwitchComponent } from './product-category-filter-switch.component';

describe('ProductCategoryFilterSwitchComponent', () => {
  let component: ProductCategoryFilterSwitchComponent;
  let fixture: ComponentFixture<ProductCategoryFilterSwitchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCategoryFilterSwitchComponent]
    });
    fixture = TestBed.createComponent(ProductCategoryFilterSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
