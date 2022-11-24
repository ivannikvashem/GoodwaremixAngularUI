import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAutocompleteComponent } from './supplier-autocomplete.component';

describe('SupplierAutocompleteComponent', () => {
  let component: SupplierAutocompleteComponent;
  let fixture: ComponentFixture<SupplierAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierAutocompleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
