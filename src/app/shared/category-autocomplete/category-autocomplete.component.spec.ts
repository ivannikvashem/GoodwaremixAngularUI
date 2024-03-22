import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAutocompleteComponent } from './category-autocomplete.component';

describe('CategoryAutocompleteComponent', () => {
  let component: CategoryAutocompleteComponent;
  let fixture: ComponentFixture<CategoryAutocompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryAutocompleteComponent]
    });
    fixture = TestBed.createComponent(CategoryAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
