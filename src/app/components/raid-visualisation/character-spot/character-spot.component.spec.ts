import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSpotComponent } from './character-spot.component';

describe('CharacterSpotComponent', () => {
  let component: CharacterSpotComponent;
  let fixture: ComponentFixture<CharacterSpotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharacterSpotComponent]
    });
    fixture = TestBed.createComponent(CharacterSpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
