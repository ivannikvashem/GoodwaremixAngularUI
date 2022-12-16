import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthToolbarComponent } from './auth-toolbar.component';

describe('AuthToolbarComponent', () => {
  let component: AuthToolbarComponent;
  let fixture: ComponentFixture<AuthToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
