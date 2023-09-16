import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalVariabilityForcingComponent } from './internal-variability-forcing.component';

describe('InternalVariabilityForcingComponent', () => {
  let component: InternalVariabilityForcingComponent;
  let fixture: ComponentFixture<InternalVariabilityForcingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalVariabilityForcingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalVariabilityForcingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
