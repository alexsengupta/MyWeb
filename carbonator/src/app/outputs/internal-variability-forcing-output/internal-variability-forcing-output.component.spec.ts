import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalVariabilityForcingOutputComponent } from './internal-variability-forcing-output.component';

describe('InternalVariabilityForcingOutputComponent', () => {
  let component: InternalVariabilityForcingOutputComponent;
  let fixture: ComponentFixture<InternalVariabilityForcingOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalVariabilityForcingOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalVariabilityForcingOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
