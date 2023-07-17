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

  public melee: Character[];
  public ranged: Character[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['raid']) {
      this.melee = [];
      this.ranged = [];
      this.raid.dps.forEach(char => {
        const dpsRole = [Role.MeleeDps, Role.RangedDps].includes(char.spec.role);
        if (!dpsRole) {
          return;
        }

        if (char.spec.role === Role.MeleeDps) {
          this.melee.push(char);
        } else {
          this.ranged.push(char);
        }
      })
    }
  }
}
