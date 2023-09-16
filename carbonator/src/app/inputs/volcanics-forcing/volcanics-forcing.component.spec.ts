import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolcanicsForcingComponent } from './volcanics-forcing.component';

describe('VolcanicsForcingComponent', () => {
  let component: VolcanicsForcingComponent;
  let fixture: ComponentFixture<VolcanicsForcingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolcanicsForcingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolcanicsForcingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
