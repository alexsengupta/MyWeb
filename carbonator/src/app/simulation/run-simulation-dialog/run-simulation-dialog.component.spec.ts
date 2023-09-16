import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunSimulationDialogComponent } from './run-simulation-dialog.component';

describe('RunSimulationDialogComponent', () => {
  let component: RunSimulationDialogComponent;
  let fixture: ComponentFixture<RunSimulationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunSimulationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunSimulationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
