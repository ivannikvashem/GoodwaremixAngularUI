import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDictionaryComponent } from './supplier-dictionary.component';

describe('SupplierDictionaryComponent', () => {
  let component: SupplierDictionaryComponent;
  let fixture: ComponentFixture<SupplierDictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierDictionaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
