import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttrtibuteStateSwitchComponent } from './attrtibute-state-switch.component';

describe('AttrtibuteStateSwitchComponent', () => {
  let component: AttrtibuteStateSwitchComponent;
  let fixture: ComponentFixture<AttrtibuteStateSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttrtibuteStateSwitchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttrtibuteStateSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
