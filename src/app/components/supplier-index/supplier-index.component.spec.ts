import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierIndexComponent } from './supplier-index.component';

describe('SupplierIndexComponent', () => {
  let component: SupplierIndexComponent;
  let fixture: ComponentFixture<SupplierIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
