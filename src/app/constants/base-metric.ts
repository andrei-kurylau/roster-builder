import { Buff } from "../enums/buff";
import { ClassName } from "../enums/class-name";
import { Cooldown } from "../enums/cooldown";
import { Debuff } from "../enums/debuff";
import { ClassBalanceMetric, RaidCompMetric } from "../interfaces/metrics";

export const BaseRaidCompMetric: RaidCompMetric = {
  buffs: {
    [Buff.GiftOfTheWild]: 0,
    [Buff.PaladinBlessing]: 0,
    [Buff.StrengthAgility]: 0,
    [Buff.PercentAP]: 0,
    [Buff.PhysCrit]: 0,
    [Buff.MeleeHaste]: 0,
    [Buff.GlobalDamage]: 0,
    [Buff.GlobalHaste]: 0,
    [Buff.Intellect]: 0,
    [Buff.SpellPower]: 0,
    [Buff.SpellCrit]: 0,
    [Buff.SpellHaste]: 0,
    [Buff.Spirit]: 0,
    [Buff.Stamina]: 0,
    [Buff.Health]: 0,
    [Buff.BlessingOfSanctuary]: 0,
    [Buff.PassiveHealing]: 0,
    [Buff.ManaReplenishment]: 0,
  },
  debuffs: {
    [Debuff.BleedDamage]: 0,
    [Debuff.PhysicalDamage]: 0,
    [Debuff.GlobalCrit]: 0,
    [Debuff.SpellCrit]: 0,
    [Debuff.SpellHit]: 0,
    [Debuff.SpellDamage]: 0,
    [Debuff.Armor20]: 0,
    [Debuff.Armor5]: 0,
    [Debuff.AttackSpeedReduction]: 0,
    [Debuff.AttackPowerReduction]: 0,
    [Debuff.HitReduction]: 0,
    [Debuff.PaladinJudgement]: 0,
  },
  cooldowns: {
    [Cooldown.BattleRes]: 0,
    [Cooldown.ManaRestorationCooldown]: 0,
    [Cooldown.DSac]: 0,
    [Cooldown.MasterAura]: 0,
    [Cooldown.Misdirection]: 0,
    [Cooldown.TargetDRCooldown]: 0,
    [Cooldown.Heroism]: 0,
    [Cooldown.Healthstone]: 0,
  },
}

export const BaseClassBalanceMetric: ClassBalanceMetric = {
  total: {
    [ClassName.Druid]: 0,
    [ClassName.Priest]: 0,
    [ClassName.Warrior]: 0,
    [ClassName.Paladin]: 0,
    [ClassName.Mage]: 0,
    [ClassName.Shaman]: 0,
    [ClassName.DeathKnight]: 0,
    [ClassName.Rogue]: 0,
    [ClassName.Hunter]: 0,
    [ClassName.Warlock]: 0,
  },
  healers: {
    [ClassName.Shaman]: 0,
    [ClassName.Paladin]: 0,
    [ClassName.Druid]: 0,
    [ClassName.Priest]: 0,
  },
  tanks: {
    [ClassName.Paladin]: 0,
    [ClassName.Warrior]: 0,
    [ClassName.Druid]: 0,
    [ClassName.DeathKnight]: 0,
  },
  melee: 0,
  ranged: 0,
}


