import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierProductPreviewerComponent } from './supplier-product-previewer.component';

describe('SupplierProductPreviewerComponent', () => {
  let component: SupplierProductPreviewerComponent;
  let fixture: ComponentFixture<SupplierProductPreviewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierProductPreviewerComponent]
    });
    fixture = TestBed.createComponent(SupplierProductPreviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
