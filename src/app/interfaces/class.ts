import { ClassName } from "../enums/class-name";
import { Spec } from "./spec";

export interface PlayerClass {
  name: ClassName;
  specs: Spec[];
  color: string;
}
