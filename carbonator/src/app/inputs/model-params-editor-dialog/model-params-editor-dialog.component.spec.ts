import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelParamsEditorDialogComponent } from './model-params-editor-dialog.component';

describe('ModelParamsEditorDialogComponent', () => {
  let component: ModelParamsEditorDialogComponent;
  let fixture: ComponentFixture<ModelParamsEditorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelParamsEditorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelParamsEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
