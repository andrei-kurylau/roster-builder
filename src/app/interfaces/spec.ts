import { Role } from "../enums/role";
import { SpecName } from "../enums/spec-name";

export interface Spec {
  name: SpecName;
  displayName: string;
  role: Role;
}
