import { get } from "svelte/store";
import { ComponentUpdate } from "@latticexyz/recs";
import { seedToName } from "../../utils/name";
import { indexToID, entities } from "../entities";

export function birth(update: ComponentUpdate, isSelf: boolean) {
  const entity = get(entities)[indexToID(update.entity)];
  return seedToName(entity.seed || 0) + " came into the world.";
}
