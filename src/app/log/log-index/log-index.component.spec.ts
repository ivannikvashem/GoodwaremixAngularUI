import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogIndexComponent } from './log-index.component';

describe('ParserLogComponent', () => {
  let component: LogIndexComponent;
  let fixture: ComponentFixture<LogIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
