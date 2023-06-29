import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitConverterIndexComponent } from './unit-converter-index.component';

describe('UnitConverterIndexComponent', () => {
  let component: UnitConverterIndexComponent;
  let fixture: ComponentFixture<UnitConverterIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitConverterIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitConverterIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
