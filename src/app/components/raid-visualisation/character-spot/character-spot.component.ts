import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Character } from '../../../interfaces/character';

@Component({
  selector: 'app-character-spot',
  templateUrl: './character-spot.component.html',
  styleUrls: ['./character-spot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CharacterSpotComponent {
  @Input() character: Character;

  public get charName(): string {
    let charName = this.character.name;
    if (this.character.isAlt) {
      charName+= ` (Alt)`
    }
    return charName;
  }
}
