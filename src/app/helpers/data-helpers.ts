import { ListRecord } from "../components/players-list/interfaces/list-record";
import { Classes } from "../constants/classes";
import { Role } from "../enums/role";
import { Character } from "../interfaces/character";
import { Player } from "../interfaces/player";
import { Raid } from "../interfaces/raid";
import { CharacterPool } from "../services/data-service.service";
import { GlobalHelpers } from "./global-helpers";
import { RaidScoreHelpers } from "./raid-score-helpers";

export class DataHelpers {
  public static removeCharactersFromPool(chars: Character[], pool: CharacterPool, removeAlts: boolean = false): void {
    if (chars.length === 0) {
      return;
    }

    if (removeAlts) {
      const charNames = chars.map(char => char?.name);
      pool.tanks = pool.tanks.filter(char => !charNames.includes(char.name));
      pool.dps = pool.dps.filter(char => !charNames.includes(char.name));
      pool.healers = pool.healers.filter(char => !charNames.includes(char.name));
    } else {
      const ids = chars.map(char => char?.id);
      pool.tanks = pool.tanks.filter(char => !ids.includes(char.id));
      pool.dps = pool.dps.filter(char => !ids.includes(char.id));
      pool.healers = pool.healers.filter(char => !ids.includes(char.id));
    }
  }

  public static getCharactersByRole(pool: Character[], roles: Role[]): Character[] {
    return pool.filter(char => roles.includes(char.spec.role));
  }

  public static convertRecordsToPlayerModels(records: ListRecord[]): Player[] {
    const filteredRecords = records.filter(rec => !!rec.name && !!rec.mainClass && !!rec.mainSpec);

    return filteredRecords.map(rec => {
      const player: Player = {
        name: rec.name,
        mainCharacter: [],
        alts: [],
      };

      const mainCharId = GlobalHelpers.generateGuid();
      player.mainCharacter.push({
        id: mainCharId,
        name: rec.name,
        class: Classes[rec.mainClass],
        priority: rec.priority,
        spec: Classes[rec.mainClass].specs.find(spec => spec.name === rec.mainSpec),
        isAlt: false,
        isOffSpec: false,
        firstRaidAvailable: rec.firstRaidAvailable,
        secondRaidAvailable: rec.secondRaidAvailable,
      });

      if (rec.offSpec) {
        player.mainCharacter.push({
          id: mainCharId,
          name: rec.name,
          class: Classes[rec.mainClass],
          priority: rec.priority,
          spec: Classes[rec.mainClass].specs.find(spec => spec.name === rec.offSpec),
          isAlt: false,
          isOffSpec: true,
          firstRaidAvailable: rec.firstRaidAvailable,
          secondRaidAvailable: rec.secondRaidAvailable,
        });
      }

      if (rec.altClass && rec.altMainSpec) {
        const altId = GlobalHelpers.generateGuid();
        player.alts.push({
          id: altId,
          name: rec.name,
          class: Classes[rec.altClass],
          priority: rec.altPriority,
          spec: Classes[rec.altClass].specs.find(spec => spec.name === rec.altMainSpec),
          firstRaidAvailable: rec.firstRaidAvailable,
          secondRaidAvailable: rec.secondRaidAvailable,
          isAlt: true,
        });

        if (rec.altOffSpec) {
          player.alts.push({
            id: altId,
            name: rec.name,
            class: Classes[rec.altClass],
            priority: rec.altPriority,
            spec: Classes[rec.altClass].specs.find(spec => spec.name === rec.altOffSpec),
            isOffSpec: true,
            firstRaidAvailable: rec.firstRaidAvailable,
            secondRaidAvailable: rec.secondRaidAvailable,
            isAlt: true,
          });
        }
      };

      return player;
    })
  }

  public static addCharacterToRaid(raid: Raid, char: Character): void {
    switch (char.spec.role) {
      case Role.Tank:
        raid.tanks.push(char);
        break;
      case Role.Healer:
        raid.healers.push(char);
        break;
      default:
        raid.dps.push(char);
        break;
    }
  }

  public static getBestPossibleCharacterFromPool(pool: Character[], raidOne: Raid): Character {
    const currentPenaltyPoints = RaidScoreHelpers.calculateRaidPenaltyPoints(raidOne);
    let bestCharOptions: Character[] = [];
    let currentBestCharScore = 0;

    for (let character of pool) {
      const raidCopy = GlobalHelpers.safeCopy(raidOne);
      this.addCharacterToRaid(raidCopy, character);
      const newPenaltyPoints = RaidScoreHelpers.calculateRaidPenaltyPoints(raidCopy);
      if (currentPenaltyPoints > newPenaltyPoints) {
        const charScore = (currentPenaltyPoints - newPenaltyPoints) * (character.priority / 100) * (character.isOffSpec ? 0.5 : 1) * (character.isAlt ? 0.7 : 1);
        if (currentBestCharScore < charScore) {
          currentBestCharScore = charScore;
          bestCharOptions = [character];
        }
        if (currentBestCharScore === charScore) {
          bestCharOptions.push(character);
        }
      }
    }

    // priority goes for characters who cant go to other raid
    const filteredCharacters = bestCharOptions.filter(char => !char.firstRaidAvailable || !char.secondRaidAvailable);

    if (filteredCharacters?.length > 0) {
      return this.getRandomCharacter(filteredCharacters);
    }

    return this.getRandomCharacter(bestCharOptions);
  }

  public static getRandomCharacter(array: Character[]): Character {
    if (!array.length) {
      return null;
    }

    const notAltMainSpecArray = array.filter(char => !char.isAlt && !char.isOffSpec);

    if (notAltMainSpecArray.length > 0) {
      const index = GlobalHelpers.randomNumberFromInterval(0, notAltMainSpecArray.length - 1);
      return notAltMainSpecArray[index];
    }

    const mainSpecArray = array.filter(char => !char.isOffSpec);

    if (mainSpecArray.length > 0) {
      const index = GlobalHelpers.randomNumberFromInterval(0, mainSpecArray.length - 1);
      return mainSpecArray[index];
    }

    const index = GlobalHelpers.randomNumberFromInterval(0, array.length - 1);
    return array[index];
  }

  public static getAllAvailableCharactersFromPool(pool: CharacterPool | Raid): Character[] {
    const availableChars = [];
    [...pool.tanks, ...pool.healers, ...pool.dps].forEach(char => {
      if (!availableChars.find(avChar => avChar.id === char.id)) {
        availableChars.push(char);
      }
    });
    return availableChars;
  }
}
