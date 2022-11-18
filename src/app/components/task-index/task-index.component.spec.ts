import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskIndexComponent } from './task-index.component';

describe('TaskIndexComponent', () => {
  let component: TaskIndexComponent;
  let fixture: ComponentFixture<TaskIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
