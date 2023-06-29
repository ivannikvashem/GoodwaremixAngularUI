import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitConverterEditComponent } from './unit-converter-edit.component';

describe('UnitConverterEditComponent', () => {
  let component: UnitConverterEditComponent;
  let fixture: ComponentFixture<UnitConverterEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitConverterEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitConverterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
