import { get } from "svelte/store";
import { ComponentUpdate } from "@latticexyz/recs";
import { seedToName } from "../../utils/name";
import { getDirection } from "../../utils/space";
import { indexToID, entities } from "../entities";
import { sample } from "lodash";

const secondPersonActions = ["You are moving ", "You walk "];

export function movement(update: ComponentUpdate, isSelf: boolean) {
  const from = update.value[1];
  const to = update.value[0];

  if (isSelf) {
    return sample(secondPersonActions) + getDirection(from, to);
  } else {
    const entity = get(entities)[indexToID(update.entity)];
    return seedToName(entity.seed) + " is moving " + getDirection(from, to);
  }
}
