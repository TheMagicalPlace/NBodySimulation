import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NBodyMainComponent } from './nbody-main.component';

describe('NBodyMainComponent', () => {
  let component: NBodyMainComponent;
  let fixture: ComponentFixture<NBodyMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NBodyMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NBodyMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
