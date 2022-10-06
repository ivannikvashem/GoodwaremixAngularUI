import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAttributeAddComponent } from './supplier-attribute-add.component';

describe('SupplierAttributeAddComponent', () => {
  let component: SupplierAttributeAddComponent;
  let fixture: ComponentFixture<SupplierAttributeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierAttributeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierAttributeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
