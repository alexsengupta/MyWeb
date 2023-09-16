import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioPreviewDialogComponent } from './scenario-preview-dialog.component';

describe('ScenarioPreviewDialogComponent', () => {
  let component: ScenarioPreviewDialogComponent;
  let fixture: ComponentFixture<ScenarioPreviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioPreviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
