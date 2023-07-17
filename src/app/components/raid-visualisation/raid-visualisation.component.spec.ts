import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidVisualisationComponent } from './raid-visualisation.component';

describe('RaidVisualisationComponent', () => {
  let component: RaidVisualisationComponent;
  let fixture: ComponentFixture<RaidVisualisationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RaidVisualisationComponent]
    });
    fixture = TestBed.createComponent(RaidVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
