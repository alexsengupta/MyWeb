import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelParamsOutputComponent } from './model-params-output.component';

describe('ModelParamsOutputComponent', () => {
  let component: ModelParamsOutputComponent;
  let fixture: ComponentFixture<ModelParamsOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelParamsOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelParamsOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
