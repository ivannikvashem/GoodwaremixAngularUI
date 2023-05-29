import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductExportTableComponent } from './product-export-table.component';

describe('ProductExportTableComponent', () => {
  let component: ProductExportTableComponent;
  let fixture: ComponentFixture<ProductExportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductExportTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductExportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
