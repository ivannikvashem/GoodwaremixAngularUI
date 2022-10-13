import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAttributeEditComponent } from './product-attribute-edit.component';

describe('AttributeEditorComponent', () => {
  let component: ProductAttributeEditComponent;
  let fixture: ComponentFixture<ProductAttributeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAttributeEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAttributeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
