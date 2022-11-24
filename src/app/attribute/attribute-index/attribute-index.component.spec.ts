import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeIndexComponent } from './attribute-index.component';

describe('AttributeIndexComponent', () => {
  let component: AttributeIndexComponent;
  let fixture: ComponentFixture<AttributeIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributeIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
