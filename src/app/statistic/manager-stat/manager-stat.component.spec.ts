import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerStatComponent } from './manager-stat.component';

describe('ManagerStatComponent', () => {
  let component: ManagerStatComponent;
  let fixture: ComponentFixture<ManagerStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerStatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
