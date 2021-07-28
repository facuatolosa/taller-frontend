import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReparacionNuevaComponent } from './reparacion-nueva.component';

describe('ReparacionNuevaComponent', () => {
  let component: ReparacionNuevaComponent;
  let fixture: ComponentFixture<ReparacionNuevaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReparacionNuevaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReparacionNuevaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
