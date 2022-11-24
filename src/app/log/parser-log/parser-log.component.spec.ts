import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParserLogComponent } from './parser-log.component';

describe('ParserLogComponent', () => {
  let component: ParserLogComponent;
  let fixture: ComponentFixture<ParserLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParserLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParserLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
