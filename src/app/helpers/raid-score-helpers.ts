import { BaseClassBalanceMetric, BaseRaidCompMetric } from "../constants/base-metric";
import { SpecDetails } from "../constants/spec-details";
import { Buff } from "../enums/buff";
import { ClassName } from "../enums/class-name";
import { Cooldown } from "../enums/cooldown";
import { Role } from "../enums/role";
import { RaidCompMetric, ClassBalanceMetric } from "../interfaces/metrics";
import { Raid } from "../interfaces/raid";
import { DataHelpers } from "./data-helpers";
import { GlobalHelpers } from "./global-helpers";

export class RaidScoreHelpers {

  public static calculateRaidPenaltyPoints(raid: Raid): number {
    let score = 0;
    // score penalty for missing people in raid
    const raidCount = raid.tanks.length + raid.healers.length + raid.dps.length;
    score = score - (25 - raidCount) * 200;

    // calculate metrics
    const metric = this.getRaidMetric(raid);

    // penalty for missing buffs
    for (let buffId in metric.buffs) {
      if (metric.buffs[buffId] === 0) {
        score = score - 150;
      }
    }

    // penalty for paladin blessings
    if (metric.buffs[Buff.PaladinBlessing] < 3) {
      score = score - (3 - metric.buffs[Buff.PaladinBlessing]) * 25;
    }

    // penalty for missing debuffs
    for (let debuffId in metric.debuffs) {
      if (metric.debuffs[debuffId] === 0) {
        score = score - 150;
      }
    }

    // penalty for stackable quality of life buffs
    if (metric.buffs[Buff.ManaReplenishment] < 2) {
      score = score - (2 - metric.buffs[Buff.ManaReplenishment]) * 20;
    }

    if (metric.buffs[Buff.PassiveHealing] < 3) {
      score = score - (3 - metric.buffs[Buff.PassiveHealing]) * 20;
    }

    // penalty for missing cooldowns
    for (let cooldownId in metric.cooldowns) {
      if (metric.cooldowns[cooldownId] === 0) {
        score = score - 20;
      }
    }

    // penalties for specific cooldowns
    if (metric.cooldowns[Cooldown.DSac] < 2) {
      score = score - (2 - metric.cooldowns[Cooldown.DSac]) * 20;
    }

    if (metric.cooldowns[Cooldown.BattleRes] < 2) {
      score = score - (2 - metric.cooldowns[Cooldown.BattleRes]) * 20;
    }

    if (metric.cooldowns[Cooldown.Heroism] < 1) {
      score = score - 500;
    }

    const raidClassMetric = this.getClassBalanceMetric(raid);
    // apply penalty for not balanced healer setup
    if (raidClassMetric.healers[ClassName.Paladin] !== 2) {
      score = score - 200 * Math.abs(2 - raidClassMetric.healers[ClassName.Paladin]);
    }
    if (raidClassMetric.healers[ClassName.Shaman] + raidClassMetric.healers[ClassName.Druid] < 1) {
      score = score - 200;
    }
    if (raidClassMetric.healers[ClassName.Priest] < 1) {
      score = score - 200;
    }

    // apply penalty for not optimal tank setup
    if ((raidClassMetric.tanks[ClassName.Paladin] + raidClassMetric.tanks[ClassName.Warrior]) < 2) {
      score = score - 200 * (2 - raidClassMetric.tanks[ClassName.Paladin] - raidClassMetric.tanks[ClassName.Warrior]);
    }

    if (raid.tanks.length > 2 && raidClassMetric.tanks[ClassName.Druid] < 1) {
      score = score - 200;
    }

    return Math.abs(score);
  }

