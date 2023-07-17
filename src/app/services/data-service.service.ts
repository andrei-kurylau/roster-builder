import { Injectable } from '@angular/core';
import { ListRecord } from '../components/players-list/interfaces/list-record';
import { Raid } from '../interfaces/raid';
import { Character } from '../interfaces/character';
import { Role } from '../enums/role';
import { DataHelpers } from '../helpers/data-helpers';
import { RaidScoreHelpers } from '../helpers/raid-score-helpers';

export interface CharacterPool {
  tanks: Character[];
  healers: Character[];
  dps: Character[];
}

export interface RosterVariaton {
  raidOne: Raid;
  raidTwo: Raid;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  numberOfTanks = 3;
  numberOfHealers = 5;
  numberOfDps = 17;

  constructor() { }

  public generateRosters(records: ListRecord[]): Raid[] {
    const players = DataHelpers.convertRecordsToPlayerModels(records);

    const availableCharacters: Character[] = [];
    players.forEach(player => {
      availableCharacters.push(...player.mainCharacter);
      availableCharacters.push(...player.alts);
    });

    const firstRaidAvailableChars = availableCharacters.filter(char => char.firstRaidAvailable);
    const secondRaidAvailableChars = availableCharacters.filter(char => char.secondRaidAvailable);


    const rosterVariations: RosterVariaton[] = [];

    let currentTry = 0;
    // Generate variations
    while (currentTry < 100000) {
      const raidOne: Raid = {
        tanks: [],
        healers: [],
        dps: [],
        bench: [],
      };
      const raidTwo: Raid = {
        tanks: [],
        healers: [],
        dps: [],
        bench: [],
      };

      const firstPool: CharacterPool = {
        tanks: DataHelpers.getCharactersByRole(firstRaidAvailableChars, [Role.Tank]),
        healers: DataHelpers.getCharactersByRole(firstRaidAvailableChars, [Role.Healer]),
        dps: DataHelpers.getCharactersByRole(firstRaidAvailableChars, [Role.MeleeDps, Role.RangedDps])
      }

      const secondPool: CharacterPool = {
        tanks: DataHelpers.getCharactersByRole(secondRaidAvailableChars, [Role.Tank]),
        healers: DataHelpers.getCharactersByRole(secondRaidAvailableChars, [Role.Healer]),
        dps: DataHelpers.getCharactersByRole(secondRaidAvailableChars, [Role.MeleeDps, Role.RangedDps])
      }

      for (let i = 0; i < this.numberOfTanks; i++) {
        const raidOneChar = DataHelpers.getRandomCharacter(firstPool.tanks);
        if (raidOneChar) {
          raidOne.tanks.push(raidOneChar);
          DataHelpers.removeCharactersFromPool([raidOneChar], firstPool, true);
          DataHelpers.removeCharactersFromPool([raidOneChar], secondPool);
        }

        const raidTwoChar = DataHelpers.getRandomCharacter(secondPool.tanks);
        if (raidTwoChar) {
          raidTwo.tanks.push(raidTwoChar);
          DataHelpers.removeCharactersFromPool([raidTwoChar], firstPool);
          DataHelpers.removeCharactersFromPool([raidTwoChar], secondPool, true);
        }
      }

      for (let i = 0; i < this.numberOfHealers; i++) {
        const raidOneChar = DataHelpers.getRandomCharacter(firstPool.healers);
        if (raidOneChar) {
          raidOne.healers.push(raidOneChar);
          DataHelpers.removeCharactersFromPool([raidOneChar], firstPool, true);
          DataHelpers.removeCharactersFromPool([raidOneChar], secondPool);
        }

        const raidTwoChar = DataHelpers.getRandomCharacter(secondPool.healers);
        if (raidTwoChar) {
          raidTwo.healers.push(raidTwoChar);
          DataHelpers.removeCharactersFromPool([raidTwoChar], firstPool);
          DataHelpers.removeCharactersFromPool([raidTwoChar], secondPool, true);
        }
      }

      for (let i = 0; i < this.numberOfDps; i++) {
        const raidOneChar = DataHelpers.getRandomCharacter(firstPool.dps);
        if (raidOneChar) {
          raidOne.dps.push(raidOneChar);
          DataHelpers.removeCharactersFromPool([raidOneChar], firstPool, true);
          DataHelpers.removeCharactersFromPool([raidOneChar], secondPool);
        }

        const raidTwoChar = DataHelpers.getRandomCharacter(secondPool.dps);
        if (raidTwoChar) {
          raidTwo.dps.push(raidTwoChar);
          DataHelpers.removeCharactersFromPool([raidTwoChar], firstPool);
          DataHelpers.removeCharactersFromPool([raidTwoChar], secondPool, true);
        }
      }

      raidOne.bench = DataHelpers.getAllAvailableCharactersFromPool(firstPool);
      raidTwo.bench = DataHelpers.getAllAvailableCharactersFromPool(secondPool);

      rosterVariations.push({
        raidOne,
        raidTwo,
        score: RaidScoreHelpers.calculateVariationScore(raidOne, raidTwo),
      })
      currentTry++;
    }

    if (rosterVariations.length === 0) {
      return [];
    }

    rosterVariations.sort((a,b) => {
      if (a.score > b.score) {
        return -1;
      }

      if (a.score < b.score) {
        return 1;
      }

      return 0;
    });

    console.log(rosterVariations.slice(0,5));

    return [rosterVariations[0]?.raidOne, rosterVariations[0]?.raidTwo];
  }

}
