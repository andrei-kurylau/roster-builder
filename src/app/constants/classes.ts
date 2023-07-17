import { ClassName } from "../enums/class-name";
import { Role } from "../enums/role";
import { SpecName } from "../enums/spec-name";
import { PlayerClass } from "../interfaces/class";

export const Classes: { [x: string]: PlayerClass } = {
  Druid: {
    name: ClassName.Druid,
    specs: [
      {
        name: SpecName.Balance,
        displayName: 'Balance',
        role: Role.RangedDps
      },
      {
        name: SpecName.FeralDPS,
        displayName: 'Feral DPS',
        role: Role.MeleeDps
      },
      {
        name: SpecName.FeralTank,
        displayName: 'Feral Tank',
        role: Role.Tank
      },
      {
        name: SpecName.RestoDruid,
        displayName: 'Restoration',
        role: Role.Healer
      }
    ],
    color: 'rgb(255, 124, 10)'
  },
  Warrior: {
    name: ClassName.Warrior,
    specs: [
      {
        name: SpecName.Arms,
        displayName: 'Arms',
        role: Role.MeleeDps
      },
      {
        name: SpecName.Fury,
        displayName: 'Fury',
        role: Role.MeleeDps
      },
      {
        name: SpecName.ProtWar,
        displayName: 'Protection',
        role: Role.Tank
      }
    ],
    color: 'rgb(198, 155, 109)'
  },
  Rogue: {
    name: ClassName.Rogue,
    specs: [
      {
        name: SpecName.Assa,
        displayName: 'Assasination',
        role: Role.MeleeDps
      },
      {
        name: SpecName.Combat,
        displayName: 'Combat',
        role: Role.MeleeDps
      }
    ],
    color: 'rgb(255, 244, 104)'
  },
  Hunter: {
    name: ClassName.Hunter,
    specs: [{
      name: SpecName.MM,
      displayName: 'Marsmanship',
      role: Role.RangedDps
    },
    {
      name: SpecName.Surv,
      displayName: 'Survival',
      role: Role.RangedDps
    },],
    color: 'rgb(170, 211, 114)'
  },
  Paladin: {
    name: ClassName.Paladin,
    specs: [
      {
        name: SpecName.HolyPal,
        displayName: 'Holy',
        role: Role.Healer
      },
      {
        name: SpecName.ProtPal,
        displayName: 'Protection',
        role: Role.Tank
      },
      {
        name: SpecName.Retri,
        displayName: 'Retribution',
        role: Role.MeleeDps
      }
    ],
    color: 'rgb(244, 140, 186)'
  },
  Priest: {
    name: ClassName.Priest,
    specs: [
      {
        name: SpecName.Disc,
        displayName: 'Discipline',
        role: Role.Healer
      },
      {
        name: SpecName.HolyPriest,
        displayName: 'Holy',
        role: Role.Healer
      },
      {
        name: SpecName.Shadow,
        displayName: 'Shadow',
        role: Role.RangedDps
      }
    ],
    color: 'rgb(255, 255, 255)'
  },
  Mage: {
    name: ClassName.Mage,
    specs: [
      {
        name: SpecName.Fire,
        displayName: 'Fire',
        role: Role.RangedDps
      },
      {
        name: SpecName.Arcane,
        displayName: 'Arcane',
        role: Role.RangedDps
      }
    ],
    color: 'rgb(63, 199, 235)'
  },
  Warlock: {
    name: ClassName.Warlock,
    specs: [
      {
        name: SpecName.Affli,
        displayName: 'Affliction',
        role: Role.RangedDps
      },
      {
        name: SpecName.Demo,
        displayName: 'Demonology',
        role: Role.RangedDps
      }
    ],
    color: 'rgb(148, 130, 201)'
  },
  DeathKnight: {
    name: ClassName.DeathKnight,
    specs: [
      {
        name: SpecName.Blood,
        displayName: 'Blood',
        role: Role.Tank
      },
      {
        name: SpecName.Frost,
        displayName: 'Frost',
        role: Role.MeleeDps
      },
      {
        name: SpecName.Unholy,
        displayName: 'Unholy',
        role: Role.MeleeDps
      }
    ],
    color: 'rgb(196, 30, 58)'
  },
  Shaman: {
    name: ClassName.Shaman,
    specs: [
      {
        name: SpecName.Elem,
        displayName: 'Elemental',
        role: Role.RangedDps
      },
      {
        name: SpecName.Ench,
        displayName: 'Enchancement',
        role: Role.MeleeDps
      },
      {
        name: SpecName.RestoShaman,
        displayName: 'Restoration',
        role: Role.Healer
      }
    ],
    color: 'rgb(0, 112, 221)'
  }
}
