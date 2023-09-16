import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcingOutputComponent } from './forcing-output.component';

describe('ForcingOutputComponent', () => {
  let component: ForcingOutputComponent;
  let fixture: ComponentFixture<ForcingOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForcingOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcingOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
