import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenariosMenuComponent } from './scenarios-menu.component';

describe('ScenariosMenuComponent', () => {
  let component: ScenariosMenuComponent;
  let fixture: ComponentFixture<ScenariosMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenariosMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenariosMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
