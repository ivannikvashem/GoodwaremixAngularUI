import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDocumentEdit } from './product-document-edit';

describe('DocumentEditorComponent', () => {
  let component: ProductDocumentEdit;
  let fixture: ComponentFixture<ProductDocumentEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDocumentEdit ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDocumentEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
