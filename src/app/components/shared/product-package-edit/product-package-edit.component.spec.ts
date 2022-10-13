import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPackageEditComponent } from './product-package-edit.component';

describe('PackageEditorComponent', () => {
  let component: ProductPackageEditComponent;
  let fixture: ComponentFixture<ProductPackageEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPackageEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPackageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
