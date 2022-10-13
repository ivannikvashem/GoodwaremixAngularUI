import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDocumentEditComponent } from './product-document-edit.component';

describe('DocumentEditorComponent', () => {
  let component: ProductDocumentEditComponent;
  let fixture: ComponentFixture<ProductDocumentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDocumentEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDocumentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
