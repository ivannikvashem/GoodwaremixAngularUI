import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierEditMwComponent } from './supplier-edit-mw.component';

describe('SupplierEditComponent', () => {
  let component: SupplierEditMwComponent;
  let fixture: ComponentFixture<SupplierEditMwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierEditMwComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierEditMwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
