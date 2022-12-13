import { ComponentUpdate } from "@latticexyz/recs";
import { get } from "svelte/store";
import { indexToID, entities } from "../entities";
import { seedToName } from "../../utils/name";

export function play(update: ComponentUpdate, isSelf: boolean) {
  const entity = get(entities)[indexToID(update.entity)];
  return ".:.:.:.:." + seedToName(entity.seed || 0) + " is making an ungodly noise";
}
