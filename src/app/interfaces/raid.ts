import { Character } from "./character";

export interface Raid {
  tanks: Character[];
  dps: Character[];
  healers: Character[];
  bench: Character[];
}
