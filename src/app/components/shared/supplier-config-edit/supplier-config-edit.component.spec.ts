import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierConfigEditComponent } from './supplier-config-edit.component';

describe('SupplierConfigEditComponent', () => {
  let component: SupplierConfigEditComponent;
  let fixture: ComponentFixture<SupplierConfigEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierConfigEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierConfigEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
