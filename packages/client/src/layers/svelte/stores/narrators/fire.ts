import { get } from "svelte/store";
import { ComponentUpdate } from "@latticexyz/recs";
import { seedToName } from "../../utils/name";
import { entities, indexToID } from "../entities";

export function fire(update: ComponentUpdate, isSelf: boolean) {
  if (isSelf) {
    return "You made a fire";
  } else {
    const entity = get(entities)[indexToID(update.entity)];
    return "A fire was created by " + seedToName(entity.seed || 0);
  }
}
