import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelParamsDialogComponent } from './model-params-dialog.component';

describe('ModelParamsDialogComponent', () => {
  let component: ModelParamsDialogComponent;
  let fixture: ComponentFixture<ModelParamsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelParamsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelParamsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
