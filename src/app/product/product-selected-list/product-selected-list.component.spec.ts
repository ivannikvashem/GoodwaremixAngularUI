import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSelectedListComponent } from './product-selected-list.component';

describe('ProductSelectedListComponent', () => {
  let component: ProductSelectedListComponent;
  let fixture: ComponentFixture<ProductSelectedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSelectedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSelectedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
