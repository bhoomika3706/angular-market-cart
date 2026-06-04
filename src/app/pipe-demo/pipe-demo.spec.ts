import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeDemo } from './pipe-demo';

describe('PipeDemo', () => {
  let component: PipeDemo;
  let fixture: ComponentFixture<PipeDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipeDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(PipeDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
