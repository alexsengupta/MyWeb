import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoriesComponent } from './mandatories.component';

describe('MandatoriesComponent', () => {
  let component: MandatoriesComponent;
  let fixture: ComponentFixture<MandatoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