  public static calculateVariationScore(raidOne: Raid, raidTwo: Raid): number {
    let score = 10000;

    // apply penalties for raid comp issues (buffs debuffs cooldowns)
    score = score - this.calculateRaidPenaltyPoints(raidOne);
    score = score - this.calculateRaidPenaltyPoints(raidTwo);

    // apply penalty for class balance (equal amount of each class in raids)
    const raidOneClassMetric = this.getClassBalanceMetric(raidOne);
    const raidTwoClassMetric = this.getClassBalanceMetric(raidTwo);

    Object.keys(ClassName).forEach(className => {
      const classCountDiff = Math.abs(raidOneClassMetric.total[className] - raidTwoClassMetric.total[className]);
      if (classCountDiff > 1) {
        score = score - 100 * classCountDiff;
      }
    })

    // apply penalty for bad melee/ranged balance
    const raidOneMeleeRangedDiff = Math.abs(raidOneClassMetric.melee - raidOneClassMetric.ranged);
    if (raidOneMeleeRangedDiff > 2) {
      score = score - 25 * raidOneMeleeRangedDiff;
    }
    const raidTwoMeleeRangedDiff = Math.abs(raidTwoClassMetric.melee - raidTwoClassMetric.ranged);
    if (raidTwoMeleeRangedDiff > 2) {
      score = score - 25 * raidTwoMeleeRangedDiff;
    }

    // apply penalties for priority score
    const raidOnePrioritySum = RaidScoreHelpers.calculatePrioritySum(raidOne);
    const raidTwoPrioritySum = RaidScoreHelpers.calculatePrioritySum(raidTwo);
    const priorityDiff = Math.abs(raidOnePrioritySum - raidTwoPrioritySum);
    if (priorityDiff > 3) {
      score = score - priorityDiff * 10;
    }

    // calculating alts and offspecs count
    const raidOneChars = [...raidOne.tanks, ...raidOne.dps, ...raidOne.healers];
    const raidOneAltsCount = raidOneChars.filter(char => char.isAlt).length;
    const raidOneOffspecCount = raidOneChars.filter(char => char.isOffSpec).length;

    const raidTwoChars = [...raidTwo.tanks, ...raidTwo.dps, ...raidTwo.healers];
    const raidTwoAltsCount = raidTwoChars.filter(char => char.isAlt).length;
    const raidTwoOffspecCount = raidTwoChars.filter(char => char.isOffSpec).length;

    // apply penalties for not balanced alts and offspec numbers
    const altsCountDiff = Math.abs(raidOneAltsCount - raidTwoAltsCount);
    if (altsCountDiff > 1) {
      score = score - (20 * altsCountDiff);
    }
    const offspecCountDiff = Math.abs(raidOneOffspecCount - raidTwoOffspecCount);
    if (offspecCountDiff > 1) {
      score = score - (20 * altsCountDiff);
    }

    // apply penalty for not balanced bench
    const benchLengthDiff = Math.abs(raidOne.bench.length - raidTwo.bench.length);
    if (benchLengthDiff > 1) {
      score = score - (20 * benchLengthDiff);
    }

    // apply penalty for benched high priority chars
    const benchedCharsWithHighScore = [...raidOne.bench, ...raidTwo.bench].filter(char => char.priority >= 9).length;
    score = score - (100 * benchedCharsWithHighScore);

    // apply penalty for benched mains if alts are in the raid
    const benchedMains = [...raidOne.bench, ...raidTwo.bench].filter(char => !char.isAlt).length;
    if (benchedMains > 0 && (raidOneAltsCount + raidTwoAltsCount) > 0) {
      score = score - (100 * benchedMains);
    }

    return score;
  }

  public static getRaidMetric(raid: Raid): RaidCompMetric {
    const metric = GlobalHelpers.safeCopy(BaseRaidCompMetric);
    const characters = DataHelpers.getAllAvailableCharactersFromPool(raid);
    characters.forEach(char => {
      const details = SpecDetails[char.spec.name];
      details.buffs.forEach(buff => metric.buffs[buff]++);
      details.debuffs.forEach(debuff => metric.debuffs[debuff]++);
      details.cooldowns.forEach(cooldown => metric.cooldowns[cooldown]++);
    })

    return metric;
  }

  public static getClassBalanceMetric(raid: Raid): ClassBalanceMetric {
    const metric = GlobalHelpers.safeCopy(BaseClassBalanceMetric);
    const characters = DataHelpers.getAllAvailableCharactersFromPool(raid);
    characters.forEach(char => {
      metric.total[char.class.name]++;

      if (char.spec.role === Role.Healer) {
        metric.healers[char.class.name]++;
      }

      if (char.spec.role === Role.Tank) {
        metric.tanks[char.class.name]++;
      }

      if (char.spec.role === Role.MeleeDps) {
        metric.melee++;
      }

      if (char.spec.role === Role.RangedDps) {
        metric.ranged++;
      }
    })

    return metric;
  }

  public static calculatePrioritySum(raid: Raid): number {
    const characters = DataHelpers.getAllAvailableCharactersFromPool(raid);
    let count = 0;
    characters.forEach(char => count = count + (+char.priority));
    return count;
  }
}
