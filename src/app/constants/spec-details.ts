import { Buff } from "../enums/buff";
import { Cooldown } from "../enums/cooldown";
import { Debuff } from "../enums/debuff";
import { SpecName } from "../enums/spec-name";

export const SpecDetails: {
  [x: string]: {
    buffs: Buff[],
    debuffs: Debuff[],
    cooldowns?: Cooldown[],
  }
} = {
  // Druid
  [SpecName.Balance]: {
    buffs: [Buff.GiftOfTheWild, Buff.SpellHaste, Buff.SpellCrit],
    debuffs: [Debuff.SpellHit, Debuff.SpellDamage, Debuff.HitReduction, Debuff.Armor5],
    cooldowns: [Cooldown.ManaRestorationCooldown, Cooldown.BattleRes]
  },
  [SpecName.FeralDPS]: {
    buffs: [Buff.GiftOfTheWild, Buff.PhysCrit, Buff.PassiveHealing],
    debuffs: [Debuff.BleedDamage, Debuff.Armor5],
    cooldowns: [Cooldown.ManaRestorationCooldown, Cooldown.BattleRes]
  },
  [SpecName.FeralTank]: {
    buffs: [Buff.GiftOfTheWild, Buff.PhysCrit, Buff.PassiveHealing],
    debuffs: [Debuff.BleedDamage, Debuff.Armor5],
    cooldowns: [Cooldown.ManaRestorationCooldown, Cooldown.BattleRes]
  },
  [SpecName.RestoDruid]: {
    buffs: [Buff.GiftOfTheWild],
    debuffs: [],
    cooldowns: [Cooldown.ManaRestorationCooldown, Cooldown.BattleRes]
  },
  // Warrior
  [SpecName.Arms]: {
    buffs: [Buff.Health],
    debuffs: [Debuff.BleedDamage, Debuff.Armor20, Debuff.PhysicalDamage],
    cooldowns: []
  },
  [SpecName.Fury]: {
    buffs: [Buff.Health, Buff.PhysCrit],
    debuffs: [Debuff.Armor20],
    cooldowns: []
  },
  [SpecName.ProtWar]: {
    buffs: [Buff.Health],
    debuffs: [Debuff.Armor20, Debuff.AttackSpeedReduction],
    cooldowns: []
  },
  // Paladin
  [SpecName.HolyPal]: {
    buffs: [Buff.PaladinBlessing],
    debuffs: [Debuff.PaladinJudgement],
    cooldowns: [Cooldown.DSac, Cooldown.MasterAura, Cooldown.TargetDRCooldown]
  },
  [SpecName.ProtPal]: {
    buffs: [Buff.PaladinBlessing, Buff.BlessingOfSanctuary],
    debuffs: [Debuff.PaladinJudgement, Debuff.AttackPowerReduction, Debuff.AttackSpeedReduction],
    cooldowns: [Cooldown.DSac, Cooldown.TargetDRCooldown]
  },
  [SpecName.Retri]: {
    buffs: [Buff.PaladinBlessing, Buff.GlobalDamage, Buff.GlobalHaste],
    debuffs: [Debuff.PaladinJudgement, Debuff.AttackPowerReduction],
    cooldowns: [Cooldown.MasterAura, Cooldown.TargetDRCooldown]
  },
  // Rogue
  [SpecName.Assa]: {
    buffs: [],
    debuffs: [Debuff.GlobalCrit],
    cooldowns: [Cooldown.Misdirection]
  },
  [SpecName.Combat]: {
    buffs: [],
    debuffs: [Debuff.PhysicalDamage, Debuff.Armor20],
    cooldowns: [Cooldown.Misdirection]
  },
  // Hunter
  [SpecName.MM]: {
    buffs: [Buff.PercentAP],
    debuffs: [],
    cooldowns: [Cooldown.Misdirection]
  },
  [SpecName.Surv]: {
    buffs: [Buff.ManaReplenishment],
    debuffs: [],
    cooldowns: [Cooldown.Misdirection]
  },
   // Priest
   [SpecName.Disc]: {
    buffs: [Buff.Stamina, Buff.Spirit],
    debuffs: [],
    cooldowns: [Cooldown.TargetDRCooldown, Cooldown.ManaRestorationCooldown]
  },
  [SpecName.HolyPriest]: {
    buffs: [Buff.Stamina, Buff.Spirit],
    debuffs: [],
    cooldowns: [Cooldown.TargetDRCooldown, Cooldown.ManaRestorationCooldown]
  },
  [SpecName.Shadow]: {
    buffs: [Buff.Stamina, Buff.Spirit, Buff.ManaReplenishment, Buff.PassiveHealing],
    debuffs: [Debuff.SpellHit],
    cooldowns: [Cooldown.ManaRestorationCooldown]
  },
  // Warlock
  [SpecName.Affli]: {
    buffs: [Buff.Intellect, Buff.Spirit],
    debuffs: [Debuff.SpellCrit, Debuff.SpellDamage],
    cooldowns: [Cooldown.Healthstone]
  },
  [SpecName.Demo]: {
    buffs: [Buff.SpellPower],
    debuffs: [Debuff.SpellCrit, Debuff.SpellDamage],
    cooldowns: [Cooldown.Healthstone]
  },
  // Shaman
  [SpecName.Elem]: {
    buffs: [Buff.SpellCrit, Buff.SpellHaste, Buff.SpellPower, Buff.StrengthAgility, Buff.PassiveHealing, Buff.SpellHaste],
    debuffs: [Debuff.GlobalCrit],
    cooldowns: [Cooldown.Heroism]
  },
  [SpecName.Ench]: {
    buffs: [Buff.PercentAP, Buff.MeleeHaste, Buff.StrengthAgility, Buff.SpellHaste, Buff.PassiveHealing],
    debuffs: [],
    cooldowns: [Cooldown.Heroism]
  },
  [SpecName.RestoShaman]: {
    buffs: [Buff.StrengthAgility, Buff.PassiveHealing, Buff.SpellHaste],
    debuffs: [],
    cooldowns: [Cooldown.Heroism, Cooldown.ManaRestorationCooldown]
  },
  // Death Knight
  [SpecName.Blood]: {
    buffs: [Buff.PercentAP, Buff.StrengthAgility, Buff.MeleeHaste],
    debuffs: [Debuff.AttackSpeedReduction],
    cooldowns: []
  },
  [SpecName.Frost]: {
    buffs: [Buff.StrengthAgility, Buff.MeleeHaste],
    debuffs: [Debuff.AttackSpeedReduction],
    cooldowns: []
  },
  [SpecName.Unholy]: {
    buffs: [Buff.StrengthAgility],
    debuffs: [Debuff.AttackSpeedReduction, Debuff.SpellDamage],
    cooldowns: []
  },
  // Mage
  [SpecName.Fire]: {
    buffs: [Buff.Intellect],
    debuffs: [Debuff.SpellCrit],
    cooldowns: []
  },
  [SpecName.Arcane]: {
    buffs: [Buff.Intellect, Buff.GlobalDamage],
    debuffs: [],
    cooldowns: []
  },
}
