import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedDialogComponent } from './advanced-dialog.component';

describe('AdvancedDialogComponent', () => {
  let component: AdvancedDialogComponent;
  let fixture: ComponentFixture<AdvancedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
