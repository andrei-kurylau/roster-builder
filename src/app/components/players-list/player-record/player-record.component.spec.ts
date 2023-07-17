import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerRecordComponent } from './player-record.component';

describe('PlayerRecordComponent', () => {
  let component: PlayerRecordComponent;
  let fixture: ComponentFixture<PlayerRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerRecordComponent]
    });
    fixture = TestBed.createComponent(PlayerRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
