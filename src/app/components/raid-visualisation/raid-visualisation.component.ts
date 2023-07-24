import { Component, Input, SimpleChanges } from '@angular/core';
import { Raid } from '../../interfaces/raid';
import { Character } from '../../interfaces/character';
import { Role } from '../../enums/role';

@Component({
  selector: 'app-raid-visualisation',
  templateUrl: './raid-visualisation.component.html',
  styleUrls: ['./raid-visualisation.component.scss']
})
export class RaidVisualisationComponent {
  @Input() raid: Raid;

  public tanks: Character[];
  public healers: Character[];
  public melee: Character[];
  public ranged: Character[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['raid']) {
      this.tanks = this.raid.tanks;
      this.healers = this.sortByClassName(this.raid.healers);
      const melee = [];
      const ranged = [];
      this.raid.dps.forEach(char => {
        const dpsRole = [Role.MeleeDps, Role.RangedDps].includes(char.spec.role);
        if (!dpsRole) {
          return;
        }

        if (char.spec.role === Role.MeleeDps) {
          melee.push(char);
        } else {
          ranged.push(char);
        }
      });
      this.melee = this.sortByClassName(melee);
      this.ranged = this.sortByClassName(ranged);
    }
  }

  private sortByClassName(charArray: Character[]): Character[] {
    const copy = [...charArray];
    copy.sort((a, b) => {
      if (a.class.name === b.class.name) {
        return 0;
      }

      return a.class.name > b.class.name ? 1 : -1;
    });
    return copy;
  }
}
