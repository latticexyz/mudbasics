import { get } from "svelte/store";
import { ComponentUpdate } from "@latticexyz/recs";
import { seedToName } from "../../utils/name";
import { entities, indexToID } from "../entities";

export function fire(update: ComponentUpdate, isSelf: boolean) {
  console.log(update);
  if (isSelf) {
    return "You made a fire";
  } else {
    const entity = get(entities)[indexToID(update.entity)];
    console.log(entity);
    return "A fire was created by " + seedToName(entity.seed);
  }
}
