import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapAttributeComponent } from './swap-attribute.component';

describe('SwapAttributeComponent', () => {
  let component: SwapAttributeComponent;
  let fixture: ComponentFixture<SwapAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwapAttributeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwapAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
