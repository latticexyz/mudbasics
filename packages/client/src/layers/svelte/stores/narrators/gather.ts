import { get } from "svelte/store";
import { ComponentUpdate } from "@latticexyz/recs";
import { seedToName } from "../../utils/name";
import { indexToID, entities } from "../entities";
import { sample } from "lodash";

export function gather(update: ComponentUpdate, isSelf: boolean) {
  const oldValue = Number(update.value[1]?.value || 0);
  const newValue = Number(update.value[0]?.value || 0);

  if (isSelf) {
    return "You dug up " + (newValue - oldValue) + " sludge";
  } else {
    const entity = get(entities)[indexToID(update.entity)];
    return seedToName(entity.seed) + " dug up " + (newValue - oldValue) + " sludge";
  }
}
