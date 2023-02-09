import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDocumentListComponent } from './product-document-list.component';

describe('ProductDocumentListComponent', () => {
  let component: ProductDocumentListComponent;
  let fixture: ComponentFixture<ProductDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDocumentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
