import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageEditorComponent } from './package-editor.component';

describe('PackageEditorComponent', () => {
  let component: PackageEditorComponent;
  let fixture: ComponentFixture<PackageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
