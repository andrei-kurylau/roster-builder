import { Injectable } from '@angular/core';
import { ListRecord } from '../components/players-list/interfaces/list-record';
import { Raid } from '../interfaces/raid';
import { Character } from '../interfaces/character';
import { Role } from '../enums/role';
import { DataHelpers } from '../helpers/data-helpers';
import { RaidScoreHelpers } from '../helpers/raid-score-helpers';
import { GlobalHelpers } from '../helpers/global-helpers';

const NUMBER_OF_ITERATIONS = 50000;

export interface CharacterPool {
  tanks: Character[];
  healers: Character[];
  dps: Character[];
}

export interface RaidVariation {
  raidOne: Raid;
  raidTwo: Raid;
  score: number;
}

export interface RaidConfig {
  numberOfTanks: number;
  numberOfHealers: number;
  numberOfDps: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private raidOneConfig: RaidConfig = {
    numberOfTanks: 3,
    numberOfHealers: 4,
    numberOfDps: 18,
  }
  private raidTwoConfig: RaidConfig = {
    numberOfTanks: 3,
    numberOfHealers: 4,
    numberOfDps: 18,
  }

  constructor() { }

  public generateRosters(records: ListRecord[]): Raid[] {
    const players = DataHelpers.convertRecordsToPlayerModels(records);

    const availableCharacters: Character[] = [];

    players.forEach(player => {
      availableCharacters.push(...player.mainCharacter);
      availableCharacters.push(...player.alts);
    });

    let variations: RaidVariation[] = [];

    for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
      variations.push(this.generateVariation(availableCharacters));
    }

    variations = variations.filter(variation => !!variation.score);

    variations.sort((a,b) => {
      if (a.score > b.score) {
        return -1;
      }

      if (a.score < b.score) {
        return 1;
      }

      return 0;
    });

    console.log(variations);
    return [variations[0].raidOne, variations[0].raidTwo];
  }

  private generateVariation(availableCharacters: Character[]): RaidVariation {
    const firstRaidAvailableChars = availableCharacters.filter(char => char.firstRaidAvailable);
    const secondRaidAvailableChars = availableCharacters.filter(char => char.secondRaidAvailable);

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

    let canContinue = true;
    while (canContinue) {
      let raidOneChar: Character;
      let raidTwoChar: Character;

      const addCharToFirstRaid = () => {
        raidOneChar = this.getBestPossibleCharacterForRaid(raidOne, firstPool, this.raidOneConfig);
        if (raidOneChar) {
          DataHelpers.addCharacterToRaid(raidOne, raidOneChar);
          DataHelpers.removeCharactersFromPool([raidOneChar], firstPool, true);
          DataHelpers.removeCharactersFromPool([raidOneChar], secondPool);
        }
      };

      const addCharToSecondRaid = () => {
        raidTwoChar = this.getBestPossibleCharacterForRaid(raidTwo, secondPool, this.raidTwoConfig);
        if (raidTwoChar) {
          DataHelpers.addCharacterToRaid(raidTwo, raidTwoChar);
          DataHelpers.removeCharactersFromPool([raidTwoChar], firstPool);
          DataHelpers.removeCharactersFromPool([raidTwoChar], secondPool, true);
        }
      };

      const whereToStart = GlobalHelpers.randomNumberFromInterval(1, 2);

      if (whereToStart === 1) {
        addCharToFirstRaid();
        addCharToSecondRaid();
      } else {
        addCharToSecondRaid();
        addCharToFirstRaid();
      }

      canContinue = !!raidOneChar || !!raidTwoChar;
    }

    raidOne.bench = DataHelpers.getAllAvailableCharactersFromPool(firstPool);
    raidTwo.bench = DataHelpers.getAllAvailableCharactersFromPool(secondPool);

    return {
      raidOne,
      raidTwo,
      score: RaidScoreHelpers.calculateVariationScore(raidOne, raidTwo),
    }
  }

  private getBestPossibleCharacterForRaid(raid: Raid, pool: CharacterPool, config: RaidConfig): Character {
    if (raid.tanks.length < config.numberOfTanks && pool.tanks.length > 0) {
      return DataHelpers.getBestPossibleCharacterFromPool(pool.tanks, raid, config);
    }

    if (raid.healers.length < config.numberOfHealers && pool.healers.length > 0) {
      return DataHelpers.getBestPossibleCharacterFromPool(pool.healers, raid, config);
    }

    if ((raid.dps.length < config.numberOfDps && pool.dps.length > 0)) {
      return DataHelpers.getBestPossibleCharacterFromPool(pool.dps, raid, config);
    }

    return null;
  }
}
