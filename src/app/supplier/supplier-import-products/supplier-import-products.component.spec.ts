import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierImportProductsComponent } from './supplier-import-products.component';

describe('SupplierImportProductsComponent', () => {
  let component: SupplierImportProductsComponent;
  let fixture: ComponentFixture<SupplierImportProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierImportProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierImportProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
