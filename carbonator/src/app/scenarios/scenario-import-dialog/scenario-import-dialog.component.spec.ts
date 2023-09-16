import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioImportDialogComponent } from './scenario-import-dialog.component';

describe('ScenarioImportDialogComponent', () => {
  let component: ScenarioImportDialogComponent;
  let fixture: ComponentFixture<ScenarioImportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioImportDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
