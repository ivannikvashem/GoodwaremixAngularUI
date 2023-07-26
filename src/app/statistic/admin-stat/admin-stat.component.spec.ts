import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStatComponent } from './admin-stat.component';

describe('AdminStatComponent', () => {
  let component: AdminStatComponent;
  let fixture: ComponentFixture<AdminStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminStatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
