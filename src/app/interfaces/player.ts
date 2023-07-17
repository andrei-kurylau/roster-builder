import { Character } from "./character";

export interface Player {
  name: string;
  mainCharacter: Character[];
  alts: Character[];
}
