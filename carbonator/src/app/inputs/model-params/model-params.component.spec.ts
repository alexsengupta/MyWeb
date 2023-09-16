import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelParamsComponent } from './model-params.component';

describe('ModelParamsComponent', () => {
  let component: ModelParamsComponent;
  let fixture: ComponentFixture<ModelParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
