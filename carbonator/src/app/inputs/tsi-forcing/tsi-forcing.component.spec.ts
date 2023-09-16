import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TSIForcingComponent } from './tsi-forcing.component';

describe('TSIForcingComponent', () => {
  let component: TSIForcingComponent;
  let fixture: ComponentFixture<TSIForcingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TSIForcingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TSIForcingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
