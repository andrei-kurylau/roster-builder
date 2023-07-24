import { ListRecord } from "../components/players-list/interfaces/list-record";
import { Classes } from "../constants/classes";
import { ClassName } from "../enums/class-name";
import { Role } from "../enums/role";
import { Character } from "../interfaces/character";
import { Player } from "../interfaces/player";
import { Raid } from "../interfaces/raid";
import { CharacterPool, RaidConfig } from "../services/data-service.service";
import { GlobalHelpers } from "./global-helpers";
import { RaidScoreHelpers } from "./raid-score-helpers";

const ALT_MULTIPLIER = 0.75;
const OFFSPEC_MULTIPLIER = 0.5;

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

  public static getBestScoreChar(characters: Character[], raid: Raid): Character {
    const currentPenaltyPoints = RaidScoreHelpers.calculateRaidPenaltyPoints(raid);
    let bestCharOptions: Character[] = [];
    let currentBestCharScore = 0;

    for (let character of characters) {
      const raidCopy = GlobalHelpers.safeCopy(raid);
      this.addCharacterToRaid(raidCopy, character);
      const newPenaltyPoints = RaidScoreHelpers.calculateRaidPenaltyPoints(raidCopy);
      if (currentPenaltyPoints > newPenaltyPoints) {
        const charScore = (currentPenaltyPoints - newPenaltyPoints) * (character.isOffSpec ? OFFSPEC_MULTIPLIER : 1) * (character.isAlt ? ALT_MULTIPLIER : 1);
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
    const charsWhoCantGoOtherRaid = bestCharOptions.filter(char => !char.firstRaidAvailable || !char.secondRaidAvailable);

    if (charsWhoCantGoOtherRaid?.length > 0) {
      bestCharOptions = [...charsWhoCantGoOtherRaid];
    }

    const maxPriority = Math.max(...bestCharOptions.map(char => +char.priority));
    const finalPool = bestCharOptions.filter(char => +char.priority === maxPriority);
    return this.getRandomCharacter(finalPool);
  }

  public static getBestPossibleCharacterFromPool(pool: Character[], raid: Raid, config?: RaidConfig): Character {
    const role = pool[0]?.spec.role;

    switch (role) {
      case Role.Tank:
        const mainSpecTanks = pool.filter(char => !char.isOffSpec);

        if (raid.tanks.length < 2) {
          const paladinsInPool = pool.filter(char => char.class.name === ClassName.Paladin);
          const warriorsInPool = pool.filter(char => char.class.name === ClassName.Warrior);

          if (paladinsInPool?.length > 0) {
            const mainSpecPaladins = paladinsInPool.filter(char => !char.isOffSpec);
            if (mainSpecPaladins.length > 0) {
              return this.getBestScoreChar(mainSpecPaladins, raid);
            }
          }

          if (warriorsInPool?.length > 0) {
            const mainSpecWarriors = warriorsInPool.filter(char => !char.isOffSpec);
            if (mainSpecWarriors.length > 0) {
              return this.getBestScoreChar(mainSpecWarriors, raid);
            }
          }

          if (mainSpecTanks?.length > 0) {
            return this.getBestScoreChar(mainSpecTanks, raid);
          }

          if (paladinsInPool?.length > 0) {
            return this.getBestScoreChar(paladinsInPool, raid);
          }

          if (warriorsInPool?.length > 0) {
            return this.getBestScoreChar(warriorsInPool, raid);
          }
        } else {
          const palOrWarTanksInRaid = raid.tanks.filter(char => (char.class.name === ClassName.Warrior) || (char.class.name === ClassName.Paladin));

          if (mainSpecTanks?.length > 0) {
            if (palOrWarTanksInRaid.length >= 2) {
              const mainSpecDruids = pool.filter(char => !char.isOffSpec && char.class.name === ClassName.Druid);
              if (mainSpecDruids.length > 0) {
                return this.getBestScoreChar(mainSpecDruids, raid);
              }

              const mainSpecDKs = pool.filter(char => !char.isOffSpec && char.class.name === ClassName.DeathKnight);
              if (mainSpecDKs.length > 0) {
                return this.getBestScoreChar(mainSpecDruids, raid);
              }
            }

            return this.getBestScoreChar(mainSpecTanks, raid);
          }

          if (palOrWarTanksInRaid.length >= 2) {
            const offSpecDruids = pool.filter(char => char.class.name === ClassName.Druid);
            if (offSpecDruids.length > 0) {
              return this.getBestScoreChar(offSpecDruids, raid);
            }

            const offpecDKs = pool.filter(char => char.class.name === ClassName.DeathKnight);
            if (offpecDKs.length > 0) {
              return this.getBestScoreChar(offpecDKs, raid);
            }
          }
        }

        return this.getBestScoreChar(pool, raid);

      case Role.Healer:
        const mainSpecHealers = pool.filter(char => !char.isOffSpec);
        const healerPool = mainSpecHealers.length > 0 ? mainSpecHealers : pool;
        const paladinsCount = raid.healers.filter(char => char.class.name === ClassName.Paladin).length;
        const priestsCount = raid.healers.filter(char => char.class.name === ClassName.Priest).length;
        const shamansCount = raid.healers.filter(char => char.class.name === ClassName.Shaman).length;
        const druidsCount = raid.healers.filter(char => char.class.name === ClassName.Druid).length;

        if (paladinsCount < 2) {
          const paladinHealers = healerPool.filter(char => char.class.name === ClassName.Paladin);
          if (paladinHealers.length > 0) {
            return this.getBestScoreChar(paladinHealers, raid);
          }
        }

        if (priestsCount < 1) {
          const priestHealers = healerPool.filter(char => char.class.name === ClassName.Priest);
          if (priestHealers.length > 0) {
            return this.getBestScoreChar(priestHealers, raid);
          }
        }

        if (shamansCount < 1) {
          const shamanHealers = healerPool.filter(char => char.class.name === ClassName.Shaman);
          if (shamanHealers.length > 0) {
            return this.getBestScoreChar(shamanHealers, raid);
          }
        }

        if (druidsCount < 1) {
          const druidHealers = healerPool.filter(char => char.class.name === ClassName.Druid);
          if (druidHealers.length > 0) {
            return this.getBestScoreChar(druidHealers, raid);
          }
        }

        return this.getBestScoreChar(pool, raid);

      default:
        return this.getBestScoreChar(pool, raid);
    }
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
