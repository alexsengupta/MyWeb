import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcingComponent } from './forcing.component';

describe('ForcingComponent', () => {
  let component: ForcingComponent;
  let fixture: ComponentFixture<ForcingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForcingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
