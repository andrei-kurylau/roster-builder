export interface RaidCompMetric {
  buffs: { [x: string]: number };
  debuffs: { [x: string]: number };
  cooldowns: { [x: string]: number };
}

export interface ClassBalanceMetric {
  total: { [x: string]: number; };
  healers: { [x: string]: number };
  tanks: { [x: string]: number };
  melee: number;
  ranged: number;
}
