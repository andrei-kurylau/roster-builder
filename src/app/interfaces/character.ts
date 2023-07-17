import { PlayerClass } from "./class";
import { Spec } from "./spec";

export interface Character {
  name?: string;
  class: PlayerClass;
  spec: Spec;
  isOffSpec?: true,
  isAlt?: boolean;
  priority?: number;
  firstRaidAvailable?: boolean;
  secondRaidAvailable?: boolean;
  gearScore?: number;
  avgLog?: number;
  id: string;
}
